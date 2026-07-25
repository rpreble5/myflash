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
    submitOnRelease: false
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

  /* stats: { "deckId:cardIndex": { seen, right, wrong, streak } } */
  function stats() { return read(KEY_STATS, {}); }

  function recordAnswer(deckId, cardIndex, correct) {
    var s = stats();
    var k = deckId + ':' + cardIndex;
    var e = s[k] || { seen: 0, right: 0, wrong: 0, streak: 0 };
    e.seen++;
    if (correct) { e.right++; e.streak++; } else { e.wrong++; e.streak = 0; }
    s[k] = e;
    write(KEY_STATS, s);
  }

  /* A card is "learned" once answered right 3 times in a row. */
  function deckProgress(deck) {
    var s = stats();
    var learned = 0;
    for (var i = 0; i < deck.cards.length; i++) {
      var e = s[deck.id + ':' + i];
      if (e && e.streak >= 3) learned++;
    }
    return { learned: learned, total: deck.cards.length };
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
    deckProgress: deckProgress,
    resetProgress: resetProgress
  };
})(window);
