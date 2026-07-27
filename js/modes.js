/* modes.js — input presentations.

   A card's `type` decides WHAT it asks. A presentation decides HOW it asks.
   Every type has exactly one presentation: the card's content decides
   how it is asked, and the theme layer supplies the variety.

   Contract:
     id, label, types[], weight
     eligible(card, deck) -> bool
     mount(area, ctx)
   ctx = { card, deck, finish(score 0..1), revealAnswer(style),
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

  function layoutFor(options, maxGrid, maxChars) {
    var longest = options.reduce(function (n, o) { return Math.max(n, String(o).length); }, 0);
    return (options.length <= (maxGrid || 4) && longest <= (maxChars || GRID_MAX_CHARS)) ? 'grid' : 'list';
  }

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

  function explanation(text, ctx) {
    var wrap = h('div', 'why-wrap');

    if (text.length <= WHY_INLINE_MAX || !ctx || !ctx.openNote) {
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

    function open() { ctx.openNote(text); }

    cue.addEventListener('click', open);

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
     discoverable and the card is still usable by tap and keyboard. */
  function swipeBar(ctx) {
    var bar = h('div', 'swipe-bar');
    var miss = h('button', 'swipe-side swipe-miss', 'MISSED');
    var got  = h('button', 'swipe-side swipe-got', 'GOT IT');
    bar.appendChild(miss);
    bar.appendChild(h('span', 'swipe-cue', 'swipe'));
    bar.appendChild(got);

    var swipe = ctx.enableSwipe({
      onLeft:  function () { ctx.judge(0); ctx.finish(0); },
      onRight: function () { ctx.judge(1); ctx.finish(1); }
    });

    miss.addEventListener('click', function (e) { e.stopPropagation(); swipe.commit(false); });
    got.addEventListener('click',  function (e) { e.stopPropagation(); swipe.commit(true); });
    ctx.keys({
      'ArrowLeft':  function () { swipe.commit(false); },
      'ArrowRight': function () { swipe.commit(true); },
      '1': function () { swipe.commit(false); },
      '2': function () { swipe.commit(true); }
    });

    return bar;
  }

  /* ═══════════════ recall: one card, one behaviour ═══════════════

     Tap anywhere to reveal. The question is replaced by the answer —
     a flat swap, not a 3D flip. An optional explanation appears before
     grading, then you swipe (or tap, or use the arrow keys) to say
     whether you knew it.                                              */

  var recall = {
    id: 'recall', label: 'TAP TO REVEAL', types: ['recall'], weight: 1,
    eligible: function () { return true; },
    mount: function (area, ctx) {
      var hint = h('div', 'hint', 'tap anywhere');
      area.appendChild(hint);
      var revealed = false;

      function doReveal() {
        if (revealed) return;
        revealed = true;
        global.Sfx.flip();
        ctx.revealAnswer('swap');
        ctx.setKicker('KNEW IT?');
        hint.remove();
        if (ctx.card.why) area.appendChild(explanation(ctx.card.why, ctx));
        area.appendChild(swipeBar(ctx));
      }

      ctx.tapSurface(doReveal);
      ctx.keys({ ' ': doReveal, 'Enter': doReveal });
    }
  };

  /* ═══════════════ mcq ═══════════════ */

  var choice = {
    id: 'choice', label: 'PICK ONE', types: ['mcq'], weight: 1,
    eligible: function (card) { return card.distractors && card.distractors.length >= 2; },
    mount: function (area, ctx) {
      var options = global.Txt.shuffle([ctx.card.a].concat(ctx.card.distractors));
      var grid = h('div', 'choice-grid');
      grid.dataset.lay = layoutFor(options);
      var locked = false, keyMap = {};

      options.forEach(function (opt, i) {
        var b = h('button', 'choice-btn');
        /* The number is a keyboard affordance. In grid mode it costs the
           text a third of an already narrow cell, and every option there
           is short enough to hit directly. */
        if (grid.dataset.lay === 'list') b.appendChild(h('span', 'choice-key', String(i + 1)));
        b.appendChild(h('span', 'choice-text', opt));
        b.style.setProperty('--i', i);

        function answer() {
          if (locked) return;
          locked = true;
          var ok = global.Txt.normalize(opt) === global.Txt.normalize(ctx.card.a);
          b.classList.add(ok ? 'is-right' : 'is-wrong');
          if (!ok) {
            Array.prototype.forEach.call(grid.children, function (other, j) {
              if (global.Txt.normalize(options[j]) === global.Txt.normalize(ctx.card.a)) other.classList.add('is-right');
            });
          }
          grid.classList.add('is-locked');
          if (why) why.classList.remove('is-held');
          settle(ctx, ok ? 1 : 0);
        }

        b.addEventListener('click', answer);
        keyMap[String(i + 1)] = answer;
        grid.appendChild(b);
      });

      area.appendChild(grid);

      /* Held rather than appended on reveal, the same way select-all and
         true/false do it: an mcq explanation usually says why the other
         three are wrong, which is worth more here than anywhere. */
      var why = ctx.card.why ? explanation(ctx.card.why, ctx) : null;
      if (why) {
        why.classList.add('is-held');
        area.appendChild(why);
      }

      ctx.keys(keyMap);
    }
  };

  /* ═══════════════ multi: select all that apply ═══════════════ */

  var multi = {
    id: 'multi', label: 'SELECT ALL THAT APPLY', types: ['multi'], weight: 1,
    eligible: function (card) {
      return card.answers && card.answers.length && card.distractors && card.distractors.length;
    },
    mount: function (area, ctx) {
      var answers = ctx.card.answers;
      var options = global.Txt.shuffle(answers.concat(ctx.card.distractors));
      var picked = {}, locked = false;

      var grid = h('div', 'choice-grid is-multi');
      /* Select-all sets run longer than four, and the extra rows are what
         make the question hard — they shouldn't also force a tall list. */
      grid.dataset.lay = layoutFor(options, 6, GRID_MAX_CHARS_BOXED);

      var hint = h('div', 'hint is-static submit-cue', 'SWIPE RIGHT TO SUBMIT →');
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
           its width in either layout. It shows the number only in list
           mode, where the column of them lines up down the edge. */
        var box = h('span', 'choice-key choice-box', grid.dataset.lay === 'list' ? String(i + 1) : '');
        b.appendChild(box);
        b.appendChild(h('span', 'choice-text', opt));
        b.style.setProperty('--i', i);
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
        global.Sfx.tick();
        picked[i] = !picked[i];
        btns[i].classList.toggle('is-picked', !!picked[i]);
        btns[i].setAttribute('aria-pressed', picked[i] ? 'true' : 'false');
        hint.classList.toggle('is-live', anyPicked());
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
        if (why) why.classList.remove('is-held');
        settle(ctx, score);
      }

      area.appendChild(grid);
      area.appendChild(hint);

      /* Built now, shown on submit. Appending it at reveal time pushed the
         options up by the height of the note — moving the one thing the
         user is reading at exactly the moment they start reading it. The
         card settles its layout before the answer, not during it. */
      var why = ctx.card.why ? explanation(ctx.card.why, ctx) : null;
      if (why) {
        why.classList.add('is-held');
        area.appendChild(why);
      }

      /* Nothing flies away — the options slide under the finger and spring
         back as the answer resolves in place. A swipe with nothing picked
         has nothing to submit, so it just springs back too. */
      var swipe = ctx.enableSwipe({
        visual: grid,
        motion: 'nudge',
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
    id: 'truefalse', label: 'TRUE OR FALSE', types: ['truefalse'], weight: 1,
    eligible: function () { return true; },
    mount: function (area, ctx) {
      var locked = false;
      var bar = h('div', 'tf-bar');
      /* False left, true right: the same axis as everywhere else in the
         app, where left is the negative answer and right the positive
         one. The buttons stay real, so the card still works by tap and
         by keyboard — and unlike a select-all list, a two-button bar
         leaves most of the card free for the swipe to start on. */
      /* The label rides above the fill layer, so it needs to be an
         element rather than a bare text node. */
      var fBtn = h('button', 'tf-btn tf-false');
      var tBtn = h('button', 'tf-btn tf-true');
      fBtn.appendChild(h('span', 'tf-label', 'FALSE'));
      tBtn.appendChild(h('span', 'tf-label', 'TRUE'));
      bar.appendChild(fBtn);
      bar.appendChild(h('span', 'swipe-cue', 'swipe'));
      bar.appendChild(tBtn);
      area.appendChild(bar);

      /* Mounted held, released on the answer. Appended at reveal time it
         pushed the buttons down the card exactly as the result landed. */
      var why = ctx.card.why ? explanation(ctx.card.why, ctx) : null;
      if (why) {
        why.classList.add('is-held');
        area.appendChild(why);
      }

      function answer(value) {
        if (locked) return;
        locked = true;
        var ok = value === !!ctx.card.a;
        bar.classList.add('is-locked');
        (value ? tBtn : fBtn).classList.add(ok ? 'is-right' : 'is-wrong');
        /* Wrong: light the true answer as well, so the card ends showing
           what is so rather than only what you said. */
        if (!ok) (ctx.card.a ? tBtn : fBtn).classList.add('is-right');
        if (why) why.classList.remove('is-held');
        settle(ctx, ok ? 1 : 0);
      }

      /* The bar holds still. Nothing is going anywhere — the answer
         resolves in place — so the distance is spent on the colour of the
         side you are heading for instead of on travel. */
      var swipe = ctx.enableSwipe({
        motion: 'none',
        onProgress: function (t, dir) {
          bar.dataset.lean = dir;
          bar.style.setProperty('--lean', t.toFixed(3));
        },
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
    id: 'trend', label: 'MARK THE CHANGES', types: ['trend'], weight: 1,
    /* The question is a diagnosis and the rows are the answer; the rows
       need the room. */
    compact: true,
    eligible: function (card) { return card.items && card.items.length; },
    mount: function (area, ctx) {
      var items = ctx.card.items;
      var rows = h('div', 'trend-rows');
      var picks = new Array(items.length).fill(null);
      var locked = false;
      var btnAt = [];

      var hint = h('div', 'hint is-static submit-cue', 'SWIPE RIGHT TO SUBMIT →');

      items.forEach(function (item, i) {
        var row = h('div', 'trend-row');
        row.style.setProperty('--i', i);
        row.appendChild(h('span', 'trend-label', item.label));

        var group = h('div', 'dir-group');
        var byDir = {};
        DIRS.forEach(function (d) {
          /* Divs, not buttons: the dir groups run down the right of every
             row, and enableSwipe steps around real buttons — a submit
             swipe starting on one would die. The gesture's own onTap
             does the selecting, as it does for select-all. */
          var b = h('div', 'dir-btn');
          b.innerHTML = dirArt(d);
          b.setAttribute('role', 'button');
          b.setAttribute('aria-label', item.label + ' ' + d.name);
          b.setAttribute('aria-pressed', 'false');
          b.dataset.dir = d.key;
          b.dataset.row = String(i);
          byDir[d.key] = b;
          group.appendChild(b);
        });

        btnAt.push(byDir);
        row.appendChild(group);
        rows.appendChild(row);
      });

      function complete() { return picks.indexOf(null) === -1; }

      function pick(i, dir) {
        if (locked) return;
        global.Sfx.tick();
        picks[i] = dir;
        DIRS.forEach(function (d) {
          var on = d.key === dir;
          btnAt[i][d.key].classList.toggle('is-on', on);
          btnAt[i][d.key].setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        hint.classList.toggle('is-live', complete());
      }

      function submit() {
        if (locked || !complete()) return;
        locked = true;
        rows.classList.add('is-locked');
        hint.classList.add('is-hidden');

        var right = 0;
        items.forEach(function (item, i) {
          var row = rows.children[i];
          var ok = picks[i] === item.dir;
          if (ok) right++;
          else btnAt[i][picks[i]].classList.add('is-miss');
          row.classList.add(ok ? 'is-right' : 'is-wrong');
          /* The true direction fills on every row, right or wrong, so a
             finished card reads as the pattern itself — platelets down,
             PT up, PTT up — rather than as a record of the attempt. */
          btnAt[i][item.dir].classList.add('is-truth');
        });

        if (why) why.classList.remove('is-held');
        settle(ctx, right / items.length);
      }

      area.appendChild(rows);
      area.appendChild(hint);

      var why = ctx.card.why ? explanation(ctx.card.why, ctx) : null;
      if (why) {
        why.classList.add('is-held');
        area.appendChild(why);
      }

      /* Same shape as select-all: several sub-answers, then one submit.
         Nothing leaves the screen, so the rows nudge and spring back. */
      var swipe = ctx.enableSwipe({
        visual: rows,
        motion: 'nudge',
        onRight: function () { if (complete()) submit(); else swipe.reset(); },
        onLeft:  function () { swipe.reset(); },
        onTap: function (target) {
          var b = target && target.closest && target.closest('.dir-btn');
          if (b) pick(Number(b.dataset.row), b.dataset.dir);
        }
      });

      ctx.keys({ 'Enter': submit });
    }
  };

  /* ═══════════════ bucket: one big item at a time ═══════════════ */

  var bucket = {
    id: 'bucket', label: 'SORT IT', types: ['bucket'], weight: 1,
    /* The sorted list is half the point of the card, so it gets room. */
    compact: true,
    eligible: function (card) { return card.bins && card.bins.length >= 2 && card.items && card.items.length; },
    mount: function (area, ctx) {
      var items = global.Txt.shuffle(ctx.card.items.slice());
      var idx = 0, right = 0, locked = false;
      /* Two bins map onto left and right; more than that has nowhere to
         go, so those cards keep the buttons. */
      var two = ctx.card.bins.length === 2;
      var swipe = null, list = null, bins = null;

      ctx.setKicker(ctx.card.q);
      var hint = h('div', 'hint');
      area.appendChild(hint);

      if (two) buildSorter(); else buildButtons();

      var keyMap = {};
      ctx.card.bins.forEach(function (bin, i) {
        keyMap[String(i + 1)] = function () { answer(bin, bins && bins.children[i]); };
      });
      ctx.keys(keyMap);

      function buildSorter() {
        var sorter = h('div', 'sorter');
        var heads = h('div', 'sort-heads');
        ctx.card.bins.forEach(function (bin, i) {
          var head = h('div', 'sort-head', bin);
          head.dataset.bin = bin;
          head.dataset.side = i === 0 ? 'left' : 'right';
          heads.appendChild(head);
        });
        list = h('div', 'sort-list');
        sorter.appendChild(heads);
        sorter.appendChild(list);
        area.appendChild(sorter);

        /* The item follows the finger and the card stays put, so the list
           it is being sorted into never moves under it. */
        swipe = ctx.enableSwipe({
          visual: ctx.hero,
          stayPut: true,
          onLeft: function () { answer(ctx.card.bins[0]); },
          onRight: function () { answer(ctx.card.bins[1]); },
          /* Mouse and cautious-finger fallback: the headings are targets. */
          onTap: function (target) {
            var head = target && target.closest && target.closest('.sort-head');
            if (head) answer(head.dataset.bin);
          }
        });
        ctx.hero.classList.add('is-sortable');
      }

      function buildButtons() {
        bins = h('div', 'bin-group');
        area.appendChild(bins);
        ctx.card.bins.forEach(function (bin, i) {
          var b = h('button', 'bin-btn', bin);
          b.style.setProperty('--i', i);
          b.addEventListener('click', function () { answer(bin, b); });
          bins.appendChild(b);
        });
      }

      function show() {
        var prompt = two && idx === 0;
        /* The prompt pulses to ask for the gesture; the running count is
           just a readout and has no business breathing. */
        hint.className = prompt ? 'hint sort-hint' : 'hint sort-hint is-static';
        hint.textContent = prompt ? 'SWIPE TO SORT' : (items.length - idx) + ' LEFT';
        ctx.setQuestion(items[idx].label);
      }

      function answer(bin, btn) {
        /* idx can already be past the end while the card waits to be
           replaced; a click landing in that window read items[idx].bin
           off the end of the array. */
        if (locked || idx >= items.length) return;
        locked = true;
        var item = items[idx];
        var ok = bin === item.bin;
        if (ok) right++;
        /* The last item's verdict is the card's verdict, which settle
           plays a moment later; two sounds for one action is noise. */
        if (idx < items.length - 1) (ok ? global.Sfx.right : global.Sfx.wrong)();

        if (two) {
          /* The item settles on the side it *belongs* on, marked when that
             wasn't where the user put it. The finished list then reads as
             the true grouping — the thing worth remembering — rather than
             as a record of the mistakes. */
          var side = item.bin === ctx.card.bins[0] ? 'left' : 'right';
          var chip = h('div', 'sort-item', item.label);
          chip.dataset.side = side;
          if (!ok) chip.classList.add('is-wrong');
          list.appendChild(chip);
        } else if (btn) {
          btn.classList.add(ok ? 'is-right' : 'is-wrong');
          if (!ok) {
            Array.prototype.forEach.call(bins.children, function (b) {
              if (b.textContent === item.bin) b.classList.add('is-answer');
            });
          }
        }

        setTimeout(function () {
          if (bins) {
            Array.prototype.forEach.call(bins.children, function (b) {
              b.classList.remove('is-right', 'is-wrong', 'is-answer');
            });
          }
          idx++;
          if (idx >= items.length) {
            settle(ctx, right / items.length);   // stay locked; card is done
            return;
          }
          locked = false;
          show();
          /* Repaint first, then put the hero back: the new item is already
             in place when the transform clears, so nothing flashes. */
          if (swipe) swipe.reset();
        }, ok ? 260 : 900);
      }

      show();
    }
  };

  /* ═══════════════ order: tap words into sequence ═══════════════ */

  var order = {
    id: 'order', label: 'PUT IN ORDER', types: ['order'], weight: 1,
    /* The question is a label — "ATLS primary survey" — and the slots are
       the answer. */
    compact: true,
    eligible: function (card) { return card.steps && card.steps.length >= 2; },
    mount: function (area, ctx) {
      var target = ctx.card.steps;
      var slotsEl = h('div', 'order-slots');
      var chipsEl = h('div', 'order-chips');
      var hint = h('div', 'hint is-static submit-cue', 'SWIPE RIGHT TO SUBMIT →');
      var slots = [], placed = [], locked = false;

      target.forEach(function (_, i) {
        var slot = h('div', 'order-slot');
        slot.style.setProperty('--i', i);
        slot.appendChild(h('span', 'order-num', String(i + 1)));
        slot.appendChild(h('span', 'order-text', ''));
        slotsEl.appendChild(slot);
        slots.push(slot);
      });

      global.Txt.shuffle(target.slice()).forEach(function (step, i) {
        /* Divs, as everywhere else a swipe has to be able to start on
           them — the chips cover the lower half of the card. */
        var c = h('div', 'order-chip', step);
        c.setAttribute('role', 'button');
        c.dataset.step = step;
        c.style.setProperty('--i', i);
        chipsEl.appendChild(c);
      });

      var undo = h('button', 'btn btn-ghost btn-undo', '← Undo');
      undo.addEventListener('click', function (e) { e.stopPropagation(); undoOne(); });

      area.appendChild(slotsEl);
      area.appendChild(chipsEl);
      area.appendChild(undo);
      area.appendChild(hint);

      function place(chip) {
        if (locked || chip.classList.contains('is-used') || placed.length >= slots.length) return;
        var slot = slots[placed.length];
        slot.querySelector('.order-text').textContent = chip.dataset.step;
        slot.classList.add('is-filled');
        chip.classList.add('is-used');
        placed.push({ step: chip.dataset.step, chip: chip, slot: slot });
        global.Sfx.tick();
        hint.classList.toggle('is-live', placed.length === slots.length);
      }

      function undoOne() {
        if (locked || !placed.length) return;
        var p = placed.pop();
        p.slot.querySelector('.order-text').textContent = '';
        p.slot.classList.remove('is-filled');
        p.chip.classList.remove('is-used');
        hint.classList.remove('is-live');
        global.Sfx.tick();
      }

      function submit() {
        if (locked || placed.length < slots.length) return;
        locked = true;
        /* Both keep their boxes: filling the last slot used to grade the
           card on the spot and take the undo button with it, so the one
           moment you might want to change your mind was the one moment
           you could not. */
        undo.classList.add('is-hidden');
        hint.classList.add('is-hidden');

        var right = 0;
        placed.forEach(function (p, i) {
          var ok = p.step === target[i];
          if (ok) right++;
          else p.slot.querySelector('.order-text').textContent = target[i];
          /* Every slot ends holding the true step, so the finished card
             reads as the sequence; the marks say where you had it wrong. */
          p.slot.classList.add(ok ? 'is-right' : 'is-wrong');
        });

        settle(ctx, right / target.length);
      }

      var swipe = ctx.enableSwipe({
        visual: slotsEl,
        motion: 'nudge',
        onRight: function () { if (placed.length === slots.length) submit(); else swipe.reset(); },
        onLeft:  function () { swipe.reset(); },
        onTap: function (target2) {
          var c = target2 && target2.closest && target2.closest('.order-chip');
          if (c) place(c);
        }
      });

      ctx.keys({ 'Enter': submit, 'Backspace': undoOne });
    }
  };

  /* ═══════════════ match: link two columns ═══════════════ */

  var match = {
    id: 'match', label: 'MATCH THEM UP', types: ['match'], weight: 1,
    /* "Generic → brand" is a label, and the two columns are the answer. */
    compact: true,
    eligible: function (card) { return card.pairs && card.pairs.length >= 2; },
    mount: function (area, ctx) {
      var pairs = ctx.card.pairs;
      var grid = h('div', 'match-grid');
      var leftCol = h('div', 'match-col');
      var rightCol = h('div', 'match-col');
      grid.appendChild(leftCol);
      grid.appendChild(rightCol);
      area.appendChild(grid);

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
        leftCol.appendChild(b);
      });

      global.Txt.shuffle(pairs.slice()).forEach(function (p, i) {
        var b = h('button', 'match-btn', p.right);
        b.dataset.key = p.left;
        b.style.setProperty('--i', i);
        b.addEventListener('click', function () { pickRight(b, p); });
        rightCol.appendChild(b);
      });

      function pickLeft(btn) {
        if (busy || btn.classList.contains('is-solved')) return;
        if (selected) selected.classList.remove('is-sel');
        selected = btn;
        btn.classList.add('is-sel');
        global.Sfx.tick();
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
    eligible: function (card) { return card.value != null || card.low != null; },
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

  var ALL = [recall, choice, multi, truefalse, trend, bucket, order, match, number];

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
