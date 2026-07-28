/* store.js — localStorage persistence for custom decks and per-card stats.
   Deliberately dumb: whole-blob read/write, no migrations yet. */

(function (global) {
  'use strict';

  var KEY_DECKS = 'myflash.decks.v1';
  var KEY_STATS = 'myflash.stats.v1';
  var KEY_PREFS = 'myflash.prefs.v1';
  var KEY_LOOKS = 'myflash.looks.v1';
  var KEY_SHOWN = 'myflash.shown.v1';

  /* Anything not listed here is not a setting. Defaults are the current
     behaviour, so an empty store behaves exactly as before. */
  var DEFAULTS = {
    submitOnRelease: false,
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

  /* Decks the app studies. The design-lab fixtures carry `lab: true` and
     are excluded here rather than deleted: they exist to exercise every
     card type against the theme engine, which is still worth having, but
     a home screen that ranks what to study next should not be offering
     REVEAL LAB alongside a real topic. Flip the flag to get them back. */
  function allDecks() {
    return global.Decks.BUILTIN.filter(function (d) { return !d.lab; }).concat(customDecks());
  }

  function deckById(id) {
    return allDecks().filter(function (d) { return d.id === id; })[0] || null;
  }

  /* Look feedback, attributed. A verdict on a whole card cannot say
     whether the colours were wrong or the typeface was, and those want
     opposite fixes — one culls a palette, the other culls a font, and a
     third only stops two good things being drawn together.

     So the record keeps the whole tuple AND which parts of it were
     blamed. A component that appears in marked looks without ever being
     blamed is evidence in its favour, which is the other half of the
     signal and free to collect. */
  var LOOK_PARTS = ['palette', 'font', 'backdrop', 'treatment', 'grain'];

  function lookKey(l) {
    return LOOK_PARTS.map(function (k) { return l[k] || ''; }).join('|');
  }

  function looks() { return read(KEY_LOOKS, []); }
  function clearLooks() { write(KEY_LOOKS, []); }

  /* Records written before the menu existed blamed the whole look; read
     them as everything flagged rather than dropping them. */
  function flagsOf(rec) {
    if (rec.flags) return rec.flags;
    var all = {};
    LOOK_PARTS.forEach(function (k) { if (rec[k]) all[k] = true; });
    return all;
  }

  function lookFlags(look) {
    var key = lookKey(look);
    var rec = looks().filter(function (l) { return lookKey(l) === key; })[0];
    return rec ? flagsOf(rec) : {};
  }

  /* Nothing flagged means nothing wrong: the record is removed rather
     than stored as an empty complaint. */
  function saveLook(look, flags) {
    var all = looks();
    var key = lookKey(look);
    var i = all.findIndex(function (l) { return lookKey(l) === key; });
    var any = LOOK_PARTS.some(function (k) { return flags[k]; });

    if (!any) {
      if (i >= 0) { all.splice(i, 1); write(KEY_LOOKS, all); }
      return false;
    }

    var rec = { tier: look.tier, flags: flags, at: Date.now() };
    LOOK_PARTS.forEach(function (k) { rec[k] = look[k] || null; });
    if (i >= 0) all[i] = rec; else all.push(rec);
    write(KEY_LOOKS, all);
    return true;
  }

  /* How often each component has been drawn at all. Without this the
     feedback has no denominator: fifteen palettes blamed once each says
     nothing until you know whether each was seen twice or twenty times.
     One counter per card render, which is cheap and the only way the
     next round can report rates instead of counts. */
  function noteShown(look) {
    var all = read(KEY_SHOWN, {});
    LOOK_PARTS.forEach(function (k) {
      var v = look[k];
      if (!v) return;
      all[k] = all[k] || {};
      all[k][v] = (all[k][v] || 0) + 1;
    });
    write(KEY_SHOWN, all);
  }

  function shownCounts() { return read(KEY_SHOWN, {}); }
  function clearShown() { write(KEY_SHOWN, {}); }

  /* Per component: how often it was blamed, and how often it merely
     turned up in a look someone disliked. */
  function lookTally() {
    var bucket = {};
    looks().forEach(function (rec) {
      var f = flagsOf(rec);
      LOOK_PARTS.forEach(function (k) {
        var v = rec[k];
        if (!v) return;
        bucket[k] = bucket[k] || {};
        bucket[k][v] = bucket[k][v] || { name: v, blamed: 0, seen: 0 };
        bucket[k][v].seen++;
        if (f[k]) bucket[k][v].blamed++;
      });
    });

    var shown = shownCounts();
    var out = {};
    Object.keys(bucket).forEach(function (k) {
      out[k] = Object.keys(bucket[k])
        .map(function (v) {
          var e = bucket[k][v];
          e.shown = (shown[k] && shown[k][v]) || 0;
          /* Rate only where there is a denominator to divide by. */
          e.rate = e.shown ? e.blamed / e.shown : null;
          return e;
        })
        .filter(function (e) { return e.blamed > 0; })
        .sort(function (a, b) {
          if (a.rate != null && b.rate != null && a.rate !== b.rate) return b.rate - a.rate;
          return b.blamed - a.blamed;
        });
    });
    return out;
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
  function topics() {
    var groups = {}, order = [];

    allDecks().forEach(function (deck) {
      var name = deck.topic || 'Other';
      if (!groups[name]) { groups[name] = { name: name, decks: [] }; order.push(name); }
      groups[name].decks.push(deck);
    });

    var out = order.map(function (name) {
      var g = groups[name];
      var cards = 0, sum = 0, weak = 0, started = 0;

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
    customDecks: customDecks,
    saveDeck: saveDeck,
    deleteDeck: deleteDeck,
    allDecks: allDecks,
    deckById: deckById,
    stats: stats,
    recordAnswer: recordAnswer,
    saveLook: saveLook,
    noteShown: noteShown,
    shownCounts: shownCounts,
    clearShown: clearShown,
    lookFlags: lookFlags,
    looks: looks,
    lookTally: lookTally,
    clearLooks: clearLooks,
    LOOK_PARTS: LOOK_PARTS,
    cardStrength: cardStrength,
    deckStrength: deckStrength,
    weakCards: weakCards,
    WEAK: WEAK,
    topics: topics,
    deckProgress: deckProgress,
    resetProgress: resetProgress
  };
})(window);
