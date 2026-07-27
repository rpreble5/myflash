/* store.js — localStorage persistence for custom decks and per-card stats.
   Deliberately dumb: whole-blob read/write, no migrations yet. */

(function (global) {
  'use strict';

  var KEY_DECKS = 'myflash.decks.v1';
  var KEY_STATS = 'myflash.stats.v1';
  var KEY_PREFS = 'myflash.prefs.v1';
  var KEY_LOOKS = 'myflash.looks.v1';

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

  /* Look feedback. Recorded in the moment, mid-session, because that is
     the only time the reaction is honest — a look pulled up in a judging
     tool is being assessed, not lived with.

     The whole tuple goes in, not just the palette. A palette marked
     across many different backdrops is a bad palette; one marked only
     under grain is a bad pairing, and those want opposite fixes. */
  function markLook(look) {
    var all = read(KEY_LOOKS, []);
    var key = lookKey(look);
    var i = all.findIndex(function (l) { return lookKey(l) === key; });
    if (i >= 0) { all.splice(i, 1); write(KEY_LOOKS, all); return false; }
    all.push({
      palette: look.palette, backdrop: look.backdrop, tier: look.tier,
      font: look.font, treatment: look.treatment, grain: look.grain || null,
      at: Date.now()
    });
    write(KEY_LOOKS, all);
    return true;
  }

  function lookKey(l) {
    return [l.palette, l.backdrop, l.font, l.treatment, l.grain || ''].join('|');
  }

  function looks() { return read(KEY_LOOKS, []); }
  function clearLooks() { write(KEY_LOOKS, []); }

  /* Counts per palette, worst first — the shape of the question being
     asked, which is "which of these should go". */
  function lookTally() {
    var by = {};
    looks().forEach(function (l) {
      if (!by[l.palette]) by[l.palette] = { name: l.palette, n: 0, backdrops: {} };
      by[l.palette].n++;
      by[l.palette].backdrops[l.backdrop] = true;
    });
    return Object.keys(by).map(function (k) {
      var e = by[k];
      e.spread = Object.keys(e.backdrops).length;
      return e;
    }).sort(function (a, b) { return b.n - a.n; });
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
    deleteDeck: deleteDeck,
    allDecks: allDecks,
    deckById: deckById,
    stats: stats,
    recordAnswer: recordAnswer,
    markLook: markLook,
    looks: looks,
    lookTally: lookTally,
    clearLooks: clearLooks,
    cardStrength: cardStrength,
    deckStrength: deckStrength,
    topics: topics,
    deckProgress: deckProgress,
    resetProgress: resetProgress
  };
})(window);
