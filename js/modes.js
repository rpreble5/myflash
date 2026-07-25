/* modes.js — the input modes.
   A mode owns everything below the question: what the user does to
   answer, and how the answer is revealed. Each declares its own
   eligibility so we never ask someone to unscramble a 30-letter phrase.

   Contract:
     id, label, weight
     eligible(card, deck) -> bool
     mount(area, ctx)     -> optional teardown fn
   ctx = { card, deck, finish(correct), revealAnswer(), keys(map) }        */

(function (global) {
  'use strict';

  function h(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  /* Two-button self-grade, used by the reveal-style modes. */
  function gradeBar(ctx) {
    var bar = h('div', 'grade-bar');
    var miss = h('button', 'btn btn-grade btn-miss', 'MISSED');
    var got  = h('button', 'btn btn-grade btn-got', 'GOT IT');
    miss.addEventListener('click', function (e) { e.stopPropagation(); ctx.finish(false); });
    got.addEventListener('click',  function (e) { e.stopPropagation(); ctx.finish(true); });
    bar.appendChild(miss);
    bar.appendChild(got);
    ctx.keys({ '1': function () { ctx.finish(false); }, '2': function () { ctx.finish(true); },
               'ArrowLeft': function () { ctx.finish(false); }, 'ArrowRight': function () { ctx.finish(true); } });
    return bar;
  }

  /* ── 1. FLIP ─────────────────────────────────────────────── */
  var flip = {
    id: 'flip',
    label: 'TAP TO FLIP',
    weight: 3,
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
        ctx.keys({ ' ': null });
      }

      ctx.tapSurface(doFlip);
      ctx.keys({ ' ': doFlip, 'Enter': doFlip });
    }
  };

  /* ── 2. REVEAL (press & hold) ────────────────────────────── */
  var reveal = {
    id: 'reveal',
    label: 'HOLD TO REVEAL',
    weight: 2,
    eligible: function () { return true; },
    mount: function (area, ctx) {
      var pad = h('button', 'hold-pad');
      pad.appendChild(h('span', null, 'HOLD'));
      area.appendChild(pad);

      var answerEl = ctx.revealAnswer('blur');   // shown immediately, but blurred
      var held = false, graded = false;

      function down(e) {
        e.preventDefault();
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

  /* ── 3. TYPE IT ──────────────────────────────────────────── */
  var type = {
    id: 'type',
    label: 'TYPE IT',
    weight: 3,
    eligible: function (card) { return card.a.length <= 18; },
    mount: function (area, ctx) {
      var form = h('form', 'type-form');
      var input = h('input', 'type-input');
      input.type = 'text';
      input.autocomplete = 'off';
      input.autocapitalize = 'off';
      input.autocorrect = 'off';
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
        var correct = global.Txt.matches(input.value, ctx.card.a);
        input.disabled = true;
        go.remove();
        form.classList.add(correct ? 'is-right' : 'is-wrong');
        if (!correct && input.value.trim()) {
          var got = h('div', 'your-answer', input.value);
          area.appendChild(got);
        }
        ctx.revealAnswer(correct ? 'pop' : 'shake');
        setTimeout(function () { ctx.finish(correct); }, correct ? 850 : 1500);
      });
    }
  };

  /* ── 4. MULTIPLE CHOICE ──────────────────────────────────── */
  var choice = {
    id: 'choice',
    label: 'PICK ONE',
    weight: 3,
    eligible: function (card, deck) { return deck.cards.length >= 4; },
    mount: function (area, ctx) {
      var pool = ctx.deck.cards
        .map(function (c) { return c.a; })
        .filter(function (a) { return global.Txt.normalize(a) !== global.Txt.normalize(ctx.card.a); });
      var options = global.Txt.shuffle(pool).slice(0, 3).concat([ctx.card.a]);
      options = global.Txt.shuffle(options);

      var grid = h('div', 'choice-grid');
      var locked = false;
      var keyMap = {};

      options.forEach(function (opt, i) {
        var b = h('button', 'choice-btn');
        b.appendChild(h('span', 'choice-key', String(i + 1)));
        b.appendChild(h('span', 'choice-text', opt));
        b.style.setProperty('--i', i);

        function answer() {
          if (locked) return;
          locked = true;
          var correct = global.Txt.normalize(opt) === global.Txt.normalize(ctx.card.a);
          b.classList.add(correct ? 'is-right' : 'is-wrong');
          if (!correct) {
            Array.prototype.forEach.call(grid.children, function (other, j) {
              if (global.Txt.normalize(options[j]) === global.Txt.normalize(ctx.card.a)) other.classList.add('is-right');
            });
          }
          grid.classList.add('is-locked');
          setTimeout(function () { ctx.finish(correct); }, correct ? 700 : 1300);
        }

        b.addEventListener('click', answer);
        keyMap[String(i + 1)] = answer;
        grid.appendChild(b);
      });

      area.appendChild(grid);
      ctx.keys(keyMap);
    }
  };

  /* ── 5. SCRAMBLE ─────────────────────────────────────────── */
  var scramble = {
    id: 'scramble',
    label: 'UNSCRAMBLE',
    weight: 2,
    eligible: function (card) {
      var letters = card.a.replace(/\s/g, '');
      return letters.length >= 3 && letters.length <= 10 && /^[A-Za-z]+$/.test(letters);
    },
    mount: function (area, ctx) {
      var target = ctx.card.a.replace(/\s/g, '');
      var slotsEl = h('div', 'slots');
      var tilesEl = h('div', 'tiles');
      area.appendChild(slotsEl);
      area.appendChild(tilesEl);

      var slots = [];
      for (var i = 0; i < target.length; i++) {
        var s = h('div', 'slot');
        s.style.setProperty('--i', i);
        slotsEl.appendChild(s);
        slots.push(s);
      }

      var placed = [];
      var order = global.Txt.shuffle(target.split(''));
      var locked = false;

      order.forEach(function (ch, i) {
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

      /* Undo the last placement — without it, one misplaced tile
         means restarting the whole word. */
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
        var correct = global.Txt.normalize(guess) === global.Txt.normalize(target);
        slotsEl.classList.add(correct ? 'is-right' : 'is-wrong');
        ctx.revealAnswer(correct ? 'pop' : 'shake');
        setTimeout(function () { ctx.finish(correct); }, correct ? 850 : 1500);
      }
    }
  };

  var ALL = [flip, reveal, type, choice, scramble];

  /* Weighted pick from the eligible set, avoiding an immediate repeat. */
  var lastId = null;
  function pickFor(card, deck) {
    var pool = ALL.filter(function (m) { return m.eligible(card, deck); });
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
