/* store.js — localStorage persistence for custom decks and per-card stats.
   Deliberately dumb: whole-blob read/write, no migrations yet. */

(function (global) {
  'use strict';

  var KEY_DECKS = 'myflash.decks.v1';
  var KEY_STATS = 'myflash.stats.v1';
  var KEY_PREFS = 'myflash.prefs.v1';

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

  function allDecks() { return global.Decks.BUILTIN.concat(customDecks()); }

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
    allDecks: allDecks,
    deckById: deckById,
    stats: stats,
    recordAnswer: recordAnswer,
    cardStrength: cardStrength,
    deckStrength: deckStrength,
    topics: topics,
    deckProgress: deckProgress,
    resetProgress: resetProgress
  };
})(window);
