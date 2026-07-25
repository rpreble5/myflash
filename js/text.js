/* text.js — typography helpers: splitting text into animatable letters,
   and shrinking it until it actually fits the screen. */

(function (global) {
  'use strict';

  /* Split into per-word/per-letter spans so entrances can stagger.
     Words stay whole so wrapping never breaks mid-word. */
  function splitLetters(el, str, opts) {
    opts = opts || {};
    el.textContent = '';
    var words = String(str).split(/\s+/).filter(Boolean);
    var index = 0;

    words.forEach(function (word, w) {
      var wordEl = document.createElement('span');
      wordEl.className = 'word';

      for (var i = 0; i < word.length; i++) {
        var ch = document.createElement('span');
        ch.className = 'letter';
        ch.textContent = word[i];
        ch.style.setProperty('--i', index++);
        if (opts.accentWords && w % 2 === 1) ch.classList.add('is-accent');
        wordEl.appendChild(ch);
      }

      el.appendChild(wordEl);
      if (w < words.length - 1) {
        var sp = document.createElement('span');
        sp.className = 'space';
        sp.textContent = ' ';
        el.appendChild(sp);
      }
    });

    el.style.setProperty('--n', index);
    return index;
  }

  /* Binary-search the largest font size that fits the container.
     Cheap enough at ~8 iterations and far better than length buckets,
     which guess wrong the moment a font is unusually wide.

     Height comes from getBoundingClientRect, not scrollHeight, for two
     reasons. It includes the element's OWN transform, so the `stretch`
     treatment's scaleY(1.22) is accounted for — the flipper clips now, and
     a stretched block sized by its untransformed height would lose its top
     and bottom. And it excludes the scrollable overflow that `line-height:
     .92` produces when descenders spill past their line boxes, which is a
     constant ~8px that isn't clipping and shouldn't shrink the type.
     `pad` covers that spill against the clip edge. */
  function fit(el, box, opts) {
    opts = opts || {};
    var min = opts.min || 28;
    var pad = opts.pad == null ? 8 : opts.pad;
    var limit = box.clientHeight - pad;
    var max = opts.max || Math.min(box.clientHeight * 0.62, 340);
    var best = min;

    function overflows() {
      return el.getBoundingClientRect().height > limit ||
             el.scrollWidth > box.clientWidth + 1;
    }

    for (var step = 0; step < 9; step++) {
      var mid = (min + max) / 2;
      el.style.fontSize = mid + 'px';
      if (!overflows()) { best = mid; min = mid; } else { max = mid; }
    }

    var size = Math.floor(best);
    el.style.fontSize = size + 'px';

    /* The search can never return below its own minimum, so a long question
       in a short box — dense modes leave the flipper close to its 15vh
       floor — still overflows at `min`. Step down to a hard floor. */
    var floor = opts.floor || 13;
    while (size > floor && overflows()) {
      size -= 2;
      el.style.fontSize = size + 'px';
    }

    return size;
  }

  /* Loose match: case-, accent-, and punctuation-insensitive. */
  function normalize(s) {
    return String(s)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function matches(input, answer) { return normalize(input) === normalize(answer); }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  global.Txt = {
    splitLetters: splitLetters,
    fit: fit,
    normalize: normalize,
    matches: matches,
    shuffle: shuffle
  };
})(window);
