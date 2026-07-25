/* decks.js — built-in sample decks. Shape: { id, name, blurb, cards:[{q,a}] } */

(function (global) {
  'use strict';

  var BUILTIN = [
    {
      id: 'capitals',
      name: 'CAPITALS',
      blurb: 'Countries and their capital cities',
      cards: [
        { q: 'Japan',        a: 'Tokyo' },
        { q: 'Australia',    a: 'Canberra' },
        { q: 'Brazil',       a: 'Brasilia' },
        { q: 'Canada',       a: 'Ottawa' },
        { q: 'Egypt',        a: 'Cairo' },
        { q: 'Norway',       a: 'Oslo' },
        { q: 'Kenya',        a: 'Nairobi' },
        { q: 'Vietnam',      a: 'Hanoi' },
        { q: 'Morocco',      a: 'Rabat' },
        { q: 'New Zealand',  a: 'Wellington' },
        { q: 'Switzerland',  a: 'Bern' },
        { q: 'Turkey',       a: 'Ankara' },
        { q: 'Portugal',     a: 'Lisbon' },
        { q: 'Peru',         a: 'Lima' },
        { q: 'Iceland',      a: 'Reykjavik' },
        { q: 'Thailand',     a: 'Bangkok' }
      ]
    },
    {
      id: 'elements',
      name: 'ELEMENTS',
      blurb: 'Chemical symbols worth knowing',
      cards: [
        { q: 'Potassium', a: 'K' },
        { q: 'Iron',      a: 'Fe' },
        { q: 'Sodium',    a: 'Na' },
        { q: 'Gold',      a: 'Au' },
        { q: 'Silver',    a: 'Ag' },
        { q: 'Tin',       a: 'Sn' },
        { q: 'Lead',      a: 'Pb' },
        { q: 'Copper',    a: 'Cu' },
        { q: 'Mercury',   a: 'Hg' },
        { q: 'Tungsten',  a: 'W' },
        { q: 'Helium',    a: 'He' },
        { q: 'Neon',      a: 'Ne' },
        { q: 'Zinc',      a: 'Zn' },
        { q: 'Antimony',  a: 'Sb' }
      ]
    },
    {
      id: 'spanish',
      name: 'SPANISH 101',
      blurb: 'Everyday verbs, English to Spanish',
      cards: [
        { q: 'to eat',    a: 'comer' },
        { q: 'to drink',  a: 'beber' },
        { q: 'to run',    a: 'correr' },
        { q: 'to speak',  a: 'hablar' },
        { q: 'to write',  a: 'escribir' },
        { q: 'to read',   a: 'leer' },
        { q: 'to sleep',  a: 'dormir' },
        { q: 'to buy',    a: 'comprar' },
        { q: 'to open',   a: 'abrir' },
        { q: 'to live',   a: 'vivir' },
        { q: 'to walk',   a: 'caminar' },
        { q: 'to work',   a: 'trabajar' },
        { q: 'to sing',   a: 'cantar' },
        { q: 'to laugh',  a: 'reir' }
      ]
    },
    {
      id: 'shortcuts',
      name: 'SHORTCUTS',
      blurb: 'Terminal and editor muscle memory',
      cards: [
        { q: 'Kill the foreground process',  a: 'Ctrl C' },
        { q: 'Search command history',       a: 'Ctrl R' },
        { q: 'Jump to start of line',        a: 'Ctrl A' },
        { q: 'Jump to end of line',          a: 'Ctrl E' },
        { q: 'Clear the screen',             a: 'Ctrl L' },
        { q: 'Suspend to background',        a: 'Ctrl Z' },
        { q: 'Delete word before cursor',    a: 'Ctrl W' },
        { q: 'Paste last killed text',       a: 'Ctrl Y' },
        { q: 'Close the current shell',      a: 'Ctrl D' },
        { q: 'Swap the last two characters', a: 'Ctrl T' }
      ]
    }
  ];

  global.Decks = { BUILTIN: BUILTIN };
})(window);
