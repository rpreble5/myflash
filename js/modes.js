/* modes.js — input presentations.

   A card's `type` decides WHAT it asks. A presentation decides HOW it asks.
   Most types have exactly one presentation; `recall` has four, which is
   where the original "never the same twice" variety now lives.

   Contract:
     id, label, types[], weight
     eligible(card, deck) -> bool
     mount(area, ctx)
   ctx = { card, deck, finish(score 0..1), revealAnswer(style),
           setKicker(text), setQuestion(text), tapSurface(fn), keys(map) }  */

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

  /* Correct answers need longer on screen than a win does. */
  function settle(ctx, score) {
    setTimeout(function () { ctx.finish(score); }, score >= 1 ? 850 : 1700);
  }

  /* ═══════════════ recall: four presentations ═══════════════ */

  var flip = {
    id: 'flip', label: 'TAP TO FLIP', types: ['recall'], weight: 3,
    eligible: function () { return true; },
    mount: function (area, ctx) {
      var hint = h('div', 'hint', 'tap anywhere');
      area.appendChild(hint);
      var flipped = false;

      function doFlip() {
        if (flipped) return;
        flipped = true;
        global.Sfx.flip();
        ctx.revealAnswer('flip');
        ctx.setKicker('HOW’D YOU DO?');
        hint.remove();
        area.appendChild(gradeBar(ctx));
      }

      ctx.tapSurface(doFlip);
      ctx.keys({ ' ': doFlip, 'Enter': doFlip });
    }
  };

  var reveal = {
    id: 'reveal', label: 'HOLD TO REVEAL', types: ['recall'], weight: 2,
    eligible: function () { return true; },
    mount: function (area, ctx) {
      var pad = h('button', 'hold-pad');
      pad.appendChild(h('span', null, 'HOLD'));
      area.appendChild(pad);

      var answerEl = ctx.revealAnswer('blur');
      var held = false, graded = false;

      function down(e) {
        if (e && e.preventDefault) e.preventDefault();
        held = true;
        answerEl.classList.add('is-clear');
        pad.classList.add('is-held');
        global.Sfx.tick();
      }
      function up() {
        if (!held) return;
        held = false;
        answerEl.classList.remove('is-clear');
        pad.classList.remove('is-held');
        if (!graded) {
          graded = true;
          pad.remove();
          ctx.setKicker('HOW’D YOU DO?');
          area.appendChild(gradeBar(ctx));
        }
      }

      pad.addEventListener('pointerdown', down);
      pad.addEventListener('pointerup', up);
      pad.addEventListener('pointerleave', up);
      pad.addEventListener('pointercancel', up);
      ctx.keys({ ' ': down, ' :up': up });
    }
  };

  var type = {
    id: 'type', label: 'TYPE IT', types: ['recall'], weight: 3,
    eligible: function (card) { return card.a && card.a.length <= 18; },
    mount: function (area, ctx) {
      var form = h('form', 'type-form');
      var input = h('input', 'type-input');
      input.type = 'text';
      input.autocomplete = 'off';
      input.autocapitalize = 'off';
      input.spellcheck = false;
      input.placeholder = '…';
      var go = h('button', 'btn btn-solid type-go', 'CHECK');
      go.type = 'submit';
      form.appendChild(input);
      form.appendChild(go);
      area.appendChild(form);
      setTimeout(function () { input.focus(); }, 420);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = global.Txt.matches(input.value, ctx.card.a);
        input.disabled = true;
        go.remove();
        form.classList.add(ok ? 'is-right' : 'is-wrong');
        if (!ok && input.value.trim()) area.appendChild(h('div', 'your-answer', input.value));
        ctx.revealAnswer(ok ? 'pop' : 'shake');
        settle(ctx, ok ? 1 : 0);
      });
    }
  };

  var unscramble = {
    id: 'unscramble', label: 'UNSCRAMBLE', types: ['recall'], weight: 2,
    eligible: function (card) {
      if (!card.a) return false;
      var letters = card.a.replace(/\s/g, '');
      return letters.length >= 3 && letters.length <= 10 && /^[A-Za-z]+$/.test(letters);
    },
    mount: function (area, ctx) {
      var target = ctx.card.a.replace(/\s/g, '');
      var slotsEl = h('div', 'slots');
      var tilesEl = h('div', 'tiles');
      area.appendChild(slotsEl);
      area.appendChild(tilesEl);

      var slots = [], placed = [], locked = false;
      for (var i = 0; i < target.length; i++) {
        var s = h('div', 'slot');
        s.style.setProperty('--i', i);
        slotsEl.appendChild(s);
        slots.push(s);
      }

      global.Txt.shuffle(target.split('')).forEach(function (ch, i) {
        var t = h('button', 'tile', ch.toUpperCase());
        t.style.setProperty('--i', i);
        t.addEventListener('click', function () {
          if (locked || t.classList.contains('is-used') || placed.length >= slots.length) return;
          var slot = slots[placed.length];
          slot.textContent = ch.toUpperCase();
          slot.classList.add('is-filled');
          t.classList.add('is-used');
          placed.push({ ch: ch, tile: t, slot: slot });
          global.Sfx.tick();
          if (placed.length === slots.length) check();
        });
        tilesEl.appendChild(t);
      });

      var undo = h('button', 'btn btn-ghost btn-undo', '← Undo');
      undo.addEventListener('click', function () {
        if (locked || !placed.length) return;
        var p = placed.pop();
        p.slot.textContent = '';
        p.slot.classList.remove('is-filled');
        p.tile.classList.remove('is-used');
      });
      area.appendChild(undo);

      function check() {
        locked = true;
        undo.remove();
        var guess = placed.map(function (p) { return p.ch; }).join('');
        var ok = global.Txt.normalize(guess) === global.Txt.normalize(target);
        slotsEl.classList.add(ok ? 'is-right' : 'is-wrong');
        ctx.revealAnswer(ok ? 'pop' : 'shake');
        settle(ctx, ok ? 1 : 0);
      }
    }
  };

  /* ═══════════════ mcq ═══════════════ */

  var choice = {
    id: 'choice', label: 'PICK ONE', types: ['mcq'], weight: 1,
    eligible: function (card) { return card.distractors && card.distractors.length >= 2; },
    mount: function (area, ctx) {
      var options = global.Txt.shuffle([ctx.card.a].concat(ctx.card.distractors));
      var grid = h('div', 'choice-grid');
      var locked = false, keyMap = {};

      options.forEach(function (opt, i) {
        var b = h('button', 'choice-btn');
        b.appendChild(h('span', 'choice-key', String(i + 1)));
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
          settle(ctx, ok ? 1 : 0);
        }

        b.addEventListener('click', answer);
        keyMap[String(i + 1)] = answer;
        grid.appendChild(b);
      });

      area.appendChild(grid);
      ctx.keys(keyMap);
    }
  };

  /* ═══════════════ true / false ═══════════════ */

  var truefalse = {
    id: 'truefalse', label: 'TRUE OR FALSE', types: ['truefalse'], weight: 1,
    eligible: function () { return true; },
    mount: function (area, ctx) {
      var bar = h('div', 'tf-bar');
      var locked = false;

      function make(label, value) {
        var b = h('button', 'tf-btn tf-' + String(value), label);
        b.addEventListener('click', function () {
          if (locked) return;
          locked = true;
          var ok = value === !!ctx.card.a;
          b.classList.add(ok ? 'is-right' : 'is-wrong');
          bar.classList.add('is-locked');
          if (!ok) {
            var right = bar.querySelector('.tf-' + String(!!ctx.card.a));
            if (right) right.classList.add('is-right');
          }
          if (ctx.card.why) {
            var why = h('div', 'why', ctx.card.why);
            area.appendChild(why);
            requestAnimationFrame(function () { why.classList.add('is-in'); });
          }
          settle(ctx, ok ? 1 : 0);
        });
        return b;
      }

      var tBtn = make('TRUE', true);
      var fBtn = make('FALSE', false);
      bar.appendChild(tBtn);
      bar.appendChild(fBtn);
      area.appendChild(bar);
      ctx.keys({ '1': function () { tBtn.click(); }, '2': function () { fBtn.click(); },
                 'ArrowLeft': function () { tBtn.click(); }, 'ArrowRight': function () { fBtn.click(); } });
    }
  };

  /* ═══════════════ trend: up / down / unchanged ═══════════════ */

  var DIRS = [
    { key: 'up',   glyph: '↑', name: 'UP' },
    { key: 'same', glyph: '—', name: 'SAME' },
    { key: 'down', glyph: '↓', name: 'DOWN' }
  ];

  var trend = {
    id: 'trend', label: 'MARK THE CHANGES', types: ['trend'], weight: 1,
    eligible: function (card) { return card.items && card.items.length; },
    mount: function (area, ctx) {
      var rows = h('div', 'trend-rows');
      var picks = new Array(ctx.card.items.length).fill(null);
      var locked = false;

      var check = checkBtn(function (btn) {
        locked = true;
        btn.remove();
        var right = 0;
        ctx.card.items.forEach(function (item, i) {
          var row = rows.children[i];
          var ok = picks[i] === item.dir;
          if (ok) { right++; row.classList.add('is-right'); }
          else {
            row.classList.add('is-wrong');
            row.querySelectorAll('.dir-btn').forEach(function (b) {
              if (b.dataset.dir === item.dir) b.classList.add('is-answer');
            });
          }
        });
        settle(ctx, right / ctx.card.items.length);
      });

      ctx.card.items.forEach(function (item, i) {
        var row = h('div', 'trend-row');
        row.style.setProperty('--i', i);
        row.appendChild(h('span', 'trend-label', item.label));

        var group = h('div', 'dir-group');
        DIRS.forEach(function (d) {
          var b = h('button', 'dir-btn', d.glyph);
          b.dataset.dir = d.key;
          b.setAttribute('aria-label', item.label + ' ' + d.name);
          b.addEventListener('click', function () {
            if (locked) return;
            group.querySelectorAll('.dir-btn').forEach(function (x) { x.classList.remove('is-on'); });
            b.classList.add('is-on');
            picks[i] = d.key;
            global.Sfx.tick();
            check.disabled = picks.indexOf(null) !== -1;
          });
          group.appendChild(b);
        });

        row.appendChild(group);
        rows.appendChild(row);
      });

      area.appendChild(rows);
      area.appendChild(check);
    }
  };

  /* ═══════════════ bucket: one big item at a time ═══════════════ */

  var bucket = {
    id: 'bucket', label: 'SORT IT', types: ['bucket'], weight: 1,
    eligible: function (card) { return card.bins && card.bins.length >= 2 && card.items && card.items.length; },
    mount: function (area, ctx) {
      var items = global.Txt.shuffle(ctx.card.items.slice());
      var idx = 0, right = 0;

      ctx.setKicker(ctx.card.q);
      var counter = h('div', 'bucket-counter');
      var bins = h('div', 'bin-group');
      area.appendChild(counter);
      area.appendChild(bins);

      ctx.card.bins.forEach(function (bin, i) {
        var b = h('button', 'bin-btn', bin);
        b.style.setProperty('--i', i);
        b.addEventListener('click', function () { answer(bin, b); });
        bins.appendChild(b);
      });

      var keyMap = {};
      ctx.card.bins.forEach(function (bin, i) {
        keyMap[String(i + 1)] = function () { bins.children[i].click(); };
      });
      ctx.keys(keyMap);

      var locked = false;

      function show() {
        counter.textContent = (idx + 1) + ' / ' + items.length;
        ctx.setQuestion(items[idx].label);
      }

      function answer(bin, btn) {
        if (locked) return;
        locked = true;
        var ok = bin === items[idx].bin;
        btn.classList.add(ok ? 'is-right' : 'is-wrong');
        if (ok) { right++; global.Sfx.right(); }
        else {
          global.Sfx.wrong();
          Array.prototype.forEach.call(bins.children, function (b) {
            if (b.textContent === items[idx].bin) b.classList.add('is-answer');
          });
        }
        setTimeout(function () {
          Array.prototype.forEach.call(bins.children, function (b) {
            b.classList.remove('is-right', 'is-wrong', 'is-answer');
          });
          idx++;
          locked = false;
          if (idx >= items.length) ctx.finish(right / items.length);
          else show();
        }, ok ? 520 : 1200);
      }

      show();
    }
  };

  /* ═══════════════ order: tap words into sequence ═══════════════ */

  var order = {
    id: 'order', label: 'PUT IN ORDER', types: ['order'], weight: 1,
    eligible: function (card) { return card.steps && card.steps.length >= 2; },
    mount: function (area, ctx) {
      var target = ctx.card.steps;
      var slotsEl = h('div', 'order-slots');
      var chipsEl = h('div', 'order-chips');
      area.appendChild(slotsEl);
      area.appendChild(chipsEl);

      var slots = [], placed = [], locked = false;
      target.forEach(function (_, i) {
        var s = h('div', 'order-slot');
        s.style.setProperty('--i', i);
        s.appendChild(h('span', 'order-num', String(i + 1)));
        s.appendChild(h('span', 'order-text', ''));
        slotsEl.appendChild(s);
        slots.push(s);
      });

      global.Txt.shuffle(target.slice()).forEach(function (step, i) {
        var c = h('button', 'order-chip', step);
        c.style.setProperty('--i', i);
        c.addEventListener('click', function () {
          if (locked || c.classList.contains('is-used') || placed.length >= slots.length) return;
          var slot = slots[placed.length];
          slot.querySelector('.order-text').textContent = step;
          slot.classList.add('is-filled');
          c.classList.add('is-used');
          placed.push({ step: step, chip: c, slot: slot });
          global.Sfx.tick();
          if (placed.length === slots.length) check();
        });
        chipsEl.appendChild(c);
      });

      var undo = h('button', 'btn btn-ghost btn-undo', '← Undo');
      undo.addEventListener('click', function () {
        if (locked || !placed.length) return;
        var p = placed.pop();
        p.slot.querySelector('.order-text').textContent = '';
        p.slot.classList.remove('is-filled');
        p.chip.classList.remove('is-used');
      });
      area.appendChild(undo);

      function check() {
        locked = true;
        undo.remove();
        var right = 0;
        placed.forEach(function (p, i) {
          if (p.step === target[i]) { right++; p.slot.classList.add('is-right'); }
          else {
            p.slot.classList.add('is-wrong');
            p.slot.querySelector('.order-text').textContent = target[i];
          }
        });
        settle(ctx, right / target.length);
      }
    }
  };

  /* ═══════════════ match: link two columns ═══════════════ */

  var match = {
    id: 'match', label: 'MATCH THEM UP', types: ['match'], weight: 1,
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
          var tint = solved % 4;
          selected.classList.add('is-solved');
          btn.classList.add('is-solved');
          selected.dataset.tint = tint;
          btn.dataset.tint = tint;
          selected.classList.remove('is-sel');
          selected = null;
          solved++;
          global.Sfx.right();
          if (solved === pairs.length) {
            settle(ctx, Math.max(0, 1 - misses / pairs.length));
          }
        } else {
          busy = true;
          misses++;
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

  /* ═══════════════ number: value or range on a slider ═══════════════ */

  function decimals(n) {
    var s = String(n);
    var i = s.indexOf('.');
    return i < 0 ? 0 : s.length - i - 1;
  }

  /* Derive a scale wide enough to make the answer non-obvious but tight
     enough that the slider stays usable on a phone. */
  function scaleFor(card) {
    var dp, min, max, step;
    if (card.low != null) {
      var span = card.high - card.low;
      var pad = span * 2;
      min = Math.max(0, card.low - pad);
      max = card.high + pad;
      dp = Math.max(decimals(card.low), decimals(card.high));
    } else {
      min = 0;
      max = card.value * 2.5;
      dp = decimals(card.value);
    }
    step = dp > 0 ? Math.pow(10, -dp) : (max - min > 200 ? 5 : 1);
    /* Snap the ends onto the step grid so the answer is always reachable. */
    min = Math.floor(min / step) * step;
    max = Math.ceil(max / step) * step;
    return { min: round(min, dp), max: round(max, dp), step: step, dp: dp };
  }

  function round(n, dp) { return Number(n.toFixed(dp)); }

  var number = {
    id: 'number', label: 'DIAL IT IN', types: ['number'], weight: 1,
    eligible: function (card) { return card.value != null || card.low != null; },
    mount: function (area, ctx) {
      var card = ctx.card;
      var sc = scaleFor(card);
      var isRange = card.low != null;
      var wrap = h('div', 'num-wrap');
      area.appendChild(wrap);

      function slider(labelText, initial) {
        var row = h('div', 'num-row');
        if (labelText) row.appendChild(h('span', 'num-tag', labelText));
        var out = h('div', 'num-out');
        var val = h('span', 'num-val', String(initial));
        out.appendChild(val);
        if (card.unit) out.appendChild(h('span', 'num-unit', card.unit));
        var input = h('input', 'num-slider');
        input.type = 'range';
        input.min = sc.min;
        input.max = sc.max;
        input.step = sc.step;
        input.value = initial;
        input.addEventListener('input', function () {
          val.textContent = round(Number(input.value), sc.dp);
        });
        row.appendChild(out);
        row.appendChild(input);
        wrap.appendChild(row);
        return { input: input, val: val, row: row };
      }

      var mid = round(sc.min + (sc.max - sc.min) / 2, sc.dp);
      var a = slider(isRange ? 'LOW' : null, mid);
      var b = isRange ? slider('HIGH', mid) : null;

      var check = checkBtn(function (btn) {
        btn.remove();
        a.input.disabled = true;
        if (b) b.input.disabled = true;

        var score, truth;
        if (isRange) {
          var lowOk  = Math.abs(Number(a.input.value) - card.low)  <= sc.step;
          var highOk = Math.abs(Number(b.input.value) - card.high) <= sc.step;
          score = (Number(lowOk) + Number(highOk)) / 2;
          a.row.classList.add(lowOk ? 'is-right' : 'is-wrong');
          b.row.classList.add(highOk ? 'is-right' : 'is-wrong');
          truth = card.low + ' – ' + card.high + (card.unit ? ' ' + card.unit : '');
        } else {
          var ok = Math.abs(Number(a.input.value) - card.value) <= (card.tolerance || 0);
          score = ok ? 1 : 0;
          a.row.classList.add(ok ? 'is-right' : 'is-wrong');
          truth = card.value + (card.unit ? ' ' + card.unit : '');
        }

        var answer = h('div', 'num-answer', truth);
        area.appendChild(answer);
        requestAnimationFrame(function () { answer.classList.add('is-in'); });
        settle(ctx, score);
      });
      check.disabled = false;
      area.appendChild(check);
    }
  };

  var ALL = [flip, reveal, type, unscramble, choice, truefalse, trend, bucket, order, match, number];

  /* Presentations are chosen only from those that serve the card's type. */
  var lastId = null;
  function pickFor(card, deck) {
    var pool = ALL.filter(function (m) {
      return m.types.indexOf(card.type || 'recall') !== -1 && m.eligible(card, deck);
    });
    if (!pool.length) return flip;                 // last-resort fallback

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

  global.Modes = { ALL: ALL, pickFor: pickFor, h: h };
})(window);
