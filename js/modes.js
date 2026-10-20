/* modes.js — input presentations.

   A card's `type` decides WHAT it asks. A presentation decides HOW it asks.
   Every type has exactly one presentation: the card's content decides
   how it is asked, and the theme layer supplies the variety.

   Contract:
     id, label, types[], weight
     eligible(card, deck) -> bool
     mount(area, ctx)
   ctx = { card, deck, finish(score 0..1), revealAnswer(style), stack(), stackReveal(),
           setKicker(text), setQuestion(text), tapSurface(fn),
           enableSwipe({onLeft,onRight}), keys(map), waitForTap(fn),
           judge(score) }                                                 */

(function (global) {
  'use strict';

  function h(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  function checkBtn(onClick) {
    var b = h('button', 'btn btn-check', 'CHECK');
    b.disabled = true;
    b.addEventListener('click', function () { if (!b.disabled) onClick(b); });
    return b;
  }

  /* Self-grade bar for the presentations that can't grade themselves. */
  function gradeBar(ctx) {
    var bar = h('div', 'grade-bar');
    var miss = h('button', 'btn btn-grade btn-miss', 'MISSED');
    var got  = h('button', 'btn btn-grade btn-got', 'GOT IT');
    miss.addEventListener('click', function (e) { e.stopPropagation(); ctx.finish(0); });
    got.addEventListener('click',  function (e) { e.stopPropagation(); ctx.finish(1); });
    bar.appendChild(miss);
    bar.appendChild(got);
    ctx.keys({ '1': function () { ctx.finish(0); }, '2': function () { ctx.finish(1); },
               'ArrowLeft': function () { ctx.finish(0); }, 'ArrowRight': function () { ctx.finish(1); } });
    return bar;
  }

  /* Option sets get the shape their content asks for. Four short labels
     read fastest as a 2×2 — the whole set lands in one glance. A clinical
     phrase in a half-width cell wraps to three ragged lines and the set
     becomes a wall, so anything longer goes down the page as a list.

     The bound is what fits one line in a half-width cell on a phone. */
  var GRID_MAX_CHARS = 15;
  /* Select-all keeps its checkbox in either layout, and the box plus its
     gap costs a narrow cell about four characters. */
  var GRID_MAX_CHARS_BOXED = 11;

  /* Options always run as a single column of full-width blocks. The two
     by two grid for short options was dropped: it halved the tap targets
     and made the options read as smaller than they are. Kept as a
     function for the validator, which asks it the same question. */
  function layoutFor() { return 'list'; }

  /* The answer is on screen; the card now waits for you.

     The delay is not reading time — it is there so the tap that produced
     the answer cannot also dismiss it. A swipe releases into a trailing
     click a few milliseconds later, which would skip the reveal entirely. */
  var ADVANCE_ARM = 350;

  function settle(ctx, score) {
    ctx.judge(score);
    setTimeout(function () {
      ctx.waitForTap(function () { ctx.finish(score); });
    }, ADVANCE_ARM);
  }

  /* Optional explanation. A short note just appears under the answer; a
     long one gets the whole card on a swipe up, rather than folding into
     a strip that squeezes the answer or hides behind a button.

     Two sentences is about the most that can sit under an answer without
     competing with it, which is where the threshold comes from. */
  var WHY_INLINE_MAX = 140;

  function explanation(text, ctx, inlineMax) {
    var wrap = h('div', 'why-wrap');
    var limit = inlineMax == null ? WHY_INLINE_MAX : inlineMax;

    if (text.length <= limit || !ctx || !ctx.openNote) {
      var inline = h('div', 'why', text);
      wrap.appendChild(inline);
      requestAnimationFrame(function () { inline.classList.add('is-in'); });
      return wrap;
    }

    /* A button, so the card's own swipe handler skips it — enableSwipe
       ignores anything inside a button, which means no pointer capture
       fight over the same gesture. */
    var cue = h('button', 'why-cue');
    cue.appendChild(h('span', 'why-cue-arrow', '↑'));
    cue.appendChild(h('span', 'why-cue-text', 'WHY'));

    /* Nothing opens while the note is still held back. Most modes mount
       their explanation at the start of the card so its box is reserved
       before the answer lands, which means every way of opening it — the
       cue, a swipe, the arrow key — is live before there is anything to
       explain. On a number card that is not merely early: the dial IS an
       upward drag, so setting the value would open the answer. */
    function open() {
      if (wrap.classList.contains('is-held')) return;
      ctx.openNote(text);
    }

    cue.addEventListener('click', function (e) { e.stopPropagation(); open(); });

    /* Swipe up from anywhere on the card, not only from the cue — the cue
       is a target the size of a word and the gesture should not require
       finding it. */
    if (ctx.onSwipeUp) ctx.onSwipeUp(open);

    /* Swipe up from the cue opens it too. The tap is the discoverable
       path and the swipe is the one that stays in the hand. */
    var y0 = null;
    cue.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      y0 = e.clientY;
      if (cue.setPointerCapture) { try { cue.setPointerCapture(e.pointerId); } catch (err) { /* stale */ } }
    });
    cue.addEventListener('pointermove', function (e) {
      if (y0 == null) return;
      if (y0 - e.clientY > 40) { y0 = null; open(); }
    });
    cue.addEventListener('pointerup', function () { y0 = null; });
    cue.addEventListener('pointercancel', function () { y0 = null; });

    wrap.appendChild(cue);
    if (ctx.keys) ctx.keys({ 'ArrowUp': open });
    requestAnimationFrame(function () { cue.classList.add('is-in'); });
    return wrap;
  }

  /* Swipe-to-grade. The labels are real buttons so the gesture stays
     discoverable and the card is still usable by tap and keyboard.

     Built before the answer is shown so it holds its place from the
     start, and only armed on reveal: `arm` turns on the swipe and keys. */
  function swipeBar(ctx) {
    var bar = h('div', 'swipe-bar is-waiting');
    var miss = h('button', 'swipe-side swipe-miss', 'MISSED');
    var got  = h('button', 'swipe-side swipe-got', 'GOT IT');
    var cueText = h('span', 'swipe-cue', 'tap anywhere');
    bar.appendChild(miss);
    bar.appendChild(cueText);
    bar.appendChild(got);
    bar.arm = function () {
      bar.classList.remove('is-waiting');
      cueText.textContent = 'swipe';
      armSwipe(ctx, miss, got);
    };
    return bar;
  }

  function armSwipe(ctx, miss, got) {
    var swipe = ctx.enableSwipe({
      onLeft:  function () { ctx.judge(0); ctx.finish(0); },
      onRight: function () { ctx.judge(1); ctx.finish(1); }
    });

    if (ctx.onNoteSwipe) ctx.onNoteSwipe(function (right) { swipe.commit(right); });
    miss.addEventListener('click', function (e) { e.stopPropagation(); swipe.commit(false); });
    got.addEventListener('click',  function (e) { e.stopPropagation(); swipe.commit(true); });
    ctx.keys({
      'ArrowLeft':  function () { swipe.commit(false); },
      'ArrowRight': function () { swipe.commit(true); },
      '1': function () { swipe.commit(false); },
      '2': function () { swipe.commit(true); }
    });
  }

  /* ═══════════════ recall: one card, one behaviour ═══════════════

     Tap anywhere to reveal. The question stays where it is and the
     answer slides up underneath it; the explanation fades in lower
     down. Then you swipe (or tap, or use the arrow keys) to say whether
     you knew it. The layout itself lives in app.js (ctx.stack), which
     holds the question.                                               */

  /* The stacked layout has room for a longer note than the modes with
     controls under the question. */
  var STACK_WHY_INLINE = 220;

  var recall = {
    id: 'recall', label: 'TAP TO REVEAL', types: ['recall'], weight: 1,
    eligible: function () { return true; },
    mount: function (area, ctx) {
      var bar = swipeBar(ctx);
      area.appendChild(bar);
      var revealed = false;

      /* Built now so the layout can measure it; held until the reveal so
         it cannot be opened early. If an inline note turns out not to fit,
         the layout asks for the WHY button version instead. */
      var why = ctx.card.why;
      ctx.stack(String(ctx.card.a), why ? function (fits) {
        var w = explanation(why, ctx, fits ? STACK_WHY_INLINE : 0);
        w.classList.add('is-held');
        return w;
      } : null);

      function doReveal() {
        if (revealed) return;
        revealed = true;
        global.Sfx.flip();
        ctx.stackReveal();
        ctx.setKicker('KNEW IT?');
        bar.arm();
      }

      ctx.tapSurface(doReveal);
      ctx.keys({ ' ': doReveal, 'Enter': doReveal });
    }
  };

  /* ═══════════════ mcq ═══════════════ */

  var choice = {
    /* No label, like the other cards: four options say what to do. */
    id: 'choice', label: '', types: ['mcq'], weight: 1,
    eligible: function (card) { return card.distractors && card.distractors.length >= 2; },
    mount: function (area, ctx) {
      var options = global.Txt.shuffle([ctx.card.a].concat(ctx.card.distractors));
      var grid = h('div', 'choice-grid is-single');
      var cardEl = area.closest('.card');
      if (cardEl) cardEl.classList.add('is-choice');
      grid.dataset.lay = layoutFor(options);
      var locked = false, keyMap = {};

      options.forEach(function (opt, i) {
        /* No number label: the 1-4 keys still work, and the label only
           cost the text room. */
        var b = h('button', 'choice-btn');
        b.appendChild(h('span', 'choice-text', opt));
        b.style.setProperty('--i', i);
        pressable(b);

        function answer() {
          if (locked) return;
          locked = true;
          var ok = global.Txt.normalize(opt) === global.Txt.normalize(ctx.card.a);
          b.classList.add(ok ? 'is-right' : 'is-wrong');
          if (!ok) {
            Array.prototype.forEach.call(grid.children, function (other, j) {
              if (global.Txt.normalize(options[j]) === global.Txt.normalize(ctx.card.a)) other.classList.add('is-right', 'is-truth');
            });
          }
          grid.classList.add('is-locked');
          /* A wrong pick gets its own reason first, above the explanation
             of the right answer. */
          if (!ok && whyNot && whyNot[opt] && whyWrap) {
            var note = h('div', 'why why-not is-in');
            note.appendChild(h('strong', null, 'Why not: '));
            note.appendChild(document.createTextNode(whyNot[opt]));
            whyWrap.insertBefore(note, whyWrap.firstChild);
          }
          /* The options already show the answer; only the explanation
             comes in. */
          ctx.stackReveal(false);
          settle(ctx, ok ? 1 : 0);
        }

        b.addEventListener('click', answer);
        keyMap[String(i + 1)] = answer;
        grid.appendChild(b);
      });

      area.appendChild(grid);

      /* Same layout as recall: the question in its usual place and size,
         the options below, and the explanation fading in between them
         once you have picked. An mcq explanation usually says why the
         other three are wrong, which is worth more here than anywhere. */
      var why = ctx.card.why;
      /* A vignette scrolls, so its explanation is always shown in full
         under the question rather than behind the WHY button. */
      var whyMax = ctx.card.stem ? Infinity : STACK_WHY_INLINE;
      var whyNot = ctx.card.whyNot || null;
      var whyWrap = null;
      ctx.stack('', (why || whyNot) ? function (fits) {
        var w = explanation(why || '', ctx, fits ? whyMax : 0);
        w.classList.add('is-held');
        whyWrap = w;
        return w;
      } : null);

      ctx.keys(keyMap);
    }
  };

  /* The press: the button sinks into its thicker bottom edge the moment
     a finger lands, with a light tick, and comes back up if the finger
     slides off. A class rather than :active, which iOS only applies
     reliably with a touch handler present. */
  function pressable(b) {
    function up() { b.classList.remove('is-pressed'); }
    b.addEventListener('pointerdown', function () {
      if (b.closest('.is-locked')) return;
      b.classList.add('is-pressed');
      global.Sfx.press();
    });
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('pointerleave', up);
  }

  /* ═══════════════ multi: select all that apply ═══════════════ */

  var multi = {
    /* No label: the hint at the bottom says "select all that apply" until
       something is picked, then how to submit. */
    id: 'multi', label: '', types: ['multi'], weight: 1,
    eligible: function (card) {
      return card.answers && card.answers.length && card.distractors && card.distractors.length;
    },
    mount: function (area, ctx) {
      var answers = ctx.card.answers;
      var options = global.Txt.shuffle(answers.concat(ctx.card.distractors));
      var picked = {}, locked = false;

      var grid = h('div', 'choice-grid is-multi');
      var multiCard = area.closest('.card');
      if (multiCard) multiCard.classList.add('is-choice');
      /* Select-all sets run longer than four, and the extra rows are what
         make the question hard — they shouldn't also force a tall list. */
      grid.dataset.lay = layoutFor(options, 6, GRID_MAX_CHARS_BOXED);

      var hint = h('div', 'hint is-static submit-cue', 'select all that apply');
      var keyMap = { 'Enter': submit };
      var btns = [];

      options.forEach(function (opt, i) {
        /* Not a <button>: the options cover most of the lower card, and
           enableSwipe steps around real buttons so their taps survive.
           Divs let a submit swipe start anywhere over the list, and the
           gesture's own onTap handles selection. */
        var b = h('div', 'choice-btn');
        b.setAttribute('role', 'button');
        b.setAttribute('aria-pressed', 'false');
        /* The box carries selection state, so unlike single choice it earns
           its width in either layout. Picking fills only the box. */
        var box = h('span', 'choice-key choice-box');
        b.appendChild(box);
        b.appendChild(h('span', 'choice-text', opt));
        b.style.setProperty('--i', i);
        /* The box is the button: it sinks on press, the text beside it
           only changes color. Not pressable(): the card captures the
           pointer for the submit swipe, and capture fires pointerleave
           on the row, which would lift the press the instant it lands.
           So the release is tracked on the document instead. */
        b.addEventListener('pointerdown', function () {
          if (locked) return;
          b.classList.add('is-pressed');
          global.Sfx.press();
          var r = b.getBoundingClientRect();
          function move(ev) {
            if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) end();
          }
          function end() {
            b.classList.remove('is-pressed');
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', end);
            document.removeEventListener('pointercancel', end);
          }
          document.addEventListener('pointermove', move);
          document.addEventListener('pointerup', end);
          document.addEventListener('pointercancel', end);
        });
        btns.push(b);
        keyMap[String(i + 1)] = function () { toggle(i); };
        grid.appendChild(b);
      });

      function anyPicked() {
        return options.some(function (_, i) { return picked[i]; });
      }

      function toggle(i) {
        if (locked) return;
        /* Selecting produces no verdict of its own, so without this the
           only tap in the app that changes state silently is this one. */
        global.Sfx.select();
        picked[i] = !picked[i];
        btns[i].classList.toggle('is-picked', !!picked[i]);
        btns[i].firstChild.textContent = picked[i] ? '✓' : '';
        btns[i].setAttribute('aria-pressed', picked[i] ? 'true' : 'false');
        var live = anyPicked();
        hint.classList.toggle('is-live', live);
        hint.textContent = live ? 'swipe right to check →' : 'select all that apply';
      }

      function isAnswer(opt) {
        var n = global.Txt.normalize(opt);
        return answers.some(function (a) { return global.Txt.normalize(a) === n; });
      }

      function submit() {
        if (locked || !anyPicked()) return;
        locked = true;
        grid.classList.add('is-locked');
        hint.classList.add('is-hidden');

        var hits = 0, wrong = 0;
        options.forEach(function (opt, i) {
          var b = btns[i];
          var box = b.firstChild;
          if (isAnswer(opt)) {
            /* Every answer ends filled, picked or not: what's left on the
               card is the true set, not a transcript of the attempt. */
            b.classList.add('is-right');
            box.textContent = '✓';
            if (picked[i]) hits++; else b.classList.add('is-missed');
          } else if (picked[i]) {
            wrong++;
            b.classList.add('is-wrong');
            box.textContent = '✕';
          } else {
            b.classList.add('is-idle');
            box.textContent = '';
          }
        });

        /* Partial credit, with a wrong pick cancelling a hit — selecting
           the whole board should not score better than knowing two. */
        var score = Math.max(0, hits - wrong) / answers.length;
        ctx.stackReveal(false);
        settle(ctx, score);
      }

      area.appendChild(grid);
      area.appendChild(hint);

      /* Same layout as the other cards; the explanation fades in between
         the question and the options once you have checked. */
      var why = ctx.card.why;
      ctx.stack('', why ? function (fits) {
        var w = explanation(why, ctx, fits ? STACK_WHY_INLINE : 0);
        w.classList.add('is-held');
        return w;
      } : null);

      /* The options hold still under the swipe; only the hint lights up
         as it heads right. A swipe with nothing picked does nothing. */
      var swipe = ctx.enableSwipe({
        motion: 'none',
        onRight: function () {
          if (anyPicked()) submit(); else swipe.reset();
        },
        onLeft: function () { swipe.reset(); },
        onTap: function (target) {
          var b = target && target.closest && target.closest('.choice-btn');
          var i = b ? btns.indexOf(b) : -1;
          if (i >= 0) toggle(i);
        }
      });

      ctx.keys(keyMap);
    }
  };

  /* ═══════════════ true / false ═══════════════ */

  var truefalse = {
    /* No label: the faint FALSE / TRUE bar at the bottom says what kind of
       card this is and how to answer it. */
    id: 'truefalse', label: '', types: ['truefalse'], weight: 1,
    eligible: function () { return true; },
    mount: function (area, ctx) {
      var locked = false;
      var truth = !!ctx.card.a;

      /* False left, true right: the same axis as everywhere else in the
         app, where left is the negative answer and right the positive
         one. The buttons stay real, so the card still works by tap and
         by keyboard. */
      var bar = h('div', 'swipe-bar tf-bar');
      var fBtn = h('button', 'swipe-side tf-side tf-false', 'FALSE');
      var tBtn = h('button', 'swipe-side tf-side tf-true', 'TRUE');
      var cueText = h('span', 'swipe-cue', 'swipe');
      bar.appendChild(fBtn);
      bar.appendChild(cueText);
      bar.appendChild(tBtn);
      area.appendChild(bar);

      /* Same layout as recall: the question stays put and the correct
         answer rises in underneath it once you have picked. */
      var why = ctx.card.why;
      ctx.stack(truth ? 'True' : 'False', why ? function (fits) {
        var w = explanation(why, ctx, fits ? STACK_WHY_INLINE : 0);
        w.classList.add('is-held');
        return w;
      } : null);

      function answer(value) {
        if (locked) return;
        locked = true;
        var ok = value === truth;
        bar.classList.add('is-locked');
        (value ? tBtn : fBtn).classList.add(ok ? 'is-right' : 'is-wrong');
        cueText.textContent = '';
        ctx.stackReveal();
        settle(ctx, ok ? 1 : 0);
      }

      /* Nothing moves under the finger; the side you are heading for
         lights up in the bar instead. */
      var swipe = ctx.enableSwipe({
        motion: 'none',
        onLeft:  function () { answer(false); },
        onRight: function () { answer(true); }
      });

      fBtn.addEventListener('click', function (e) { e.stopPropagation(); swipe.commit(false); });
      tBtn.addEventListener('click', function (e) { e.stopPropagation(); swipe.commit(true); });
      ctx.keys({
        'ArrowLeft':  function () { swipe.commit(false); },
        'ArrowRight': function () { swipe.commit(true); },
        '1': function () { swipe.commit(false); },
        '2': function () { swipe.commit(true); },
        'f': function () { swipe.commit(false); },
        't': function () { swipe.commit(true); }
      });
    }
  };

  /* ═══════════════ trend: up / down / unchanged ═══════════════ */

  /* Drawn rather than typed. A text arrow is whatever the resolved font
     happens to ship — a hairline in one face, a different head angle in
     the next, and nothing to fall back to on a platform missing the
     glyph. These are one path each, two subpaths for the arrows: a
     shaft, then the head. Weight and caps come from CSS.

     All three share a geometry: the head's shoulders land on y=12, the
     same line the unchanged bar sits on, and both arrows span 5 to 19
     so the set reads as one mark in three positions. */
  var DIRS = [
    { key: 'up',   name: 'UP',   art: 'M12 19V5.5M5 12L12 5L19 12' },
    { key: 'same', name: 'SAME', art: 'M5 12H19' },
    { key: 'down', name: 'DOWN', art: 'M12 5V18.5M5 12L12 19L19 12' }
  ];

  function dirArt(d) {
    /* Static literals only — no card content reaches this. */
    return '<svg class="dir-art" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
           '<path d="' + d.art + '"/></svg>';
  }

  var trend = {
    /* No label and no hint: three arrows beside each row say what to do. */
    id: 'trend', label: '', types: ['trend'], weight: 1,
    eligible: function (card) { return card.items && card.items.length; },
    mount: function (area, ctx) {
      var items = ctx.card.items;
      /* The rows ride in the stacked layout's entry slot, right under the
         question, rather than down at the bottom of the card. */
      var rows = h('div', 'q trend-rows');
      var done = 0, right = 0;
      var btnAt = [];

      items.forEach(function (item, i) {
        var row = h('div', 'trend-row');
        row.style.setProperty('--i', i);
        row.appendChild(h('span', 'trend-label', item.label));

        var group = h('div', 'dir-group');
        var byDir = {};
        DIRS.forEach(function (d) {
          var b = h('div', 'dir-btn');
          b.innerHTML = dirArt(d);
          b.setAttribute('role', 'button');
          b.setAttribute('aria-label', item.label + ' ' + d.name);
          b.addEventListener('click', function (e) { e.stopPropagation(); pick(i, d.key); });
          byDir[d.key] = b;
          group.appendChild(b);
        });

        btnAt.push(byDir);
        row.appendChild(group);
        rows.appendChild(row);
      });

      /* Each row grades the moment it is marked. One arrow per row ends
         up filled — always the true direction — and its colour is the
         verdict, so a finished card reads as the pattern itself (TSH up,
         free T4 down) with the misses in magenta. The pick is not kept
         on screen: it is wherever the fill is not. */
      function pick(i, dir) {
        var item = items[i], row = rows.children[i];
        if (row.classList.contains('is-done')) return;
        row.classList.add('is-done');
        var ok = dir === item.dir;
        if (ok) right++;
        var truth = btnAt[i][item.dir];
        truth.classList.add('is-truth');
        if (!ok) {
          truth.classList.add('is-missed');
          var miss = btnAt[i][dir];
          miss.classList.add('is-miss');
          setTimeout(function () { miss.classList.remove('is-miss'); }, 600);
        }
        done++;
        if (done >= items.length) {
          rows.classList.add('is-locked');
          ctx.stackReveal(false);
          settle(ctx, right / items.length);
        } else (ok ? global.Sfx.select : global.Sfx.wrong)();
      }

      ctx.stack('', stackWhy(ctx), rows);

      /* Arrow keys mark the first row still waiting. */
      function nextRow() {
        for (var i = 0; i < items.length; i++) {
          if (!rows.children[i].classList.contains('is-done')) return i;
        }
        return -1;
      }
      function key(dir) { return function () { var i = nextRow(); if (i >= 0) pick(i, dir); }; }
      ctx.keys({ 'ArrowUp': key('up'), 'ArrowDown': key('down'), 'ArrowRight': key('same') });
    }
  };

  /* ═══════════════ bucket: sort a list into two sides ═══════════════

     Every item is listed under the question, and they are sorted in
     order: swipe anywhere, or tap a side of the screen, and the current
     item slides toward that side. A wrong one turns orange and crosses
     to where it belongs, so the finished list is the true grouping.
     Three or more bins have no sides to slide to, so those cards go
     through the items one at a time with a button per bin.             */

  var bucket = {
    id: 'bucket', label: '', types: ['bucket'], weight: 1,
    eligible: function (card) { return card.bins && card.bins.length >= 2 && card.items && card.items.length; },
    mount: function (area, ctx) {
      var items = global.Txt.shuffle(ctx.card.items.slice());
      var bins = ctx.card.bins;
      if (bins.length === 2) sortTwo(area, ctx, items, bins);
      else sortMany(area, ctx, items, bins);
    }
  };

  function stackWhy(ctx) {
    var why = ctx.card.why;
    return why ? function (fits) {
      var w = explanation(why, ctx, fits ? STACK_WHY_INLINE : 0);
      w.classList.add('is-held');
      return w;
    } : null;
  }

  function sortTwo(area, ctx, items, bins) {
    var idx = 0, right = 0;

    /* The list rides in the stacked layout's entry slot, right under the
       question, since nothing in it needs to be touched. */
    /* The two categories sit right under the question, with the list
       beneath them, so the eye never has to leave the top of the card.
       Tapping a category sorts to its side, as does a swipe; the chips
       light up as the swipe heads their way. */
    var wrap = h('div', 'q sort-wrap');
    var binRow = h('div', 'sort-bins');
    var lBin = h('div', 'sort-bin sort-bin-left', '← ' + bins[0]);
    var rBin = h('div', 'sort-bin sort-bin-right', bins[1] + ' →');
    binRow.appendChild(lBin);
    binRow.appendChild(rBin);
    wrap.appendChild(binRow);
    var list = h('div', 'sort-list');
    var rows = items.map(function (item) {
      var row = h('div', 'sort-row', item.label);
      list.appendChild(row);
      return row;
    });
    wrap.appendChild(list);
    ctx.stack('', stackWhy(ctx), wrap);

    function paint() {
      rows.forEach(function (r, i) { r.classList.toggle('is-current', i === idx); });
    }

    /* Most of the way toward its side, never off the list. */
    function slide(row, where) {
      var room = Math.max(0, (list.clientWidth - row.offsetWidth) / 2) * 0.9;
      row.style.transform = 'translateX(' + Math.round(where === 'left' ? -room : room) + 'px)';
    }

    function sort(where) {
      if (idx >= items.length) return;
      var item = items[idx], row = rows[idx];
      var truth = item.bin === bins[0] ? 'left' : 'right';
      var ok = where === truth;
      if (ok) right++;
      row.classList.add(ok ? 'is-right' : 'is-wrong');
      slide(row, where);
      if (!ok) setTimeout(function () { slide(row, truth); }, 320);
      idx++;
      paint();
      if (idx >= items.length) {
        binRow.classList.add('is-locked');
        ctx.stackReveal(false);
        settle(ctx, right / items.length);
      } else global.Sfx.select();
    }

    var swipe = ctx.enableSwipe({
      motion: 'none',
      onLeft:  function () { sort('left');  swipe.reset(); },
      onRight: function () { sort('right'); swipe.reset(); },
      /* A tap sorts by which half of the screen it landed on. */
      onTap: function (target, x) {
        if (idx >= items.length || x == null) return;
        sort(x < global.innerWidth / 2 ? 'left' : 'right');
      }
    });
    ctx.keys({
      'ArrowLeft':  function () { sort('left'); },
      'ArrowRight': function () { sort('right'); },
      '1': function () { sort('left'); },
      '2': function () { sort('right'); }
    });

    paint();
  }

  /* Same list as sortTwo, with a button per bin instead of two sides.
     Each answered row gets its bin written beside it, so the finished
     list is the true grouping here too. */
  function sortMany(area, ctx, items, bins) {
    var idx = 0, right = 0;

    var list = h('div', 'q sort-list');
    var rows = items.map(function (item) {
      var row = h('div', 'sort-row', item.label);
      list.appendChild(row);
      return row;
    });
    ctx.stack('', stackWhy(ctx), list);

    var group = h('div', 'bin-group');
    area.appendChild(group);

    var keyMap = {};
    bins.forEach(function (bin, i) {
      var b = h('button', 'bin-btn', bin);
      b.style.setProperty('--i', i);
      b.addEventListener('click', function (e) { e.stopPropagation(); answer(bin, b); });
      group.appendChild(b);
      keyMap[String(i + 1)] = function () { answer(bin, b); };
    });
    ctx.keys(keyMap);

    function paint() {
      rows.forEach(function (r, i) { r.classList.toggle('is-current', i === idx); });
    }

    function answer(bin, btn) {
      if (idx >= items.length) return;
      var item = items[idx], row = rows[idx];
      var ok = bin === item.bin;
      if (ok) right++;
      row.classList.add(ok ? 'is-right' : 'is-wrong');
      row.appendChild(h('span', 'sort-bin', ' · ' + item.bin));
      /* The button flashes its verdict and clears, since it is reused
         for the next item. */
      btn.classList.add(ok ? 'is-right' : 'is-wrong');
      setTimeout(function () { btn.classList.remove('is-right', 'is-wrong'); }, ok ? 260 : 700);
      idx++;
      paint();
      if (idx >= items.length) {
        group.classList.add('is-locked');
        ctx.stackReveal(false);
        settle(ctx, right / items.length);
      } else global.Sfx.select();
    }

    paint();
  }

  /* ═══════════════ match: link two columns ═══════════════ */

  var match = {
    /* No label: two columns of buttons say what to do. */
    id: 'match', label: '', types: ['match'], weight: 1,
    eligible: function (card) { return card.pairs && card.pairs.length >= 2; },
    mount: function (area, ctx) {
      var pairs = ctx.card.pairs;
      var grid = h('div', 'match-grid');
      var leftCol = h('div', 'match-col');
      var rightCol = h('div', 'match-col');
      grid.appendChild(leftCol);
      grid.appendChild(rightCol);
      area.appendChild(grid);
      var why = ctx.card.why;
      ctx.stack('', why ? function (fits) {
        var w = explanation(why, ctx, fits ? STACK_WHY_INLINE : 0);
        w.classList.add('is-held');
        return w;
      } : null);

      var selected = null, solved = 0, misses = 0, busy = false;
      /* Which pairs were confused, not just how many times. A finished
         card that cannot say where you struggled has thrown away the
         only thing worth taking from it. */
      var fumbled = {};

      global.Txt.shuffle(pairs.slice()).forEach(function (p, i) {
        var b = h('button', 'match-btn', p.left);
        b.dataset.key = p.left;
        b.style.setProperty('--i', i);
        b.addEventListener('click', function () { pickLeft(b, p); });
        pressable(b);
        leftCol.appendChild(b);
      });

      global.Txt.shuffle(pairs.slice()).forEach(function (p, i) {
        var b = h('button', 'match-btn', p.right);
        b.dataset.key = p.left;
        b.style.setProperty('--i', i);
        b.addEventListener('click', function () { pickRight(b, p); });
        pressable(b);
        rightCol.appendChild(b);
      });

      function pickLeft(btn) {
        if (busy || btn.classList.contains('is-solved')) return;
        if (selected) selected.classList.remove('is-sel');
        selected = btn;
        btn.classList.add('is-sel');
        global.Sfx.select();
      }

      function pickRight(btn) {
        if (busy || btn.classList.contains('is-solved') || !selected) return;
        var ok = btn.dataset.key === selected.dataset.key;
        if (ok) {
          selected.classList.add('is-solved');
          btn.classList.add('is-solved');
          selected.classList.remove('is-sel');
          selected = null;
          solved++;
          /* The closing pair is the card; let settle speak for it. */
          if (solved === pairs.length) {
            Array.prototype.forEach.call(grid.querySelectorAll('.match-btn'), function (x) {
              if (fumbled[x.dataset.key]) x.classList.add('is-fumbled');
            });
            ctx.stackReveal(false);
            settle(ctx, Math.max(0, 1 - misses / pairs.length));
          } else global.Sfx.right();
        } else {
          busy = true;
          misses++;
          /* Both sides of a wrong attempt are implicated — the one you
             reached for and the one you reached for it with. */
          fumbled[selected.dataset.key] = true;
          fumbled[btn.dataset.key] = true;
          var wrongLeft = selected;
          btn.classList.add('is-miss');
          wrongLeft.classList.add('is-miss');
          global.Sfx.wrong();
          setTimeout(function () {
            btn.classList.remove('is-miss');
            wrongLeft.classList.remove('is-miss', 'is-sel');
            selected = null;
            busy = false;
          }, 480);
        }
      }
    }
  };

  /* ═══════════════ number: one vertical dial ═══════════════

     Drag anywhere on the card, up to raise and down to lower. Horizontal
     sliders are awkward on a phone held one-handed, and a full-screen
     vertical drag gives far more travel than a track ever could.

     Range cards ask for a single number too: "a normal serum sodium" is
     answered by any value inside the band, which is a truer question than
     dialling both ends of it.                                            */

  function decimals(n) {
    var s = String(n);
    var i = s.indexOf('.');
    return i < 0 ? 0 : s.length - i - 1;
  }

  /* Round to 1, 2 or 5 x 10^n so steps land on numbers people think in. */
  function niceStep(raw) {
    if (raw <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var norm = raw / mag;
    var pick = norm <= 1.5 ? 1 : norm <= 3.5 ? 2 : norm <= 7.5 ? 5 : 10;
    return pick * mag;
  }

  function scaleFor(card) {
    var dp, min, max;

    if (card.low != null) {
      var band = card.high - card.low;
      var pad = band * 2;
      min = Math.max(0, card.low - pad);
      max = card.high + pad;
      dp = Math.max(decimals(card.low), decimals(card.high));
    } else {
      min = 0;
      max = card.value * 2.5;
      dp = decimals(card.value);
    }

    /* Authored bounds win. A value card otherwise derives [0, value*2.5],
       which is meaningless for a quantity that never approaches zero — a
       body temperature of 37 would get a 0-92.5 scale and 925 steps. */
    if (card.min != null) min = card.min;
    if (card.max != null) max = card.max;
    dp = Math.max(dp, decimals(card.min == null ? 0 : card.min),
                      decimals(card.max == null ? 0 : card.max));

    /* Authored step wins. Otherwise aim for ~80 steps across the scale,
       floored so integer questions never ask for fractions. */
    var step = card.step;
    if (step == null) {
      var floorStep = dp > 0 ? Math.pow(10, -dp) : 1;
      step = Math.max(floorStep, niceStep((max - min) / 80));
    }

    min = Math.floor(min / step) * step;
    max = Math.ceil(max / step) * step;

    /* Anchor the scale to the answer rather than to zero. An HbA1c of 6.5
       on a 0.2 step falls between 6.4 and 6.6, and a fasting glucose of
       126 on a 5 step falls between 125 and 130: well-formed cards that
       cannot be got right, and nothing on the screen says why. Sliding
       the whole scale by less than one step is invisible and makes every
       answer land. */
    var anchor = card.low != null ? card.low : card.value;
    if (typeof anchor === 'number' && isFinite(anchor) && anchor >= min && anchor <= max) {
      var off = (anchor - min) % step;
      if (off > 1e-9 && step - off > 1e-9) { min += off; max += off; }
    }

    dp = Math.max(dp, decimals(step));

    return { min: round(min, dp), max: round(max, dp), step: step, dp: dp };
  }

  function round(n, dp) { return Number(n.toFixed(dp)); }

  /* Thousands separators once numbers get big enough to be hard to read. */
  function fmt(n, dp) {
    var fixed = Number(n).toFixed(dp);
    var parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function isCorrect(card, guess) {
    if (card.low != null) return guess >= card.low && guess <= card.high;
    return Math.abs(guess - card.value) <= (card.tolerance || 0);
  }

  var number = {
    id: 'number', label: 'DRAG TO SET', types: ['number'], weight: 1,
    /* The value is the interaction; the question is only the prompt. */
    compact: true,
    /* Kept for anyone who prefers it: Settings → Slider for number cards. */
    eligible: function (card) {
      return (card.value != null || card.low != null) && !!global.Store.setting('numberSlider');
    },
    mount: function (area, ctx) {
      var card = ctx.card;
      var sc = scaleFor(card);
      var steps = Math.max(1, Math.round((sc.max - sc.min) / sc.step));

      /* Deliberately unhurried: a full sweep takes roughly 1000px, so
         landing on one specific number is easy and a coarse scale takes a
         couple of drags rather than a flick. Clamped so a fine scale is
         never twitchy and a short one never sluggish. */
      var pxPerStep = Math.min(56, Math.max(10, 1000 / steps));

      /* Start a quarter up the scale rather than mid — for a range card the
         midpoint IS the answer, which would hand it over. Nudge off if the
         opening value happens to be correct anyway. */
      var value = round(sc.min + (sc.max - sc.min) * 0.25, sc.dp);
      value = round(Math.round(value / sc.step) * sc.step, sc.dp);
      var guard = 0;
      while (isCorrect(card, value) && guard++ < 40 && value - sc.step >= sc.min) {
        value = round(value - sc.step, sc.dp);
      }

      /* Every slot is built now and merely hidden. Revealing an answer then
         never reflows the card — removing elements shifted every line below
         them, which is jarring on a card whose point is one number holding
         still. */
      var dial = h('div', 'num-dial');
      var said = h('div', 'num-said');
      var up = h('div', 'num-arrow', '▲');
      var out = h('div', 'num-out');
      var val = h('span', 'num-val', fmt(value, sc.dp));
      out.appendChild(val);
      if (card.unit) out.appendChild(h('span', 'num-unit', card.unit));
      var down = h('div', 'num-arrow', '▼');
      dial.appendChild(said);
      dial.appendChild(up);
      dial.appendChild(out);
      dial.appendChild(down);
      area.appendChild(dial);

      var hint = h('div', 'hint', 'drag up or down');
      area.appendChild(hint);

      var locked = false;

      function nudge(n) {
        if (locked) return;
        var next = round(Math.min(sc.max, Math.max(sc.min, value + n * sc.step)), sc.dp);
        if (next === value) return;
        value = next;
        val.textContent = fmt(value, sc.dp);
        hint.classList.add('is-gone');
        global.Sfx.tick();
      }

      var check = checkBtn(function () { submit(); });

      function submit() {
        if (locked) return;
        locked = true;
        check.classList.add('is-hidden');
        hint.classList.add('is-gone');

        var ok = isCorrect(card, value);
        dial.classList.add(ok ? 'is-right' : 'is-wrong');

        /* Right: you just produced the number, so showing it back is noise.
           Colour it and move on. */
        if (ok) {
          settle(ctx, 1);
          return;
        }

        /* Wrong: your answer demotes to a small line above, the correct
           value takes the hero slot. No strikethrough — the label and the
           size difference already say it has been superseded. */
        ctx.setKicker('THE ANSWER');

        said.textContent = 'you said ' + fmt(value, sc.dp);
        requestAnimationFrame(function () { said.classList.add('is-in'); });

        var truth = card.low != null
          ? fmt(card.low, sc.dp) + ' – ' + fmt(card.high, sc.dp)
          : fmt(card.value, sc.dp);

        /* Crossfade the hero rather than cutting it, same as the kicker. */
        val.classList.add('is-swapping');
        setTimeout(function () {
          val.textContent = truth;
          val.classList.remove('is-swapping');
        }, 130);

        settle(ctx, 0);
      }

      /* Opt-in: answer the instant the finger lifts. A release that changed
         nothing is still ignored, so a stray tap can't answer for you. */
      var autoSubmit = global.Store.setting('submitOnRelease');

      ctx.enableDial({
        pxPerStep: pxPerStep,
        onSteps: nudge,
        onRelease: function (moved) {
          if (!autoSubmit || locked || !moved) return;
          submit();
        }
      });

      ctx.keys({
        'ArrowUp':   function () { nudge(1); },
        'ArrowDown': function () { nudge(-1); },
        'PageUp':    function () { nudge(10); },
        'PageDown':  function () { nudge(-10); },
        'Enter':     submit
      });

      if (autoSubmit) {
        hint.textContent = 'release to answer';
        check.classList.add('is-hidden');
      }
      check.disabled = false;
      area.appendChild(check);
    }
  };

  /* ═══════════════ number: the keypad ═══════════════

     Type the number. No scale to guess at and nothing on screen that
     hints at the answer, so every card works and it tests real recall.
     Range cards take any value inside the band, as with the slider.

     A card with `values` asks for several numbers at once — both ends of
     a range, or a pair like 130/80. Each is typed in turn: the separator
     key moves to the next, a tap on one goes back to it, and each is
     graded on its own.                                                  */

  var keypad = {
    id: 'keypad', label: '', types: ['number'], weight: 1,
    eligible: function (card) {
      /* The slider cannot set two numbers, so those always type. */
      if (card.values && card.values.length >= 2) return true;
      return (card.value != null || card.low != null) && !global.Store.setting('numberSlider');
    },
    mount: function (area, ctx) {
      var card = ctx.card;
      var cardEl = area.closest('.card');
      if (cardEl) cardEl.classList.add('is-keypad');

      var multi = !!(card.values && card.values.length >= 2);
      var count = multi ? card.values.length : 1;
      var nums = multi ? card.values : [card.value, card.low, card.high].filter(function (v) { return v != null; });
      /* Decimals come from the answer itself: a decimal key only appears
         when the answer has one, and only that many places can be typed. */
      var dp = Math.max.apply(null, nums.map(function (n) { return decimals(n); }).concat(0));
      /* One more whole digit than the answer has, so a wrong answer an
         order of magnitude out can still be typed. */
      var maxDigits = String(Math.round(Math.max.apply(null, nums.concat(0)))).length + 1;
      var join = card.join || '–';
      var unit = card.unit ? ' ' + card.unit : '';
      var typed = [], at = 0, locked = false;
      for (var t = 0; t < count; t++) typed.push('');

      var entry = h('div', 'q kp-entry' + (multi ? ' is-multi' : ''));
      var slots = typed.map(function (_, i) {
        if (i > 0) entry.appendChild(h('span', 'kp-join', join));
        var n = h('span', 'kp-num is-empty', '?');
        n.addEventListener('click', function (e) {
          if (locked || !multi) return;
          e.stopPropagation();
          at = i;
          show();
        });
        entry.appendChild(n);
        return n;
      });
      if (card.unit) entry.appendChild(h('span', 'kp-unit', card.unit));

      var truth = multi
        ? card.values.map(function (v) { return fmt(v, dp); }).join(' ' + join + ' ')
        : card.low != null ? fmt(card.low, dp) + ' – ' + fmt(card.high, dp) : fmt(card.value, dp);
      ctx.stack(truth + unit, stackWhy(ctx), entry);

      var pad = h('div', 'keypad' + (multi ? ' has-join' : ''));
      function key(label, cls, fn) {
        var b = h('button', 'key' + (cls ? ' ' + cls : ''), label);
        b.addEventListener('click', function (e) { e.stopPropagation(); fn(); });
        pad.appendChild(b);
        return b;
      }
      ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(function (d) {
        key(d, null, function () { press(d); });
      });
      if (dp > 0) key('.', null, function () { press('.'); });
      else pad.appendChild(h('span', 'key key-blank'));
      key('0', null, function () { press('0'); });
      key('⌫', 'key-del', del).setAttribute('aria-label', 'Delete');
      var joinKey = multi ? key(join, 'key-join', next) : null;
      if (joinKey) joinKey.setAttribute('aria-label', 'Next number');
      var check = h('button', 'key-check', 'CHECK');
      check.addEventListener('click', function (e) { e.stopPropagation(); submit(); });
      pad.appendChild(check);
      area.appendChild(pad);


      function pretty(t) {
        var parts = t.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
      }

      function show() {
        slots.forEach(function (n, i) {
          n.textContent = typed[i] ? pretty(typed[i]) : '?';
          n.classList.toggle('is-empty', !typed[i]);
          n.classList.toggle('is-active', multi && !locked && i === at);
        });
        check.disabled = typed.some(function (v) { return !v || /\.$/.test(v); });
        if (joinKey) joinKey.disabled = at >= count - 1 || !typed[at];
      }

      function press(d) {
        if (locked) return;
        var cur = typed[at], parts = cur.split('.');
        if (d === '.') {
          if (!dp || parts.length > 1) return;
          cur = (cur || '0') + '.';
        } else if (parts.length > 1) {
          if (parts[1].length >= dp) return;
          cur += d;
        } else {
          if (cur === '0') cur = '';
          if (cur.length >= maxDigits) return;
          cur += d;
        }
        typed[at] = cur;
        global.Sfx.select();
        show();
      }

      function del() {
        if (locked) return;
        /* An empty number steps back to the one before it. */
        if (!typed[at] && at > 0) at--;
        else if (typed[at]) typed[at] = typed[at].slice(0, -1);
        else return;
        global.Sfx.select();
        show();
      }

      function next() {
        if (locked || at >= count - 1 || !typed[at]) return;
        at++;
        global.Sfx.select();
        show();
      }

      function submit() {
        if (locked || check.disabled) return;
        locked = true;
        var tol = card.tolerance || 0;
        var right = 0;
        typed.forEach(function (v, i) {
          var x = Number(v);
          var ok = multi ? Math.abs(x - card.values[i]) <= tol + 1e-9 : isCorrect(card, x);
          if (ok) right++;
          slots[i].classList.add(ok ? 'is-right' : 'is-wrong');
        });
        var all = right === count;
        show();
        pad.classList.add('is-done');
        /* All right: the numbers on screen are the answer. Otherwise they
           stay, marked, and the correct answer rises in under them. */
        ctx.stackReveal(!all);
        settle(ctx, right / count);
      }

      var keyMap = { 'Backspace': del, 'Enter': submit, '.': function () { press('.'); } };
      if (multi) ['-', '/', 'Tab', ' ', join].forEach(function (k) { keyMap[k] = next; });
      '0123456789'.split('').forEach(function (d) { keyMap[d] = function () { press(d); }; });
      ctx.keys(keyMap);
      show();
    }
  };

  var ALL = [recall, choice, multi, truefalse, trend, bucket, match, number, keypad];

  /* Presentations are chosen only from those that serve the card's type. */
  var lastId = null;
  function pickFor(card, deck) {
    var pool = ALL.filter(function (m) {
      return m.types.indexOf(card.type || 'recall') !== -1 && m.eligible(card, deck);
    });
    if (!pool.length) return recall;               // last-resort fallback

    var fresh = pool.filter(function (m) { return m.id !== lastId; });
    if (fresh.length) pool = fresh;

    var total = pool.reduce(function (s, m) { return s + m.weight; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < pool.length; i++) {
      r -= pool[i].weight;
      if (r <= 0) { lastId = pool[i].id; return pool[i]; }
    }
    lastId = pool[pool.length - 1].id;
    return pool[pool.length - 1];
  }

  /* scaleFor and layoutFor are exported for tools/validate.js. A generated
     card can be well-formed and still unanswerable — a 0.3 mg answer on a
     dial that steps by 1 — and the only way to check that honestly is to
     ask the same function the dial asks. */
  global.Modes = {
    ALL: ALL, pickFor: pickFor, h: h, explanation: explanation,
    scaleFor: scaleFor, layoutFor: layoutFor,
    GRID_MAX_CHARS: GRID_MAX_CHARS
  };
})(window);
