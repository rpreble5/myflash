/* theme.js — the look engine.
   Every card gets a randomized theme, but the randomness is bounded:
   palettes are hand-paired for contrast, backdrops are drawn in the
   palette's own accent, and fonts are only ones that hold up at 200px. */

(function (global) {
  'use strict';

  /* ── Palettes ───────────────────────────────────────────────
     bg   page colour
     ink  primary text — always >= 7:1 against bg
     acc  accent used for backdrops, highlights, the answer
     dim  low-alpha accent for backdrop line work                */
  var PALETTES = [
    { name: 'voltage',   bg: '#0B0B0B', ink: '#F2F200', acc: '#FF2D95', dim: 'rgba(242,242,0,.14)' },
    { name: 'siren',     bg: '#FF3B30', ink: '#FFF8E7', acc: '#1B1BFF', dim: 'rgba(255,248,231,.20)' },
    { name: 'blueprint', bg: '#1B1BFF', ink: '#FFE600', acc: '#00E5A0', dim: 'rgba(255,230,0,.18)' },
    { name: 'toxic',     bg: '#04150F', ink: '#00E5A0', acc: '#C6FF00', dim: 'rgba(0,229,160,.16)' },
    { name: 'hyper',     bg: '#14001F', ink: '#FF2D95', acc: '#00C2FF', dim: 'rgba(255,45,149,.18)' },
    { name: 'orchid',    bg: '#7B2FFF', ink: '#F2E9FF', acc: '#FFE600', dim: 'rgba(242,233,255,.20)' },
    { name: 'ember',     bg: '#1A0A00', ink: '#FF6B00', acc: '#FFD400', dim: 'rgba(255,107,0,.18)' },
    { name: 'deepdive',  bg: '#001622', ink: '#00C2FF', acc: '#FF3B30', dim: 'rgba(0,194,255,.16)' },
    { name: 'newsprint', bg: '#F3F1EA', ink: '#111111', acc: '#D6002F', dim: 'rgba(17,17,17,.13)' },
    { name: 'limelight', bg: '#101400', ink: '#C6FF00', acc: '#FF00A8', dim: 'rgba(198,255,0,.16)' },
    { name: 'clay',      bg: '#E8E2D6', ink: '#B4003C', acc: '#1B1BFF', dim: 'rgba(180,0,60,.15)' },
    { name: 'graphite',  bg: '#191919', ink: '#F5F5F5', acc: '#FF6B00', dim: 'rgba(245,245,245,.12)' },
    { name: 'bubblegum', bg: '#FF69B4', ink: '#20003A', acc: '#FFE600', dim: 'rgba(32,0,58,.16)' },
    { name: 'signal',    bg: '#FFE600', ink: '#0B0B0B', acc: '#1B1BFF', dim: 'rgba(11,11,11,.13)' }
  ];

  /* ── Fonts ─────────────────────────────────────────────────
     `tight` fonts get negative tracking; `wide` get positive.
     `caps` fonts read better forced to uppercase.               */
  var FONTS = [
    { face: '"Anton", sans-serif',           track: '-.02em', caps: true,  weight: 400 },
    { face: '"Archivo Black", sans-serif',   track: '-.03em', caps: false, weight: 400 },
    { face: '"Bebas Neue", sans-serif',      track: '.01em',  caps: true,  weight: 400 },
    { face: '"Bungee", sans-serif',          track: '0',      caps: true,  weight: 400 },
    { face: '"Alfa Slab One", serif',        track: '-.01em', caps: false, weight: 400 },
    { face: '"Righteous", sans-serif',       track: '0',      caps: false, weight: 400 },
    { face: '"Titan One", sans-serif',       track: '-.01em', caps: false, weight: 400 },
    { face: '"Shrikhand", serif',            track: '0',      caps: false, weight: 400 },
    { face: '"Syne", sans-serif',            track: '-.04em', caps: true,  weight: 800 },
    { face: '"Unbounded", sans-serif',       track: '-.03em', caps: false, weight: 900 },
    { face: '"Outfit", sans-serif',          track: '-.045em',caps: false, weight: 900 },
    { face: '"Rubik Mono One", sans-serif',  track: '-.02em', caps: false, weight: 400 },
    { face: '"Passion One", sans-serif',     track: '-.01em', caps: true,  weight: 900 },
    { face: '"Sora", sans-serif',            track: '-.04em', caps: false, weight: 800 }
  ];

  /* Answer/UI font — deliberately calmer than the question face. */
  var BODY_FACE = '"Space Grotesk", system-ui, sans-serif';

  /* ── Backdrops ─────────────────────────────────────────────
     Each returns { image, size } for CSS background shorthand.
     `drift` names the keyframe that slowly animates it.         */
  var BACKDROPS = [
    { name: 'stripes',  drift: 'drift-diag',
      make: function (c) { return { image: 'repeating-linear-gradient(45deg,' + c + ' 0 22px,transparent 22px 44px)', size: 'auto' }; } },
    { name: 'dots',     drift: 'drift-slow',
      make: function (c) { return { image: 'radial-gradient(' + c + ' 3px, transparent 3.5px)', size: '30px 30px' }; } },
    { name: 'grid',     drift: 'drift-slow',
      make: function (c) { return { image: 'linear-gradient(' + c + ' 2px,transparent 2px),linear-gradient(90deg,' + c + ' 2px,transparent 2px)', size: '68px 68px' }; } },
    { name: 'rays',     drift: 'drift-spin',
      make: function (c) { return { image: 'conic-gradient(from 0deg,' + c + ' 0 10deg,transparent 10deg 20deg)', size: 'auto' }; } },
    { name: 'rings',    drift: 'drift-pulse',
      make: function (c) { return { image: 'repeating-radial-gradient(circle at 50% 50%,' + c + ' 0 3px,transparent 3px 46px)', size: 'auto' }; } },
    { name: 'chevron',  drift: 'drift-vert',
      make: function (c) { return { image: 'repeating-linear-gradient(135deg,' + c + ' 0 14px,transparent 14px 28px),repeating-linear-gradient(45deg,' + c + ' 0 14px,transparent 14px 28px)', size: '80px 80px' }; } },
    { name: 'halftone', drift: 'drift-slow',
      make: function (c) { return { image: 'radial-gradient(' + c + ' 6px,transparent 7px),radial-gradient(' + c + ' 2px,transparent 3px)', size: '54px 54px, 54px 54px' }; } },
    { name: 'bars',     drift: 'drift-horiz',
      make: function (c) { return { image: 'repeating-linear-gradient(90deg,' + c + ' 0 5px,transparent 5px 40px)', size: 'auto' }; } },
    { name: 'blobs',    drift: 'drift-pulse',
      make: function (c) { return { image: 'radial-gradient(closest-side at 18% 22%,' + c + ',transparent),radial-gradient(closest-side at 82% 30%,' + c + ',transparent),radial-gradient(closest-side at 44% 88%,' + c + ',transparent)', size: '70% 60%, 60% 55%, 80% 65%' }; } },
    { name: 'crosses',  drift: 'drift-diag',
      make: function (c) { return { image: 'linear-gradient(' + c + ' 3px,transparent 3px),linear-gradient(90deg,' + c + ' 3px,transparent 3px)', size: '40px 40px' }; } },
    { name: 'ladder',   drift: 'drift-vert',
      make: function (c) { return { image: 'repeating-linear-gradient(0deg,' + c + ' 0 6px,transparent 6px 54px)', size: 'auto' }; } },
    { name: 'plain',    drift: null,
      make: function () { return { image: 'none', size: 'auto' }; } }
  ];

  /* ── Entrances ─────────────────────────────────────────────
     `perLetter` entrances stagger across split characters.      */
  var ENTRANCES = [
    { name: 'cascade', perLetter: true,  stagger: 34 },
    { name: 'drop',    perLetter: true,  stagger: 42 },
    { name: 'flipin',  perLetter: true,  stagger: 38 },
    { name: 'skewin',  perLetter: true,  stagger: 28 },
    { name: 'popin',   perLetter: true,  stagger: 30 },
    { name: 'slam',    perLetter: false, stagger: 0 },
    { name: 'blurin',  perLetter: false, stagger: 0 },
    { name: 'wipe',    perLetter: false, stagger: 0 },
    { name: 'rollin',  perLetter: false, stagger: 0 }
  ];

  /* ── Text treatments — applied to the question only ──────── */
  var TREATMENTS = ['plain', 'plain', 'plain', 'outline', 'shadow-hard', 'accent-words', 'stretch'];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* Avoid repeating the previous card's palette or font — back-to-back
     repeats are what make randomness *look* broken. */
  var last = { palette: null, font: null, backdrop: null, entrance: null };

  function pickFresh(arr, key) {
    if (arr.length < 2) return arr[0];
    var choice;
    do { choice = pick(arr); } while (choice === last[key]);
    last[key] = choice;
    return choice;
  }

  function random() {
    var palette  = pickFresh(PALETTES, 'palette');
    var font     = pickFresh(FONTS, 'font');
    var backdrop = pickFresh(BACKDROPS, 'backdrop');
    var entrance = pickFresh(ENTRANCES, 'entrance');
    var bd       = backdrop.make(palette.dim);

    return {
      palette: palette,
      font: font,
      backdrop: backdrop,
      backdropImage: bd.image,
      backdropSize: bd.size,
      entrance: entrance,
      treatment: pick(TREATMENTS)
    };
  }

  /* Push a theme onto an element as CSS custom properties. */
  function apply(el, theme) {
    var s = el.style;
    s.setProperty('--bg', theme.palette.bg);
    s.setProperty('--ink', theme.palette.ink);
    s.setProperty('--acc', theme.palette.acc);
    s.setProperty('--dim', theme.palette.dim);
    s.setProperty('--face', theme.font.face);
    s.setProperty('--track', theme.font.track);
    s.setProperty('--weight', theme.font.weight);
    s.setProperty('--body-face', BODY_FACE);
    s.setProperty('--backdrop-image', theme.backdropImage);
    s.setProperty('--backdrop-size', theme.backdropSize);
    el.dataset.treatment = theme.treatment;
    el.dataset.drift = theme.backdrop.drift || '';

    /* The HUD sits outside the card, so hand it the card's ink —
       guaranteed contrast without blend-mode guesswork. */
    document.body.style.setProperty('--hud-ink', theme.palette.ink);
  }

  global.Theme = {
    random: random,
    apply: apply,
    PALETTES: PALETTES,
    BODY_FACE: BODY_FACE
  };
})(window);
