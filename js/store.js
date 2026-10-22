/* store.js — localStorage persistence for custom decks and per-card stats.
   Deliberately dumb: whole-blob read/write, no migrations yet. */

(function (global) {
  'use strict';

  var KEY_DECKS = 'myflash.decks.v1';
  var KEY_STATS = 'myflash.stats.v1';
  var KEY_PREFS = 'myflash.prefs.v1';
  var KEY_CHALLENGE = 'myflash.challenge.v1';
  var KEY_NOTES = 'myflash.notes.v1';

  /* Left behind by the retired look feedback. Nothing reads them now. */
  try {
    localStorage.removeItem('myflash.looks.v1');
    localStorage.removeItem('myflash.shown.v1');
  } catch (e) { /* storage blocked */ }

  /* Put-in-order cards were retired. Three built-in ones were deleted
     outright, which moved every later card in those decks up one place,
     and progress is keyed by position — so it moves with them. Once. */
  (function () {
    var FLAG = 'myflash.migrated.order-retired';
    try {
      if (localStorage.getItem(FLAG)) return;
      var raw = localStorage.getItem(KEY_STATS);
      var all = raw ? JSON.parse(raw) : {};
      [['dka', 14], ['htn-management', 3], ['af-management', 8]].forEach(function (r) {
        var prefix = r[0] + ':', gone = r[1], moved = {};
        Object.keys(all).forEach(function (k) {
          if (k.indexOf(prefix) !== 0) return;
          var i = Number(k.slice(prefix.length));
          if (i === gone) delete all[k];
          else if (i > gone) { moved[prefix + (i - 1)] = all[k]; delete all[k]; }
        });
        Object.keys(moved).forEach(function (k) { all[k] = moved[k]; });
      });
      if (raw) localStorage.setItem(KEY_STATS, JSON.stringify(all));
      localStorage.setItem(FLAG, '1');
    } catch (e) { /* storage blocked */ }
  })();

  /* Anything not listed here is not a setting. Defaults are the current
     behaviour, so an empty store behaves exactly as before. */
  var DEFAULTS = {
    submitOnRelease: false,
    numberSlider: false,
    /* The collection and subject last opened; null means the first one. */
    collection: null,
    subject: null,
    sound: true,
    haptics: true
  };

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* quota / private mode */ }
  }

  function customDecks() { return read(KEY_DECKS, []); }

  function saveDeck(deck) {
    var decks = customDecks();
    var i = decks.findIndex(function (d) { return d.id === deck.id; });
    if (i >= 0) decks[i] = deck; else decks.push(deck);
    write(KEY_DECKS, decks);
  }

  /* Built-in decks live in the source file and cannot be removed from
     here; everything a generator produces can. Progress goes with the
     deck — leaving orphan stats behind means reinstalling the same id
     silently inherits a stranger's history. */
  function deleteDeck(id) {
    var decks = customDecks();
    var kept = decks.filter(function (d) { return d.id !== id; });
    if (kept.length === decks.length) return false;
    write(KEY_DECKS, kept);

    var all = stats(), prefix = id + ':';
    Object.keys(all).forEach(function (k) {
      if (k.indexOf(prefix) === 0) delete all[k];
    });
    write(KEY_STATS, all);
    return true;
  }

  /* A generated deck from before put-in-order was retired may still carry
     one. It becomes a pick-one card asking for the first step, rather than
     rendering blank. */
  function retireOrder(deck) {
    if (!deck.cards.some(function (c) { return c.type === 'order'; })) return deck;
    var copy = {};
    Object.keys(deck).forEach(function (k) { copy[k] = deck[k]; });
    copy.cards = deck.cards.map(function (c) {
      if (c.type !== 'order' || !c.steps || c.steps.length < 2) return c;
      return { type: 'mcq', q: c.q + ': the first step', a: c.steps[0],
               distractors: c.steps.slice(1, 4), why: c.why };
    });
    return copy;
  }

  /* ── The library ──────────────────────────────────────────
     Per-deck choices made in the app that the source cannot hold: a
     deck hidden from the lists and drills, or moved to another
     collection or subject. Kept apart from the decks so a built-in deck
     can be hidden or moved without touching its file. */
  var KEY_LIB = 'myflash.library.v1';
  function library() { return read(KEY_LIB, { hidden: {}, moves: {} }); }

  /* Every deck as the app should see it: the override applied, hidden
     decks left out unless asked for. */
  function allDecks(includeHidden) {
    var lib = library();
    var out = [];
    global.Decks.BUILTIN.concat(customDecks().map(retireOrder)).forEach(function (deck) {
      var hidden = !!lib.hidden[deck.id];
      if (hidden && !includeHidden) return;
      var mv = lib.moves[deck.id];
      if (!mv && !hidden) { out.push(deck); return; }
      var copy = {};
      Object.keys(deck).forEach(function (k) { copy[k] = deck[k]; });
      if (mv) { copy.collection = mv.collection; copy.subject = mv.subject; }
      copy.hidden = hidden;
      out.push(copy);
    });
    return out;
  }

  function deckById(id) {
    return allDecks(true).filter(function (d) { return d.id === id; })[0] || null;
  }

  function isCustom(id) {
    return customDecks().some(function (d) { return d.id === id; });
  }

  function hideDeck(id, hidden) {
    var lib = library();
    if (hidden) lib.hidden[id] = true; else delete lib.hidden[id];
    write(KEY_LIB, lib);
  }

  function moveDeck(id, collection, subject) {
    var lib = library();
    lib.moves[id] = { collection: collection, subject: subject };
    write(KEY_LIB, lib);
  }

  function resetDeckProgress(id) {
    var all = stats(), prefix = id + ':';
    Object.keys(all).forEach(function (k) { if (k.indexOf(prefix) === 0) delete all[k]; });
    write(KEY_STATS, all);
  }

  /* Decks pasted in as JSON: one deck or an array. Each must have an id,
     a name and cards; subject and topic come from the deck, and the
     collection from the deck or the one chosen at import. Returns what
     was added, or throws with a reason. */
  function importDecks(text, collection) {
    var data = JSON.parse(text);
    var list = Array.isArray(data) ? data : [data];
    var added = [];
    list.forEach(function (d, i) {
      if (!d || typeof d !== 'object') throw new Error('Item ' + (i + 1) + ' is not a deck.');
      if (!d.id || !d.name || !Array.isArray(d.cards) || !d.cards.length) {
        throw new Error('Deck ' + (d.id || i + 1) + ' needs an id, a name and cards.');
      }
      if (!d.collection) d.collection = collection || DEFAULT_COLLECTION;
      saveDeck(d);
      added.push(d);
    });
    return added;
  }

  /* stats: { "deckId:cardIndex": { seen, right, wrong, streak, s, at } }
       s   recency-weighted score, 0..1
       at  when it was last answered, ms                                */
  function stats() { return read(KEY_STATS, {}); }

  var DAY = 86400000;

  /* How much a single answer moves a card's score. At 0.4 the last three
     or four answers dominate, so an early bad run washes out instead of
     staining the card forever the way a lifetime average would. */
  var ALPHA = 0.4;

  /* Knowledge fades, and the ranking has to fade with it or it freezes
     the moment everything has been seen once. Half-life doubles with each
     consecutive correct answer — 3 days, 6, 12, 24, 48 — which is the one
     useful idea in spaced repetition without any of the scheduling. */
  function halfLife(streak) {
    return Math.min(90, 3 * Math.pow(2, Math.min(streak, 5)));
  }

  /* `correct` is really a score in 0..1. Most card types grade themselves
     and several award partial credit — a 4-of-5 bucket is real information
     that a boolean throws on the floor. */
  function recordAnswer(deckId, cardIndex, score) {
    score = typeof score === 'boolean' ? (score ? 1 : 0) : Math.max(0, Math.min(1, Number(score) || 0));
    var all = stats();
    var k = deckId + ':' + cardIndex;
    var e = all[k] || { seen: 0, right: 0, wrong: 0, streak: 0 };
    var clean = score >= 0.999;

    e.seen++;
    if (clean) { e.right++; e.streak++; } else { e.wrong++; e.streak = 0; e.wrongAt = Date.now(); }
    e.s = e.s == null ? score : e.s + ALPHA * (score - e.s);
    e.at = Date.now();

    all[k] = e;
    write(KEY_STATS, all);
  }

  /* 0..1. Unseen is 0 — you do not know a card you have never met. */
  function cardStrength(e, now) {
    if (!e || !e.seen) return 0;
    /* Progress recorded before scores and timestamps existed: fall back to
       lifetime accuracy, and treat it as answered now rather than letting
       months of imaginary decay wipe it out. */
    var s = e.s == null ? (e.right / Math.max(1, e.right + e.wrong)) : e.s;
    var days = e.at == null ? 0 : Math.max(0, (now - e.at) / DAY);
    return s * Math.pow(0.5, days / halfLife(e.streak));
  }

  var WEAK = 0.5;

  function deckStrength(deck) {
    var all = stats();
    var now = Date.now();
    var total = deck.cards.length;
    var sum = 0, weak = 0, seen = 0;

    /* "Weak" means met and not known. A card never met counts against
       the strength, since you do not know it, but it is unseen, not
       weak: the two call for different actions. */
    for (var i = 0; i < total; i++) {
      var e = all[deck.id + ':' + i];
      var v = cardStrength(e, now);
      sum += v;
      if (e && e.seen) { seen++; if (v < WEAK) weak++; }
    }

    return {
      strength: total ? sum / total : 0,
      weak: weak,
      seen: seen,
      unseen: total - seen,
      total: total,
      started: seen > 0
    };
  }

  /* The cards worth a short session, weakest first.

     The strength model has ranked topics and decks since it was built and
     has never chosen a single card. That left the common case — open the
     weakest topic, get all twenty-nine cards including the six answered
     right five times running — no better than shuffling.

     Unseen cards score zero, so on an untouched topic everything is weak
     and ties. That is correct rather than a special case: a card you have
     never met is one you do not know, and the cap turns it into a short
     first run instead of a wrong answer.

     Returns positions, not cards, so the caller can keep them grouped. */
  function weakCards(decks, limit) {
    var all = stats(), now = Date.now(), picked = [];

    decks.forEach(function (deck, di) {
      for (var i = 0; i < deck.cards.length; i++) {
        var v = cardStrength(all[deck.id + ':' + i], now);
        if (v < WEAK) picked.push({ deck: di, card: i, strength: v });
      }
    });

    picked.sort(function (a, b) { return a.strength - b.strength; });
    return limit ? picked.slice(0, limit) : picked;
  }

  /* ── Repair, coverage and slippage ─────────────────────────
     Three different situations hide inside "weak":
       - a card you have met and keep getting wrong (repair: drill it),
       - a card you have never met (coverage: start it, do not drill it),
       - a card you knew whose score has decayed under the line since you
         last answered it (slippage: it is due).
     A drill that mixes the first two is mostly a first pass in disguise,
     so the three are kept apart. */

  /* How much a recent miss pulls a card up the drill order. A miss
     yesterday is worth more than the same score reached by a slow fade
     over a month; the pull halves every three days. */
  var MISS_PULL = 0.3, MISS_HALF = 3;

  function drillPriority(e, now) {
    var v = cardStrength(e, now);
    if (!e || e.wrongAt == null) return v;
    var days = Math.max(0, (now - e.wrongAt) / DAY);
    return v - MISS_PULL * Math.pow(0.5, days / MISS_HALF);
  }

  /* Seen cards that are weak, the ones to repair first at the front.
     Returns positions into `decks`, worst first. */
  function drillCards(decks, limit) {
    var all = stats(), now = Date.now(), picked = [];
    decks.forEach(function (deck, di) {
      for (var i = 0; i < deck.cards.length; i++) {
        var e = all[deck.id + ':' + i];
        if (!e || !e.seen) continue;
        if (cardStrength(e, now) < WEAK) picked.push({ deck: di, card: i, priority: drillPriority(e, now) });
      }
    });
    picked.sort(function (a, b) { return a.priority - b.priority; });
    return limit ? picked.slice(0, limit) : picked;
  }

  /* Cards never answered, in deck order. */
  function unseenCards(decks, limit) {
    var all = stats(), picked = [];
    decks.forEach(function (deck, di) {
      for (var i = 0; i < deck.cards.length; i++) {
        var e = all[deck.id + ':' + i];
        if (!e || !e.seen) picked.push({ deck: di, card: i });
      }
    });
    return limit ? picked.slice(0, limit) : picked;
  }

  /* Cards that were above the line when last answered and have faded
     under it since. No schedule, only the decay the ranking already uses. */
  function dueCount(decks) {
    var all = stats(), now = Date.now(), n = 0;
    decks.forEach(function (deck) {
      for (var i = 0; i < deck.cards.length; i++) {
        var e = all[deck.id + ':' + i];
        if (!e || !e.seen || e.s == null) continue;
        if (e.s >= WEAK && cardStrength(e, now) < WEAK) n++;
      }
    });
    return n;
  }

  /* The decks of a subject, in home order (topics weakest first, decks
     weakest first within each), with question decks left out. */
  function subjectDecks(subject) {
    var out = [];
    topics(subject).forEach(function (t) { t.decks.forEach(function (d) { out.push(d); }); });
    return out;
  }

  /* Decks grouped by their topic, everything ranked weakest first.

     A topic's strength is the mean over all its cards, not the mean of its
     decks' means. Averaging averages lets a five-card deck drag a topic
     down as hard as a hundred-card one, and produces the classic result
     where every deck improves and the total falls. */
  /* ── Subjects ─────────────────────────────────────────────
     The top level: separate bodies of material, studied apart. A deck
     names its subject; the built-in decks, and anything older that
     names none, belong to the default one. */
  var DEFAULT_SUBJECT = 'Family Medicine';

  function subjectOf(deck) { return deck.subject || DEFAULT_SUBJECT; }

  /* ── Collections ──────────────────────────────────────────
     The level above subjects: separate bodies of material with their
     own purpose. A deck names its collection; everything that names
     none is exam material. The two below always exist, even empty, so
     there is somewhere to put the first article. */
  var DEFAULT_COLLECTION = 'ITE Prep';
  var COLLECTIONS = ['ITE Prep', 'Journal Articles'];

  function collectionOf(deck) { return deck.collection || DEFAULT_COLLECTION; }

  function collections() {
    var seen = {}, out = [];
    COLLECTIONS.forEach(function (name) { seen[name] = { name: name, subjects: {}, cards: 0, sum: 0, decks: 0 }; out.push(seen[name]); });
    allDecks().forEach(function (deck) {
      if (isQuestions(deck)) return;
      var name = collectionOf(deck);
      if (!seen[name]) { seen[name] = { name: name, subjects: {}, cards: 0, sum: 0, decks: 0 }; out.push(seen[name]); }
      var c = seen[name];
      c.subjects[subjectOf(deck)] = true;
      var d = deckStrength(deck);
      c.cards += d.total;
      c.sum += d.strength * d.total;
      c.decks++;
    });
    return out.map(function (c) {
      return { name: c.name, subjects: Object.keys(c.subjects).length, decks: c.decks, cards: c.cards,
               strength: c.cards ? c.sum / c.cards : 0 };
    });
  }

  function currentCollection() {
    var want = setting('collection');
    var all = collections();
    var hit = all.filter(function (c) { return c.name === want; })[0];
    return (hit || all[0]).name;
  }

  /* The subjects of one collection, weakest first, with the counts the
     collection screen shows on each row. */
  function subjects(collection) {
    var coll = collection || currentCollection();
    var seen = {}, out = [];
    allDecks().forEach(function (deck) {
      if (collectionOf(deck) !== coll) return;
      var name = subjectOf(deck);
      if (!seen[name]) { seen[name] = { name: name, topics: {}, cards: 0 }; out.push(seen[name]); }
      seen[name].topics[deck.topic || 'Other'] = true;
      if (!isQuestions(deck)) seen[name].cards += deck.cards.length;
    });
    var rows = out.map(function (s) {
      var ts = topics(s.name, coll);
      var cards = 0, sum = 0, weak = 0, unseen = 0, due = 0, started = false;
      ts.forEach(function (t) {
        cards += t.cards; sum += t.strength * t.cards; weak += t.weak; unseen += t.unseen; due += t.due;
        if (t.started) started = true;
      });
      return { name: s.name, collection: coll, topics: ts.length, cards: cards,
               strength: cards ? sum / cards : 0, weak: weak, unseen: unseen, due: due, started: started };
    });
    rows.sort(function (a, b) {
      if (a.started !== b.started) return a.started ? -1 : 1;
      return a.strength - b.strength;
    });
    return rows;
  }

  function currentSubject() {
    var all = subjects();
    var want = setting('subject');
    var hit = all.filter(function (s) { return s.name === want; })[0];
    return (hit || all[0] || { name: DEFAULT_SUBJECT }).name;
  }

  /* Every flashcard deck in a collection, in subject order. */
  function collectionDecks(collection) {
    var out = [];
    subjects(collection).forEach(function (s) {
      topics(s.name, collection).forEach(function (t) { t.decks.forEach(function (d) { out.push(d); }); });
    });
    return out;
  }

  /* ── Question decks ───────────────────────────────────────
     A deck with kind "questions" holds the longer, vignette-style
     questions. One that names a flashcard deck in `for` belongs to that
     deck and opens once each of its cards has been answered right at
     least once; one that names none belongs to the whole topic and
     waits for every flashcard in it. */
  function isQuestions(deck) { return deck.kind === 'questions'; }

  function learnedCount(decks) {
    var all = stats(), learned = 0, total = 0;
    decks.forEach(function (deck) {
      deck.cards.forEach(function (_, i) {
        total++;
        var e = all[deck.id + ':' + i];
        if (e && e.right > 0) learned++;
      });
    });
    return { learned: learned, total: total };
  }

  function topics(subject, collection) {
    var groups = {}, order = [];
    var coll = collection || currentCollection();
    var want = subject || currentSubject();

    allDecks().forEach(function (deck) {
      if (collectionOf(deck) !== coll || subjectOf(deck) !== want) return;
      var name = deck.topic || 'Other';
      if (!groups[name]) { groups[name] = { name: name, decks: [], questions: [] }; order.push(name); }
      (isQuestions(deck) ? groups[name].questions : groups[name].decks).push(deck);
    });

    var out = order.map(function (name) {
      var g = groups[name];
      var cards = 0, sum = 0, weak = 0, started = 0;

      var gate = learnedCount(g.decks);
      g.questions.forEach(function (deck) {
        deck._strength = deckStrength(deck);
        var parent = deck.for && g.decks.filter(function (d) { return d.id === deck.for; })[0];
        var own = parent ? learnedCount([parent]) : gate;
        deck._gate = { learned: own.learned, total: own.total, unlocked: own.learned >= own.total };
      });

      g.decks.forEach(function (deck) {
        var d = deckStrength(deck);
        deck._strength = d;
        cards += d.total;
        sum += d.strength * d.total;
        weak += d.weak;
        if (d.started) started++;
      });

      g.decks.sort(function (a, b) { return a._strength.strength - b._strength.strength; });

      return {
        name: name,
        decks: g.decks,
        questions: g.questions,
        /* Open when there are no flashcards to finish first. */
        unlocked: gate.learned >= gate.total,
        learned: gate.learned,
        flashcards: gate.total,
        strength: cards ? sum / cards : 0,
        weak: weak,
        unseen: unseenCards(g.decks).length,
        due: dueCount(g.decks),
        cards: cards,
        startedDecks: started,
        started: started > 0
      };
    });

    /* Untouched material is a different situation from material you are
       failing, and calls for a different action, so it does not compete
       for the top of the same list. */
    out.sort(function (a, b) {
      if (a.started !== b.started) return a.started ? -1 : 1;
      return a.strength - b.strength;
    });

    return out;
  }

  /* Kept for the summary screen. */
  function deckProgress(deck) {
    var d = deckStrength(deck);
    return { learned: d.total - d.weak, total: d.total };
  }

  function resetProgress() { write(KEY_STATS, {}); write(KEY_CHALLENGE, {}); }

  /* Notes left on cards while studying — what should be different about
     a card — kept until they are copied out and cleared. */
  function notes() { return read(KEY_NOTES, []); }
  function addNote(note) {
    var all = notes();
    note.when = Date.now();
    all.push(note);
    write(KEY_NOTES, all);
  }
  function clearNotes() { write(KEY_NOTES, []); }

  /* ── Flags ────────────────────────────────────────────────
     A card marked while studying to come back to, or to export. Notes
     are about fixing the card; a flag is about learning it. */
  var KEY_FLAGS = 'myflash.flags.v1';
  function flags() { return read(KEY_FLAGS, {}); }
  function isFlagged(deckId, cardIndex) { return !!flags()[deckId + ':' + cardIndex]; }
  function toggleFlag(deckId, cardIndex) {
    var all = flags(), k = deckId + ':' + cardIndex;
    if (all[k]) delete all[k]; else all[k] = Date.now();
    write(KEY_FLAGS, all);
    return !!all[k];
  }
  /* Positions into `decks` of every flagged card, most recently flagged first. */
  function flaggedCards(decks) {
    var all = flags(), out = [];
    decks.forEach(function (deck, di) {
      for (var i = 0; i < deck.cards.length; i++) {
        var at = all[deck.id + ':' + i];
        if (at) out.push({ deck: di, card: i, at: at });
      }
    });
    out.sort(function (a, b) { return b.at - a.at; });
    return out;
  }

  /* Challenge progress: which topics have been beaten, by id. Kept apart
     from the card stats, since a challenge run teaches the strength model
     nothing it should act on. */
  function challengeBeaten() { return read(KEY_CHALLENGE, {}).beaten || {}; }
  function beatChallengeTopic(id) {
    var c = read(KEY_CHALLENGE, {});
    c.beaten = c.beaten || {};
    c.beaten[id] = Date.now();
    write(KEY_CHALLENGE, c);
  }

  function setting(key) {
    var prefs = read(KEY_PREFS, {});
    return prefs[key] == null ? DEFAULTS[key] : prefs[key];
  }

  function setSetting(key, value) {
    if (!(key in DEFAULTS)) return;
    var prefs = read(KEY_PREFS, {});
    prefs[key] = value;
    write(KEY_PREFS, prefs);
  }

  global.Store = {
    setting: setting,
    setSetting: setSetting,
    SETTING_DEFAULTS: DEFAULTS,
    subjects: subjects,
    currentSubject: currentSubject,
    subjectOf: subjectOf,
    customDecks: customDecks,
    saveDeck: saveDeck,
    deleteDeck: deleteDeck,
    allDecks: allDecks,
    deckById: deckById,
    stats: stats,
    recordAnswer: recordAnswer,
    cardStrength: cardStrength,
    deckStrength: deckStrength,
    weakCards: weakCards,
    drillCards: drillCards,
    unseenCards: unseenCards,
    dueCount: dueCount,
    subjectDecks: subjectDecks,
    collections: collections,
    currentCollection: currentCollection,
    collectionOf: collectionOf,
    collectionDecks: collectionDecks,
    COLLECTIONS: COLLECTIONS,
    isCustom: isCustom,
    hideDeck: hideDeck,
    moveDeck: moveDeck,
    resetDeckProgress: resetDeckProgress,
    importDecks: importDecks,
    isFlagged: isFlagged,
    toggleFlag: toggleFlag,
    flaggedCards: flaggedCards,
    WEAK: WEAK,
    topics: topics,
    deckProgress: deckProgress,
    resetProgress: resetProgress,
    challengeBeaten: challengeBeaten,
    beatChallengeTopic: beatChallengeTopic,
    notes: notes,
    addNote: addNote,
    clearNotes: clearNotes
  };
})(window);
