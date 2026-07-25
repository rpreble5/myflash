/* theme.js — the look engine.

   Every card gets a randomized theme, but the randomness is bounded:
   palettes are hand-paired and contrast-checked, backdrops are drawn from
   the palette's own colours, and fonts are only ones that hold up at 200px.

   Backdrops are flat by design — hard colour stops, no soft gradients, no
   glow, no dimensional effects. Variety comes from colour and composition
   rather than texture density. They span four tiers from flat to loud, and
   any motion is slow enough to be felt rather than watched.               */

(function (global) {
  'use strict';

  /* ── Colour helpers ─────────────────────────────────────── */

  function rgbOf(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function hex(rgb) {
    return '#' + rgb.map(function (v) {
      return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    }).join('');
  }

  /* Opaque blend — `t` is how much of `a` survives. Flat fields need a
     real colour, not a translucent one stacked over the background. */
  function mix(a, b, t) {
    var x = rgbOf(a), y = rgbOf(b);
    return hex([0, 1, 2].map(function (i) { return x[i] * t + y[i] * (1 - t); }));
  }

  function rgba(h, alpha) {
    var c = rgbOf(h);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha + ')';
  }

  /* ── Palettes ───────────────────────────────────────────────
     bg   page colour
     ink  primary text
     acc  answers, highlights, and the louder backdrop shapes
     Contrast of ink-on-bg and acc-on-bg is verified in tools/       */
  var PALETTES = [
    { name: 'voltage',    bg: '#0B0B0B', ink: '#F2F200', acc: '#FF2D95' },
    { name: 'siren',      bg: '#C4241B', ink: '#FFF8E7', acc: '#FFE600' },
    { name: 'blueprint',  bg: '#1B1BFF', ink: '#FFE600', acc: '#00E5A0' },
    { name: 'toxic',      bg: '#04150F', ink: '#00E5A0', acc: '#C6FF00' },
    { name: 'hyper',      bg: '#14001F', ink: '#FF2D95', acc: '#00C2FF' },
    { name: 'orchid',     bg: '#5B18D9', ink: '#F2E9FF', acc: '#FFE600' },
    { name: 'ember',      bg: '#1A0A00', ink: '#FF6B00', acc: '#FFD400' },
    { name: 'deepdive',   bg: '#001622', ink: '#00C2FF', acc: '#FF6B5B' },
    { name: 'newsprint',  bg: '#F3F1EA', ink: '#111111', acc: '#C1002F' },
    { name: 'limelight',  bg: '#101400', ink: '#C6FF00', acc: '#FF00A8' },
    { name: 'clay',       bg: '#E8E2D6', ink: '#8F002F', acc: '#1B1BFF' },
    { name: 'graphite',   bg: '#191919', ink: '#F5F5F5', acc: '#FF6B00' },
    { name: 'bubblegum',  bg: '#FF69B4', ink: '#20003A', acc: '#0A2E00' },
    { name: 'signal',     bg: '#FFE600', ink: '#0B0B0B', acc: '#1B1BFF' },
    { name: 'mint',       bg: '#00E5A0', ink: '#04150F', acc: '#4B0082' },
    { name: 'cobalt',     bg: '#002A8F', ink: '#F5F5F5', acc: '#FFB300' },
    { name: 'rust',       bg: '#8F2600', ink: '#FFE9D6', acc: '#00E5A0' },
    { name: 'forest',     bg: '#06231A', ink: '#7FFFB2', acc: '#FFD400' },
    { name: 'plum',       bg: '#2B0A3D', ink: '#E6C8FF', acc: '#FF8A3D' },
    { name: 'sand',       bg: '#EFE0BE', ink: '#2B1B00', acc: '#A50E1C' },
    { name: 'ocean',      bg: '#013A4A', ink: '#9BE9FF', acc: '#FFB703' },
    { name: 'berry',      bg: '#4A0020', ink: '#FFC2DE', acc: '#7FFFB2' },
    { name: 'slate',      bg: '#2E3440', ink: '#ECEFF4', acc: '#8FD3E8' },
    { name: 'lemon',      bg: '#F7F7F2', ink: '#1B1B1B', acc: '#5B18D9' },
    { name: 'inkblue',    bg: '#0A1A3F', ink: '#FFD400', acc: '#FF8A8A' },
    { name: 'moss',       bg: '#C8D96F', ink: '#17210A', acc: '#8F002F' },
    { name: 'coral',      bg: '#FF6B5B', ink: '#21060A', acc: '#00325E' },
    { name: 'steel',      bg: '#C9D1D9', ink: '#10161D', acc: '#8F002F' },
    { name: 'nocturne',   bg: '#05010F', ink: '#B14DFF', acc: '#00FFC8' },
    { name: 'paperblue',  bg: '#DCE9F5', ink: '#0B2545', acc: '#A50E1C' },
    { name: 'oxide',      bg: '#F0EDE6', ink: '#003B36', acc: '#D65108' },
    { name: 'midnight',   bg: '#0D1B2A', ink: '#E0E1DD', acc: '#F4A259' }
  ];

  /* Per-palette derived tones, cached — flat shapes need opaque colours,
     textures need translucent ones. */
  var toneCache = {};
  function tones(p) {
    if (toneCache[p.name]) return toneCache[p.name];
    var t = {
      bg: p.bg,
      ink: p.ink,
      acc: p.acc,
      s1: mix(p.ink, p.bg, 0.07),   // barely-there flat field
      s2: mix(p.ink, p.bg, 0.14),   // readable flat field
      s3: mix(p.ink, p.bg, 0.22),   // assertive flat field
      a1: mix(p.acc, p.bg, 0.16),   // flat field in the accent
      a2: mix(p.acc, p.bg, 0.28),
      tQuiet: rgba(p.ink, 0.055),
      tMid:   rgba(p.ink, 0.09),
      tLoud:  rgba(p.ink, 0.15),
      tAcc:   rgba(p.acc, 0.13)
    };
    toneCache[p.name] = t;
    return t;
  }

  /* ── Fonts ─────────────────────────────────────────────────
     `tight` fonts get negative tracking; `caps` fonts read better
     forced to uppercase.                                        */
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

  var BODY_FACE = '"Space Grotesk", system-ui, sans-serif';

  /* ── SVG helper ────────────────────────────────────────────
     Vector shapes gradients can't express — ridges, waves, torn
     edges, angular blobs — as a data-URI background. No DOM, no
     network. viewBox is portrait-ish and `preserveAspectRatio:
     none` lets shapes stretch to any card.

     `encodeURIComponent` is not optional: an unescaped `#` in a
     colour ends the URL and the whole background silently dies. */
  function svgUrl(body) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140" ' +
              'preserveAspectRatio="none">' + body + '</svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }

  function svgBackdrop(body) { return { image: svgUrl(body), size: '100% 100%' }; }

  /* ── Layout zones ──────────────────────────────────────────
     The question sits in the vertical middle of the card, so
     composed shapes stay in the top/bottom thirds or bleed in
     from the sides. Nothing lands behind the text.             */
  function rand(a, b) { return a + Math.random() * (b - a); }

  function shapeIn(colour, zone, kind) {
    var s = { position: 'absolute', background: colour };

    /* Bars are sized in card-height units already, so they place directly. */
    if (kind === 'bar') {
      s.width  = rand(72, 124) + '%';
      s.height = rand(4.5, 9) + '%';
      s.left   = rand(-22, 4) + '%';
      if (zone === 'top' || zone === 'left') s.top = rand(3, 13) + '%';
      else s.bottom = rand(3, 15) + '%';
      return s;
    }

    /* Everything else is square (aspect-ratio 1), which means its width is
       a share of card WIDTH while top/bottom offsets are a share of card
       HEIGHT. Bleeding by a fraction of the width sent shapes almost
       entirely off a portrait card — hence the conversion. */
    var w = rand(30, 60);
    var hApprox = w * 0.46;              // portrait cards run about 0.46 w/h
    var bleed = hApprox * 0.36;

    s.width = w + '%';
    s.aspectRatio = '1';

    if (zone === 'top')    { s.top    = -bleed + '%';     s.left = rand(-12, 62) + '%'; }
    if (zone === 'bottom') { s.bottom = -bleed + '%';     s.left = rand(-12, 62) + '%'; }
    if (zone === 'left')   { s.left   = (-w * 0.42) + '%'; s.top    = rand(2, 10) + '%'; }
    if (zone === 'right')  { s.right  = (-w * 0.42) + '%'; s.bottom = rand(2, 12) + '%'; }

    if (kind === 'disc')  { s.borderRadius = '50%'; }
    if (kind === 'tri')   { s.clipPath = 'polygon(50% 0, 100% 100%, 0 100%)'; }
    if (kind === 'wedge') { s.clipPath = 'polygon(0 0, 100% 0, 0 100%)'; }
    if (kind === 'ring')  {
      s.borderRadius = '50%';
      s.background = 'transparent';
      s.border = 'clamp(5px, 1.5vw, 13px) solid ' + colour;
    }
    return s;
  }

  var ZONES = ['top', 'bottom', 'left', 'right'];
  var KINDS = ['disc', 'tri', 'wedge', 'ring', 'bar'];

  /* ── Backdrops ─────────────────────────────────────────────
     Four tiers, weighted so flat ~55%, quiet ~17%, mid ~18%,
     loud ~10%. Every stop is hard — no soft gradients anywhere.

     A backdrop supplies either `make` (a background-image) or
     `build` (a list of positioned flat layers).                */
  var BACKDROPS = [

    /* ---- flat: colour and composition, zero texture ---- */
    { name: 'solid', tier: 'flat', weight: 2.4, drift: null,
      make: function () { return { image: 'none', size: 'auto' }; } },

    { name: 'split-diag', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) { return { image: 'linear-gradient(148deg, ' + c.s1 + ' 0 46%, transparent 46%)', size: 'auto' }; } },

    { name: 'split-horiz', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) { return { image: 'linear-gradient(180deg, transparent 0 58%, ' + c.s1 + ' 58%)', size: 'auto' }; } },

    { name: 'split-vert', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) { return { image: 'linear-gradient(90deg, ' + c.s1 + ' 0 34%, transparent 34%)', size: 'auto' }; } },

    { name: 'corner', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) { return { image: 'linear-gradient(206deg, ' + c.a1 + ' 0 26%, transparent 26%)', size: 'auto' }; } },

    { name: 'disc', tier: 'flat', weight: 1.4, drift: 'drift-breathe',
      make: function (c) { return { image: 'radial-gradient(circle at 80% 16%, ' + c.s2 + ' 0 30%, transparent 30%)', size: 'auto' }; } },

    { name: 'disc-low', tier: 'flat', weight: 1.4, drift: 'drift-breathe',
      make: function (c) { return { image: 'radial-gradient(circle at 14% 86%, ' + c.a1 + ' 0 42%, transparent 42%)', size: 'auto' }; } },

    { name: 'band', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) { return { image: 'linear-gradient(180deg, transparent 0 38%, ' + c.s2 + ' 38% 54%, transparent 54%)', size: 'auto' }; } },

    { name: 'quarter', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) { return { image: 'radial-gradient(circle at 100% 100%, ' + c.s1 + ' 0 50%, transparent 50%)', size: 'auto' }; } },

    { name: 'twin-disc', tier: 'flat', weight: 1.4, drift: 'drift-breathe',
      make: function (c) {
        return { image: 'radial-gradient(circle at 20% 22%, ' + c.s1 + ' 0 22%, transparent 22%),' +
                        'radial-gradient(circle at 84% 74%, ' + c.a1 + ' 0 28%, transparent 28%)', size: 'auto' };
      } },

    { name: 'ring-flat', tier: 'flat', weight: 1.4, drift: 'drift-breathe',
      make: function (c) {
        return { image: 'radial-gradient(circle at 50% 34%, transparent 0 32%, ' + c.s2 + ' 32% 34.5%, transparent 34.5%)', size: 'auto' };
      } },

    { name: 'stack', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) {
        return { image: 'linear-gradient(180deg, transparent 0 52%, ' + c.s1 + ' 52% 64%, transparent 64% 72%,' +
                        c.s1 + ' 72% 84%, transparent 84%)', size: 'auto' };
      } },

    /* ---- flat, drawn in SVG: shapes gradients can't make ---- */
    { name: 'ridge', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) {
        return svgBackdrop('<path d="M0 140 L0 98 L17 79 L33 101 L52 66 L71 93 L87 71 L100 88 L100 140 Z" fill="' + c.s2 + '"/>');
      } },

    { name: 'wave', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) {
        return svgBackdrop('<path d="M0 140 L0 88 Q25 66 50 88 T100 88 L100 140 Z" fill="' + c.s1 + '"/>');
      } },

    { name: 'arc-top', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) {
        return svgBackdrop('<path d="M0 0 L100 0 L100 34 Q50 6 0 34 Z" fill="' + c.a1 + '"/>');
      } },

    { name: 'torn', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) {
        return svgBackdrop('<polygon points="0,0 100,0 100,44 76,36 52,50 28,38 0,52" fill="' + c.s2 + '"/>');
      } },

    { name: 'shard', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) {
        return svgBackdrop('<polygon points="12,14 60,3 93,30 84,64 42,74 6,50" fill="' + c.s1 + '"/>');
      } },

    { name: 'triads', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) {
        return svgBackdrop('<polygon points="0,140 38,88 76,140" fill="' + c.s2 + '"/>' +
                           '<polygon points="62,140 100,102 100,140" fill="' + c.a1 + '"/>');
      } },

    { name: 'steps-svg', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) {
        return svgBackdrop('<polygon points="0,140 0,118 25,118 25,130 50,130 50,116 75,116 75,102 100,102 100,140" fill="' + c.s1 + '"/>');
      } },

    { name: 'crescent', tier: 'flat', weight: 1.4, drift: 'drift-breathe',
      make: function (c) {
        return svgBackdrop('<circle cx="72" cy="26" r="30" fill="' + c.a1 + '"/>' +
                           '<circle cx="58" cy="18" r="28" fill="' + c.bg + '"/>');
      } },

    { name: 'ticks', tier: 'flat', weight: 1.4, drift: null,
      make: function (c) {
        var out = '';
        for (var y = 8; y < 140; y += 10) {
          out += '<rect x="0" y="' + y + '" width="' + (y % 30 === 8 ? 13 : 6) + '" height="1.6" fill="' + c.s3 + '"/>';
        }
        return svgBackdrop(out);
      } },

    /* ---- flat, clip-path layers: angular forms ---- */
    { name: 'ribbon', tier: 'flat', weight: 1.4, drift: null,
      build: function (c) {
        return [{ position: 'absolute', inset: '0', background: c.s2,
                  clipPath: 'polygon(0 12%, 100% 0, 100% 22%, 0 34%)' }];
      } },

    { name: 'arrow-block', tier: 'flat', weight: 1.4, drift: null,
      build: function (c) {
        return [{ position: 'absolute', left: '0', right: '0', bottom: '0', height: '34%',
                  background: c.s1, clipPath: 'polygon(0 38%, 50% 0, 100% 38%, 100% 100%, 0 100%)' }];
      } },

    { name: 'notch-slab', tier: 'flat', weight: 1.4, drift: null,
      build: function (c) {
        return [{ position: 'absolute', left: '0', top: '0', width: '46%', height: '30%',
                  background: c.a1, clipPath: 'polygon(0 0, 100% 0, 100% 62%, 64% 100%, 0 100%)' }];
      } },

    { name: 'angle-slab', tier: 'flat', weight: 1.4, drift: null,
      build: function (c) {
        return [
          { position: 'absolute', left: '0', right: '0', bottom: '0', height: '28%',
            background: c.s2, clipPath: 'polygon(0 42%, 100% 0, 100% 100%, 0 100%)' },
          { position: 'absolute', right: '6%', top: '5%', width: '26%', aspectRatio: '1',
            background: c.a1, clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }
        ];
      } },

    /* ---- flat collage: composed from primitives by rule ----
       One entry, many outcomes: 2-4 shapes placed in the top and
       bottom thirds or bled in from the sides, never behind the
       question. Weighted high because it is a family, not a look. */
    { name: 'collage', tier: 'flat', weight: 5, drift: null,
      build: function (c) {
        var palette = [c.s1, c.s2, c.a1, c.a2];
        var zones = ZONES.slice().sort(function () { return Math.random() - 0.5; });
        var n = 2 + Math.floor(Math.random() * 3);
        var out = [];
        for (var i = 0; i < n; i++) {
          out.push(shapeIn(palette[Math.floor(Math.random() * palette.length)],
                           zones[i % zones.length],
                           KINDS[Math.floor(Math.random() * KINDS.length)]));
        }
        return out;
      } },

    /* ---- quiet: sparse texture, slow drift ---- */
    { name: 'dots-quiet', tier: 'quiet', weight: 3, drift: 'drift-slow',
      make: function (c) { return { image: 'radial-gradient(' + c.tQuiet + ' 3px, transparent 3.5px)', size: '74px 74px' }; } },

    { name: 'grid-quiet', tier: 'quiet', weight: 3, drift: 'drift-slow',
      make: function (c) {
        return { image: 'linear-gradient(' + c.tQuiet + ' 2px, transparent 2px),' +
                        'linear-gradient(90deg, ' + c.tQuiet + ' 2px, transparent 2px)', size: '132px 132px' };
      } },

    { name: 'hairlines', tier: 'quiet', weight: 3, drift: 'drift-vert',
      make: function (c) { return { image: 'repeating-linear-gradient(0deg, ' + c.tQuiet + ' 0 2px, transparent 2px 98px)', size: 'auto' }; } },

    { name: 'stripes-wide', tier: 'quiet', weight: 3, drift: 'drift-diag',
      make: function (c) { return { image: 'repeating-linear-gradient(45deg, ' + c.tQuiet + ' 0 26px, transparent 26px 78px)', size: 'auto' }; } },

    /* ---- mid ---- */
    { name: 'dots', tier: 'mid', weight: 2.6, drift: 'drift-slow',
      make: function (c) { return { image: 'radial-gradient(' + c.tMid + ' 3px, transparent 3.5px)', size: '38px 38px' }; } },

    { name: 'grid', tier: 'mid', weight: 2.6, drift: 'drift-slow',
      make: function (c) {
        return { image: 'linear-gradient(' + c.tMid + ' 2px, transparent 2px),' +
                        'linear-gradient(90deg, ' + c.tMid + ' 2px, transparent 2px)', size: '72px 72px' };
      } },

    { name: 'stripes', tier: 'mid', weight: 2.6, drift: 'drift-diag',
      make: function (c) { return { image: 'repeating-linear-gradient(45deg, ' + c.tMid + ' 0 18px, transparent 18px 44px)', size: 'auto' }; } },

    { name: 'chevron', tier: 'mid', weight: 2.6, drift: 'drift-vert',
      make: function (c) {
        return { image: 'repeating-linear-gradient(135deg, ' + c.tMid + ' 0 12px, transparent 12px 30px),' +
                        'repeating-linear-gradient(45deg, ' + c.tMid + ' 0 12px, transparent 12px 30px)', size: '86px 86px' };
      } },

    { name: 'bars', tier: 'mid', weight: 2.6, drift: 'drift-horiz',
      make: function (c) { return { image: 'repeating-linear-gradient(90deg, ' + c.tMid + ' 0 5px, transparent 5px 46px)', size: 'auto' }; } },

    /* ---- loud: rare punctuation ---- */
    { name: 'stripes-tight', tier: 'loud', weight: 1.5, drift: 'drift-diag',
      make: function (c) { return { image: 'repeating-linear-gradient(45deg, ' + c.tLoud + ' 0 20px, transparent 20px 40px)', size: 'auto' }; } },

    /* `repeating-` matters: a plain conic-gradient holds its last stop for
       the remaining 340deg, leaving one lonely wedge. */
    { name: 'rays', tier: 'loud', weight: 1.5, drift: 'drift-spin',
      make: function (c) { return { image: 'repeating-conic-gradient(from 0deg, ' + c.tLoud + ' 0 9deg, transparent 9deg 18deg)', size: 'auto' }; } },

    { name: 'rings', tier: 'loud', weight: 1.5, drift: 'drift-breathe',
      make: function (c) { return { image: 'repeating-radial-gradient(circle at 50% 50%, ' + c.tLoud + ' 0 3px, transparent 3px 44px)', size: 'auto' }; } },

    { name: 'crosses', tier: 'loud', weight: 1.5, drift: 'drift-diag',
      make: function (c) {
        return { image: 'linear-gradient(' + c.tLoud + ' 3px, transparent 3px),' +
                        'linear-gradient(90deg, ' + c.tLoud + ' 3px, transparent 3px)', size: '44px 44px' };
      } },

    { name: 'halftone', tier: 'loud', weight: 1.5, drift: 'drift-slow',
      make: function (c) {
        return { image: 'radial-gradient(' + c.tAcc + ' 7px, transparent 8px),' +
                        'radial-gradient(' + c.tLoud + ' 2px, transparent 3px)', size: '58px 58px, 58px 58px' };
      } }
  ];

  /* ── Entrances ─────────────────────────────────────────────
     `perLetter` entrances stagger across split characters.      */
  var ENTRANCES = [
    { name: 'cascade', perLetter: true,  stagger: 34 },
    { name: 'drop',    perLetter: true,  stagger: 42 },
    { name: 'skewin',  perLetter: true,  stagger: 28 },
    { name: 'popin',   perLetter: true,  stagger: 30 },
    { name: 'slam',    perLetter: false, stagger: 0 },
    { name: 'blurin',  perLetter: false, stagger: 0 },
    { name: 'wipe',    perLetter: false, stagger: 0 },
    { name: 'rollin',  perLetter: false, stagger: 0 }
  ];

  /* ── Text treatments — `plain` is weighted heaviest ──────── */
  var TREATMENTS = ['plain', 'plain', 'plain', 'outline', 'shadow-hard', 'accent-words', 'stretch'];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function pickWeighted(arr) {
    var total = arr.reduce(function (s, x) { return s + (x.weight || 1); }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < arr.length; i++) {
      r -= (arr[i].weight || 1);
      if (r <= 0) return arr[i];
    }
    return arr[arr.length - 1];
  }

  /* Back-to-back repeats are what make randomness look broken. */
  var last = { palette: null, font: null, backdrop: null, entrance: null };

  function pickFresh(arr, key, weighted) {
    if (arr.length < 2) return arr[0];
    var choice, guard = 0;
    do { choice = weighted ? pickWeighted(arr) : pick(arr); } while (choice === last[key] && ++guard < 12);
    last[key] = choice;
    return choice;
  }

  function random() {
    var palette  = pickFresh(PALETTES, 'palette');
    var font     = pickFresh(FONTS, 'font');
    var backdrop = pickFresh(BACKDROPS, 'backdrop', true);
    var entrance = pickFresh(ENTRANCES, 'entrance');
    var tone     = tones(palette);

    /* `build` backdrops compose positioned layers; `make` backdrops are a
       single background-image. Collage resolves its randomness here so the
       card keeps one composition for its whole life. */
    var bd = backdrop.build ? { image: 'none', size: 'auto', layers: backdrop.build(tone) }
                            : backdrop.make(tone);

    return {
      palette: palette,
      font: font,
      backdrop: backdrop,
      backdropImage: bd.image,
      backdropSize: bd.size,
      backdropLayers: bd.layers || null,
      entrance: entrance,
      treatment: pick(TREATMENTS)
    };
  }

  /* Build the backdrop element for a card. Owned here rather than in
     app.js because only the theme knows whether it needs child layers. */
  function backdropNode(theme) {
    var el = document.createElement('div');
    el.className = 'backdrop';
    el.style.backgroundImage = theme.backdropImage;
    el.style.backgroundSize = theme.backdropSize;

    (theme.backdropLayers || []).forEach(function (spec) {
      var layer = document.createElement('div');
      layer.className = 'bd-layer';
      Object.keys(spec).forEach(function (k) { layer.style[k] = spec[k]; });
      el.appendChild(layer);
    });

    return el;
  }

  /* Push a theme onto an element as CSS custom properties. */
  function apply(el, theme) {
    var s = el.style;
    s.setProperty('--bg', theme.palette.bg);
    s.setProperty('--ink', theme.palette.ink);
    s.setProperty('--acc', theme.palette.acc);
    s.setProperty('--face', theme.font.face);
    s.setProperty('--track', theme.font.track);
    s.setProperty('--weight', theme.font.weight);
    s.setProperty('--body-face', BODY_FACE);
    el.dataset.treatment = theme.treatment;
    el.dataset.drift = theme.backdrop.drift || '';
    el.dataset.tier = theme.backdrop.tier;

    /* The HUD sits outside the card, so hand it the card's ink —
       guaranteed contrast without blend-mode guesswork. */
    document.body.style.setProperty('--hud-ink', theme.palette.ink);
  }

  global.Theme = {
    random: random,
    apply: apply,
    backdropNode: backdropNode,
    PALETTES: PALETTES,
    BACKDROPS: BACKDROPS,
    BODY_FACE: BODY_FACE,
    _tones: tones
  };
})(window);
