/* store.js — localStorage persistence for custom decks and per-card stats.
   Deliberately dumb: whole-blob read/write, no migrations yet. */

(function (global) {
  'use strict';

  var KEY_DECKS = 'myflash.decks.v1';
  var KEY_STATS = 'myflash.stats.v1';
  var KEY_PREFS = 'myflash.prefs.v1';

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
    /* The subject the home screen shows; null means the first one. */
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

  function allDecks() {
    return global.Decks.BUILTIN.concat(customDecks().map(retireOrder));
  }

  function deckById(id) {
    return allDecks().filter(function (d) { return d.id === id; })[0] || null;
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
    if (clean) { e.right++; e.streak++; } else { e.wrong++; e.streak = 0; }
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

    for (var i = 0; i < total; i++) {
      var e = all[deck.id + ':' + i];
      var v = cardStrength(e, now);
      sum += v;
      if (v < WEAK) weak++;
      if (e && e.seen) seen++;
    }

    return {
      strength: total ? sum / total : 0,
      weak: weak,
      seen: seen,
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

  function subjects() {
    var seen = {}, out = [];
    allDecks().forEach(function (deck) {
      var name = subjectOf(deck);
      if (!seen[name]) { seen[name] = { name: name, topics: {}, cards: 0 }; out.push(seen[name]); }
      seen[name].topics[deck.topic || 'Other'] = true;
      seen[name].cards += deck.cards.length;
    });
    return out.map(function (s) {
      return { name: s.name, topics: Object.keys(s.topics).length, cards: s.cards };
    });
  }

  function currentSubject() {
    var all = subjects();
    var want = setting('subject');
    var hit = all.filter(function (s) { return s.name === want; })[0];
    return (hit || all[0] || { name: DEFAULT_SUBJECT }).name;
  }

  /* ── Question decks ───────────────────────────────────────
     A deck with kind "questions" holds the longer, vignette-style
     questions for its topic. It opens once every flashcard in the
     topic's other decks has been answered right at least once. */
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

  function topics(subject) {
    var groups = {}, order = [];
    var want = subject || currentSubject();

    allDecks().forEach(function (deck) {
      if (subjectOf(deck) !== want) return;
      var name = deck.topic || 'Other';
      if (!groups[name]) { groups[name] = { name: name, decks: [], questions: [] }; order.push(name); }
      (isQuestions(deck) ? groups[name].questions : groups[name].decks).push(deck);
    });

    var out = order.map(function (name) {
      var g = groups[name];
      var cards = 0, sum = 0, weak = 0, started = 0;

      g.questions.forEach(function (deck) { deck._strength = deckStrength(deck); });
      var gate = learnedCount(g.decks);

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

  function resetProgress() { write(KEY_STATS, {}); }

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
    WEAK: WEAK,
    topics: topics,
    deckProgress: deckProgress,
    resetProgress: resetProgress
  };
})(window);
