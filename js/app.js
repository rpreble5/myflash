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
  var LABELS = [
    { at: 0.75, name: 'solid' },
    { at: 0.45, name: 'shaky' },
    { at: 0,    name: 'weakest' }
  ];

  function strengthLabel(v) {
    for (var i = 0; i < LABELS.length; i++) if (v >= LABELS[i].at) return LABELS[i].name;
    return 'weakest';
  }

  function meter(value) {
    var m = h('span', 'meter');
    var fill = h('span', 'meter-fill');
    fill.style.width = Math.round(value * 100) + '%';
    m.appendChild(fill);
    return m;
  }

  /* Topics weakest first, each opening onto its decks in the same order.
     The number itself stays out of it — a percentage invites you to farm
     the metric instead of the material, and on a ten-card deck it is
     mostly noise anyway. */
  function renderHome() {
    var list = $('#deck-list');
    list.textContent = '';

    global.Store.topics().forEach(function (topic, ti) {
      var pal = global.Theme.PALETTES[ti % global.Theme.PALETTES.length];

      var group = h('div', 'topic');
      group.style.setProperty('--bg', pal.bg);
      group.style.setProperty('--ink', pal.ink);
      group.style.setProperty('--acc', pal.acc);
      group.style.setProperty('--i', ti);
      if (!topic.started) group.classList.add('is-fresh');

      var head = h('button', 'topic-head');
      head.setAttribute('aria-expanded', 'false');
      head.appendChild(h('span', 'topic-name', topic.name));

      var n = topic.decks.length;
      var decks = n + (n === 1 ? ' deck' : ' decks');
      var line = topic.started
        ? topic.startedDecks + ' of ' + decks + ' · ' + topic.weak + ' weak'
        : decks + ' · not started';
      head.appendChild(h('span', 'topic-line', line));
      head.appendChild(meter(topic.strength));
      head.appendChild(h('span', 'topic-tag', topic.started ? strengthLabel(topic.strength) : 'new'));

      var body = h('div', 'topic-decks');

      /* Runs the topic's decks one after another, weakest first — a longer
         session without mixing the cards, which is the thing to preserve. */
      var all = h('button', 'btn btn-ghost btn-topic-all',
                  'Study all ' + topic.cards + ' cards');
      all.addEventListener('click', function (e) {
        e.stopPropagation();
        startSession(topic.decks.slice());
      });
      body.appendChild(all);

      topic.decks.forEach(function (deck, di) {
        var d = deck._strength;
        var row = h('button', 'deck-row');
        row.style.setProperty('--i', di);
        row.appendChild(h('span', 'deck-name', deck.name));
        row.appendChild(h('span', 'deck-line', d.started
          ? d.weak + ' of ' + d.total + ' weak'
          : d.total + ' cards · not started'));
        row.appendChild(meter(d.strength));
        row.addEventListener('click', function (e) {
          e.stopPropagation();
          startSession([deck]);
        });
        body.appendChild(row);
      });

      head.addEventListener('click', function () {
        var open = group.classList.toggle('is-open');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      group.appendChild(head);
      group.appendChild(body);
      list.appendChild(group);
    });
  }

  /* ──────────────────── deck manager ───────────────────── */
  /* Only generated decks appear. The built-ins live in the source file,
     so offering a delete that cannot work would be worse than offering
     none at all. */
  function renderDeckManager() {
    var wrap = $('#deck-manager');
    if (!wrap) return;
    wrap.textContent = '';

    var mine = global.Store.customDecks();
    if (!mine.length) {
      wrap.appendChild(h('p', 'settings-empty',
        'Decks you add with the deck check tool show up here.'));
      return;
    }

    mine.forEach(function (deck) {
      var row = h('div', 'manage-row');
      var text = h('div', 'manage-text');
      text.appendChild(h('span', 'manage-name', deck.name || deck.id));
      var n = deck.cards.length;
      text.appendChild(h('span', 'manage-line',
        (deck.topic ? deck.topic + ' · ' : '') + n + (n === 1 ? ' card' : ' cards')));
      row.appendChild(text);

      var del = h('button', 'manage-del', 'Delete');
      del.setAttribute('aria-label', 'Delete ' + (deck.name || deck.id));
      del.addEventListener('click', function () {
        if (!confirm('Delete ' + (deck.name || deck.id) + '?\n\n' +
              deck.cards.length + ' cards and their progress go with it. This cannot be undone.')) return;
        global.Store.deleteDeck(deck.id);
        renderDeckManager();
        renderHome();
      });
      row.appendChild(del);
      wrap.appendChild(row);
    });
  }

  /* ───────────────────────── settings ──────────────────────── */
  /* `apply` runs on bind as well as on change, so a stored preference is
     in force from boot rather than from the first time it is touched. */
  function bindToggle(id, key, apply) {
    var el = $(id);
    if (!el) return;

    function paint() {
      var on = !!global.Store.setting(key);
      el.classList.toggle('is-on', on);
      el.setAttribute('aria-checked', on ? 'true' : 'false');
      if (apply) apply(on);
    }

    el.addEventListener('click', function () {
      global.Store.setSetting(key, !global.Store.setting(key));
      paint();
    });
    paint();
  }

  /* ───────────────────────── session ───────────────────────── */
  var session = null;

  /* Takes a list of decks. One deck is the common case; a topic hands over
     all of its, already weakest first. Each is shuffled within itself and
     finished before the next begins — the cards stay together, which is
     the whole point of grouping them. */
  function startSession(decks) {
    if (!Array.isArray(decks)) decks = [decks];
    var order = [];
    decks.forEach(function (d, di) {
      global.Txt.shuffle(d.cards.map(function (_, i) { return i; }))
        .forEach(function (i) { order.push({ deck: di, card: i }); });
    });

    session = {
      decks: decks,
      deck: decks[0],
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
    var total = session.decks.reduce(function (n, d) { return n + d.cards.length; }, 0);
    var done = Object.keys(session.resolved).length;
    $('#progress-fill').style.width = (total ? (done / total) * 100 : 0) + '%';
    $('#streak-n').textContent = session.streak;
    $('#streak').classList.toggle('is-hot', session.streak >= 3);
  }

  function nextCard() {
    if (!session.queue.length) return endSession();
    var next = session.queue.shift();
    session.deck = session.decks[next.deck];
    renderCard(session.deck, next.card, next);
  }

  /* Route every later pointer event to the card, however far the finger
     travels. Without this a drag dies the moment the pointer leaves the
     element — which made downward drags depend on where they started. */
  function capture(e) {
    var el = e.currentTarget;
    if (el.setPointerCapture) {
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* stale id */ }
    }
  }

  function renderCard(deck, cardIndex, ref) {
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
    /* Interaction-led modes cap the question so the control gets the room. */
    if (mode.compact) el.dataset.qsize = 'compact';
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

      /* Modes that walk through sub-items (bucket) repaint the big text,
         and sorting swipes that element rather than the whole card. */
      setQuestion: paintQuestion,
      hero: qEl,

      /* The verdict on the answer, played the moment the answer appears.
         It cannot live in finish() any more: finish now runs on the
         advance tap, so a chime there lands as a verdict on the tap. */
      judge: function (score) {
        if (score < 0.999) {
          if (score > 0) global.Sfx.partial(); else global.Sfx.wrong();
          return;
        }
        /* The streak this answer is about to produce — finish() has not
           run yet, so session.streak is still the previous value. */
        var n = session.streak + 1;
        if (n >= 3) global.Sfx.streak(Math.min(n, 8)); else global.Sfx.right();
      },

      /* Hand the pace back to the reader. Every mode that reveals an
         answer ends here rather than on a timer — how long you want to
         look at a miss is not something a constant can know.

         The cue is positioned against the card, not appended to the mode
         area, so its arrival costs no layout: the answer being read must
         not move out from under it. */
      waitForTap: function (fn) {
        var cue = h('div', 'tap-cue', 'TAP TO CONTINUE');
        el.appendChild(cue);
        el.classList.add('is-tappable');
        requestAnimationFrame(function () { cue.classList.add('is-in'); });

        function go() {
          el.removeEventListener('click', onClick);
          cue.remove();
          global.Sfx.advance();
          fn();
        }

        function onClick(e) {
          /* The explanation toggle is the one control still live once an
             answer is on screen; everything else on the card is spent. */
          if (e.target.closest('.why-toggle')) return;
          go();
        }

        el.addEventListener('click', onClick);
        /* The mode's own shortcuts are spent too. */
        session.keydown = { ' ': go, 'Enter': go };
        session.keyup = {};
      },

      tapSurface: function (fn) {
        el.classList.add('is-tappable');
        el.addEventListener('click', function (e) {
          if (e.target.closest('button, input, .grade-bar, .swipe-bar')) return;
          fn();
        });
      },

      /* Vertical drag anywhere on the card, in discrete steps. Owned here
         for the same reason as enableSwipe: only app.js holds the element.

         Rebasing the origin by whole steps (rather than recomputing from
         the initial y) means the value tracks the finger exactly and never
         drifts, and reversing direction responds immediately. */
      enableDial: function (opts) {
        var y0 = 0, dragging = false, moved = false;
        el.classList.add('is-gesture');

        function down(e) {
          if (e.target.closest('button, input, textarea')) return;
          dragging = true;
          moved = false;
          y0 = e.clientY;
          el.classList.add('is-dialing');
          capture(e);
        }

        function move(e) {
          if (!dragging) return;
          var dy = y0 - e.clientY;                 // up is positive
          var steps = (dy / opts.pxPerStep) | 0;
          if (steps !== 0) {
            moved = true;
            opts.onSteps(steps);
            y0 -= steps * opts.pxPerStep;
          }
        }

        function up() {
          if (!dragging) return;
          dragging = false;
          el.classList.remove('is-dialing');
          /* `moved` lets a mode ignore a stray tap that changed nothing. */
          if (opts.onRelease) opts.onRelease(moved);
        }

        el.addEventListener('pointerdown', down);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
        el.addEventListener('lostpointercapture', up);
      },

      /* Drag-to-grade. Owned here because only app.js holds the card
         element; modes just say what left and right mean. */
      enableSwipe: function (opts) {
        var startX = 0, startY = 0, dragging = false, committed = false, axis = null;
        var startTarget = null, armed = false;
        el.classList.add('is-gesture');
        var width = el.clientWidth || 360;
        var threshold = Math.min(110, width * 0.28);
        /* The thing that follows the finger is not always the card: sorting
           moves the item and leaves the card in place. */
        var visual = opts.visual || el;
        /* What the visual does under the finger:
             fly   — travels with it and leaves the screen (default)
             nudge — damped travel, springs back; the card stays put
             none  — holds still, and the mode draws its own feedback from
                     onProgress. Movement is only worth spending when
                     something is actually going somewhere. */
        var motion = opts.motion || 'fly';

        function down(e) {
          if (committed || e.target.closest('button, input, textarea')) return;
          dragging = true;
          axis = null;
          startTarget = e.target;
          startX = e.clientX;
          startY = e.clientY;
          el.classList.add('is-dragging');
          capture(e);
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

          if (motion === 'fly') {
            visual.style.transform = 'translateX(' + dx.toFixed(1) + 'px)';
            visual.style.opacity = String(Math.max(0.4, 1 - Math.abs(dx) / (width * 1.5)));
          } else if (motion === 'nudge') {
            visual.style.transform = 'translateX(' + (dx * 0.35).toFixed(1) + 'px)';
          }
          el.dataset.swipe = dx > 24 ? 'right' : dx < -24 ? 'left' : '';
          /* How far along the commit is, 0..1. A mode can spend this on
             colour instead of travel. */
          if (opts.onProgress) {
            opts.onProgress(Math.min(1, Math.abs(dx) / threshold), dx > 0 ? 'right' : 'left');
          }

          /* Two separate states: `swipe` is the direction you are heading,
             `armed` is having gone far enough that letting go commits.
             Crossing that line ticks, so the gesture can be felt as well
             as seen — nothing else reports it. */
          var far = Math.abs(dx) >= threshold;
          if (far !== armed) {
            armed = far;
            el.dataset.armed = armed ? (dx > 0 ? 'right' : 'left') : '';
            if (armed) global.Sfx.arm();
          }
        }

        function up(e) {
          if (!dragging) return;
          dragging = false;
          el.classList.remove('is-dragging');
          var dx = e.clientX - startX;
          if (axis === 'x' && Math.abs(dx) >= threshold) commit(dx > 0);
          else {
            release();
            /* A pointer that never locked an axis never moved: that's a
               tap. Pointer capture sends this event to the card, so the
               thing under the finger is the *down* target, not e.target. */
            if (!axis && opts.onTap) opts.onTap(startTarget);
          }
        }

        function release() {
          visual.style.transform = '';
          visual.style.opacity = '';
          el.dataset.swipe = '';
          el.dataset.armed = '';
          armed = false;
          if (opts.onProgress) opts.onProgress(0, '');
        }

        function commit(right) {
          if (committed) return;
          committed = true;
          if (motion === 'fly') {
            visual.style.transform = 'translateX(' + (right ? width * 1.2 : -width * 1.2) + 'px)';
            visual.style.opacity = '0';
            /* stayPut: the card survives the swipe, so it must not be
               marked as retiring — the caller resets the visual for the
               next item. Anything that didn't fly is staying by
               definition. */
            if (!opts.stayPut) el.classList.add('is-swiped');
          } else {
            release();
          }
          (right ? opts.onRight : opts.onLeft)();
        }

        /* Put the visual back and allow another swipe. */
        function reset() {
          committed = false;
          axis = null;
          visual.style.transition = 'none';
          release();
          /* Two frames: one to land the cleared transform, one to restore
             the transition so the next drag animates again. */
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { visual.style.transition = ''; });
          });
        }

        el.addEventListener('pointerdown', down);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
        el.addEventListener('lostpointercapture', up);

        return { commit: commit, reset: reset };
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
          session.resolved[deck.id + ':' + cardIndex] = true;
        } else {
          session.streak = 0;
          /* Requeue a missed card a few positions back so it comes
             around again inside the same session. */
          var at = Math.min(3, session.queue.length);
          session.queue.splice(at, 0, ref);
        }
        /* The real score, not the boolean — a 4-of-5 and a 0-of-5 are not
           the same thing and the ranking needs to know. */
        global.Store.recordAnswer(deck.id, cardIndex, score);
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

    bindToggle('#tg-submit', 'submitOnRelease');
    bindToggle('#tg-sound', 'sound', function (on) { global.Sfx.setEnabled(on); });
    bindToggle('#tg-haptics', 'haptics', function (on) { global.Sfx.setHaptics(on); });
    /* Say so rather than offering a switch that does nothing: desktop
       browsers and iOS have no vibration API at all. */
    if (!global.Sfx.hasHaptics()) {
      $('#tg-haptics').classList.add('is-unsupported');
      $('#haptics-note').textContent = 'This device has no vibration motor the browser can reach.';
    }

    $('#btn-settings').addEventListener('click', function () {
      renderDeckManager();               // decks can arrive from the tool between visits
      show('screen-settings');
    });
    $('#btn-settings-back').addEventListener('click', function () { show('screen-home'); renderHome(); });
    $('#btn-quit').addEventListener('click', function () { show('screen-home'); renderHome(); });
    $('#btn-home').addEventListener('click', function () { show('screen-home'); });
    $('#btn-again').addEventListener('click', function () { startSession(session.decks); });
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
