/* text.js — text helpers: shrinking a question until it fits the screen,
   loose answer matching, and shuffling. */

(function (global) {
  'use strict';

  /* Binary-search the largest font size that fits the container.
     Cheap enough at ~8 iterations and far better than length buckets,
     which guess wrong the moment a font is unusually wide.

     Height comes from getBoundingClientRect rather than scrollHeight so
     descender spill below the last line box doesn't shrink the type.
     `pad` covers that spill against the clip edge. */
  function fit(el, box, opts) {
    opts = opts || {};
    var min = opts.min || 18;
    var pad = opts.pad == null ? 8 : opts.pad;
    var limit = box.clientHeight - pad;
    /* Capped at reading size rather than poster size. */
    var max = opts.max || Math.min(box.clientHeight * 0.62, 34);
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
    fit: fit,
    normalize: normalize,
    matches: matches,
    shuffle: shuffle
  };
})(window);
