/* app.js — screens, session engine, card rendering. */

(function (global) {
  'use strict';

  var h = global.Modes.h;
  var $ = function (sel) { return document.querySelector(sel); };

  var EXITS = ['exit-fly', 'exit-shrink', 'exit-wipe', 'exit-spin', 'exit-drop'];
  var reduceMotion = global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────────────────────── screens ───────────────────────── */
  function show(id) {
    Array.prototype.forEach.call(document.querySelectorAll('.screen'), function (s) {
      s.classList.toggle('is-active', s.id === id);
    });
  }

  /* ───────────────────────── home ──────────────────────────── */
  function renderHome() {
    var list = $('#deck-list');
    list.textContent = '';

    global.Store.allDecks().forEach(function (deck, i) {
      var p = global.Store.deckProgress(deck);
      var pal = global.Theme.PALETTES[i % global.Theme.PALETTES.length];

      var card = h('button', 'deck-card');
      card.style.setProperty('--bg', pal.bg);
      card.style.setProperty('--ink', pal.ink);
      card.style.setProperty('--acc', pal.acc);
      card.style.setProperty('--i', i);

      card.appendChild(h('span', 'deck-name', deck.name));
      card.appendChild(h('span', 'deck-blurb', deck.blurb || (deck.cards.length + ' cards')));

      var meter = h('span', 'deck-meter');
      var fill = h('span', 'deck-meter-fill');
      fill.style.width = (p.total ? (p.learned / p.total) * 100 : 0) + '%';
      meter.appendChild(fill);
      card.appendChild(meter);
      card.appendChild(h('span', 'deck-count', p.learned + ' / ' + p.total + ' learned'));

      card.addEventListener('click', function () { startSession(deck); });
      list.appendChild(card);
    });
  }

  /* ───────────────────────── session ───────────────────────── */
  var session = null;

  function startSession(deck) {
    var order = global.Txt.shuffle(deck.cards.map(function (_, i) { return i; }));
    session = {
      deck: deck,
      queue: order,
      resolved: {},        // card index -> true once answered correctly
      answers: 0,
      correct: 0,
      score: 0,
      streak: 0,
      best: 0,
      started: Date.now(),
      keydown: {},
      keyup: {}
    };
    show('screen-session');
    updateHud();
    nextCard();
  }

  function updateHud() {
    var total = session.deck.cards.length;
    var done = Object.keys(session.resolved).length;
    $('#progress-fill').style.width = (total ? (done / total) * 100 : 0) + '%';
    $('#streak-n').textContent = session.streak;
    $('#streak').classList.toggle('is-hot', session.streak >= 3);
  }

  function nextCard() {
    if (!session.queue.length) return endSession();
    var idx = session.queue.shift();
    renderCard(session.deck, idx);
  }

  function renderCard(deck, cardIndex) {
    var card = deck.cards[cardIndex];
    var theme = global.Theme.random();
    var mode = global.Modes.pickFor(card, deck);
    var stage = $('#stage');

    /* Retire the outgoing card with a random exit. */
    var old = stage.querySelector('.card');
    if (old) {
      /* A swiped card is already flying off under its own transform;
         adding an exit animation would snap it back to centre first. */
      if (!old.classList.contains('is-swiped')) {
        old.classList.add(EXITS[Math.floor(Math.random() * EXITS.length)]);
        old.addEventListener('animationend', function () { old.remove(); }, { once: true });
      }
      setTimeout(function () { if (old.parentNode) old.remove(); }, 900);
    }

    var el = h('div', 'card');
    global.Theme.apply(el, theme);
    el.dataset.entrance = theme.entrance.name;
    /* Provisional; paintQuestion recomputes it once the letter count
       is known. */
    el.style.setProperty('--stagger', theme.entrance.stagger + 'ms');

    el.appendChild(global.Theme.backdropNode(theme));

    var body = h('div', 'card-body');
    var kicker = h('div', 'kicker', mode.label);
    var flipper = h('div', 'flipper');
    var front = h('div', 'face face-front');
    var qEl = h('h2', 'q');
    front.appendChild(qEl);
    var back = h('div', 'face face-back');
    var backAnswer = h('div', 'q a-face');
    back.appendChild(backAnswer);
    flipper.appendChild(front);
    flipper.appendChild(back);

    var inline = h('div', 'answer-inline');
    var area = h('div', 'mode-area');

    body.appendChild(kicker);
    body.appendChild(flipper);
    body.appendChild(inline);
    body.appendChild(area);
    el.appendChild(body);
    stage.appendChild(el);

    /* Cap the whole stagger sweep rather than the per-letter step. At a
       fixed 34ms, a 45-letter question took 2.5s to finish arriving —
       almost all of it accumulated delay, not animation. */
    var STAGGER_SPAN = 240;

    function paintQuestion(text) {
      var t = theme.font.caps ? String(text).toUpperCase() : String(text);
      var n = global.Txt.splitLetters(qEl, t, { accentWords: theme.treatment === 'accent-words' });
      var step = Math.min(theme.entrance.stagger, STAGGER_SPAN / Math.max(n, 1));
      el.style.setProperty('--stagger', step.toFixed(1) + 'ms');
      fitLater(qEl, front);
    }

    session.keydown = {};
    session.keyup = {};

    var ctx = {
      card: card,
      deck: deck,
      theme: theme,

      keys: function (map) {
        Object.keys(map).forEach(function (k) {
          if (k.indexOf(' :up') === 0) session.keyup[' '] = map[k];
          else session.keydown[k] = map[k];
        });
      },

      setKicker: function (text) {
        if (kicker.textContent === text) return;
        kicker.classList.add('is-changing');
        setTimeout(function () {
          kicker.textContent = text;
          kicker.classList.remove('is-changing');
        }, 130);
      },

      /* Modes that walk through sub-items (bucket) repaint the big text. */
      setQuestion: paintQuestion,

      tapSurface: function (fn) {
        el.classList.add('is-tappable');
        el.addEventListener('click', function (e) {
          if (e.target.closest('button, input, .grade-bar, .swipe-bar')) return;
          fn();
        });
      },

      /* Drag-to-grade. Owned here because only app.js holds the card
         element; modes just say what left and right mean. */
      enableSwipe: function (opts) {
        var startX = 0, startY = 0, dragging = false, committed = false, axis = null;
        var width = el.clientWidth || 360;
        var threshold = Math.min(110, width * 0.28);

        function down(e) {
          if (committed || e.target.closest('button, input, textarea')) return;
          dragging = true;
          axis = null;
          startX = e.clientX;
          startY = e.clientY;
          el.classList.add('is-dragging');
        }

        function move(e) {
          if (!dragging) return;
          var dx = e.clientX - startX;
          var dy = e.clientY - startY;

          /* Lock to an axis on first meaningful movement so a vertical
             scroll inside a long explanation never grades the card. */
          if (!axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
            axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
          }
          if (axis !== 'x') return;

          el.style.transform = 'translateX(' + dx.toFixed(1) + 'px)';
          el.style.opacity = String(Math.max(0.4, 1 - Math.abs(dx) / (width * 1.5)));
          el.dataset.swipe = dx > 24 ? 'right' : dx < -24 ? 'left' : '';
        }

        function up(e) {
          if (!dragging) return;
          dragging = false;
          el.classList.remove('is-dragging');
          var dx = e.clientX - startX;
          if (axis === 'x' && Math.abs(dx) >= threshold) commit(dx > 0);
          else release();
        }

        function release() {
          el.style.transform = '';
          el.style.opacity = '';
          el.dataset.swipe = '';
        }

        function commit(right) {
          if (committed) return;
          committed = true;
          /* Tells renderCard to leave this card alone — it is already
             animating itself off in the direction of the swipe. */
          el.classList.add('is-swiped');
          el.style.transform = 'translateX(' + (right ? width * 1.2 : -width * 1.2) + 'px)';
          el.style.opacity = '0';
          (right ? opts.onRight : opts.onLeft)();
        }

        el.addEventListener('pointerdown', down);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
        el.addEventListener('pointerleave', up);

        return { commit: commit };
      },

      /* style: 'swap' | 'pop' | 'mark' — returns the answer node */
      revealAnswer: function (style) {
        var aText = card.a;
        if (style === 'swap' || style === 'flip') {
          global.Txt.splitLetters(backAnswer, aText, {});
          fitLater(backAnswer, back);
          el.classList.add('is-swapped');
          return backAnswer;
        }
        var node = h('div', 'answer answer-' + style);
        global.Txt.splitLetters(node, aText, {});
        inline.appendChild(node);
        requestAnimationFrame(function () { node.classList.add('is-in'); });
        return node;
      },

      /* score is 0..1 — multi-row modes (trend, bucket, order, match,
         range) award partial credit, but only a clean sweep counts the
         card as resolved. */
      finish: function (score) {
        score = typeof score === 'boolean' ? (score ? 1 : 0) : Number(score) || 0;
        var clean = score >= 0.999;

        session.answers++;
        session.score += score;

        if (clean) {
          session.correct++;
          session.streak++;
          session.best = Math.max(session.best, session.streak);
          session.resolved[cardIndex] = true;
          if (session.streak >= 3) global.Sfx.streak(Math.min(session.streak, 8)); else global.Sfx.right();
        } else {
          session.streak = 0;
          if (score === 0) global.Sfx.wrong();
          /* Requeue a missed card a few positions back so it comes
             around again inside the same session. */
          var at = Math.min(3, session.queue.length);
          session.queue.splice(at, 0, cardIndex);
        }
        global.Store.recordAnswer(deck.id, cardIndex, clean);
        updateHud();
        setTimeout(nextCard, 180);
      }
    };

    /* Mount first, then size the question — the mode decides how much
       vertical room is left over. */
    mode.mount(area, ctx);
    if (!qEl.childNodes.length) paintQuestion(card.q);
  }

  /* Fonts load async — fitting before they land measures the fallback. */
  function fitLater(el, box) {
    var run = function () { global.Txt.fit(el, box); };
    requestAnimationFrame(run);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);

    /* One measurement isn't enough. The mode UI can change height after the
       first fit — a slider settling, an explanation opening — and that
       shrinks the question's box underneath it, so text that fitted a moment
       ago now clips. Re-fit whenever the box actually changes size.
       Safe from feedback: `box` is the face, sized by the flipper, and
       changing the question's font-size doesn't resize it. */
    if (global.ResizeObserver) {
      var ro = new global.ResizeObserver(function () {
        if (!box.isConnected) { ro.disconnect(); return; }
        run();
      });
      ro.observe(box);
    }
  }

  function endSession() {
    var secs = Math.round((Date.now() - session.started) / 1000);
    /* Accuracy uses partial credit; "correct" counts only clean sweeps. */
    var acc = session.answers ? Math.round((session.score / session.answers) * 100) : 0;

    $('#summary-title').textContent = acc >= 90 ? 'FLAWLESS' : acc >= 70 ? 'SOLID' : 'KEEP GOING';
    var stats = $('#summary-stats');
    stats.textContent = '';
    [
      [acc + '%', 'accuracy'],
      [session.best, 'best streak'],
      [session.correct + '/' + session.answers, 'correct'],
      [(secs < 60 ? secs + 's' : Math.floor(secs / 60) + 'm ' + (secs % 60) + 's'), 'time']
    ].forEach(function (pair, i) {
      var box = h('div', 'stat');
      box.style.setProperty('--i', i);
      box.appendChild(h('span', 'stat-n', String(pair[0])));
      box.appendChild(h('span', 'stat-l', pair[1]));
      stats.appendChild(box);
    });

    global.Sfx.done();
    show('screen-summary');
    renderHome();
  }

  /* ───────────────────────── editor ────────────────────────── */
  function saveDeckFromForm() {
    var name = $('#deck-name').value.trim();
    var body = $('#deck-body').value;
    var cards = body.split('\n').map(function (line) {
      var parts = line.split('|');
      if (parts.length < 2) return null;
      var q = parts[0].trim(), a = parts.slice(1).join('|').trim();
      return (q && a) ? { q: q, a: a } : null;
    }).filter(Boolean);

    if (!name || !cards.length) {
      alert('Needs a name and at least one "front | back" line.');
      return;
    }

    global.Store.saveDeck({
      id: 'user-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + cards.length,
      name: name.toUpperCase(),
      blurb: cards.length + ' cards',
      cards: cards
    });
    $('#deck-name').value = '';
    $('#deck-body').value = '';
    renderHome();
    show('screen-home');
  }

  /* ───────────────────────── wiring ────────────────────────── */
  function init() {
    if (reduceMotion) document.body.classList.add('reduce-motion');

    renderHome();

    $('#btn-quit').addEventListener('click', function () { show('screen-home'); renderHome(); });
    $('#btn-home').addEventListener('click', function () { show('screen-home'); });
    $('#btn-again').addEventListener('click', function () { startSession(session.deck); });
    $('#btn-new-deck').addEventListener('click', function () { show('screen-editor'); });
    $('#btn-cancel-deck').addEventListener('click', function () { show('screen-home'); });
    $('#btn-save-deck').addEventListener('click', saveDeckFromForm);
    $('#btn-reset-progress').addEventListener('click', function () {
      if (confirm('Wipe all progress?')) { global.Store.resetProgress(); renderHome(); }
    });

    document.addEventListener('keydown', function (e) {
      if (!$('#screen-session').classList.contains('is-active')) return;
      if (e.key === 'Escape') { show('screen-home'); renderHome(); return; }
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      var fn = session && session.keydown[e.key];
      if (fn) { e.preventDefault(); fn(e); }
    });

    document.addEventListener('keyup', function (e) {
      if (!session) return;
      var fn = session.keyup[e.key];
      if (fn) { e.preventDefault(); fn(e); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
