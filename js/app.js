/* app.js — screens, session engine, card rendering. */

(function (global) {
  'use strict';

  var h = global.Modes.h;
  var $ = function (sel) { return document.querySelector(sel); };

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

  /* Starts empty and fills to its value once on screen. */
  function meter(value) {
    var m = h('span', 'meter');
    var fill = h('span', 'meter-fill');
    fill.style.width = '0%';
    m.appendChild(fill);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { fill.style.width = Math.round(value * 100) + '%'; });
    });
    return m;
  }

  /* The chunky press for things that are not answer buttons: the target
     sinks into its bottom edge while a finger is on `el`. */
  function pressable(el, target) {
    target = target || el;
    function up() { target.classList.remove('is-pressed'); }
    el.addEventListener('pointerdown', function () { target.classList.add('is-pressed'); });
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', up);
  }

  /* The topics slide in on the first visit only; coming back from a
     session should not replay it. */
  var homeShown = false;

  /* How many cards a short run holds. Long enough to be worth opening,
     short enough to finish in a queue. */
  var SHORT_RUN = 20;

  /* Topics weakest first, each opening onto its decks in the same order.
     The number itself stays out of it — a percentage invites you to farm
     the metric instead of the material, and on a ten-card deck it is
     mostly noise anyway. */
  function renderHome() {
    var list = $('#deck-list');
    list.textContent = '';
    list.classList.toggle('is-entering', !homeShown);
    homeShown = true;

    global.Store.topics().forEach(function (topic, ti) {
      var group = h('div', 'topic');
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

      /* Two wrappers so the open/close can animate its height: the outer
         is a one-row grid going 0fr to 1fr, the inner clips. */
      var body = h('div', 'topic-decks');
      var clip = h('div', 'topic-decks-clip');
      var inner = h('div', 'topic-decks-inner');
      clip.appendChild(inner);
      body.appendChild(clip);

      /* Runs the topic's decks one after another, weakest first — a longer
         session without mixing the cards, which is the thing to preserve. */
      var all = h('button', 'btn btn-ghost btn-topic-all',
                  'Study all ' + topic.cards + ' cards');
      all.addEventListener('click', function (e) {
        e.stopPropagation();
        startSession(topic.decks.slice());
      });
      all.style.setProperty('--i', 0);
      inner.appendChild(all);

      /* The short run: only the cards the strength model calls weak, worst
         first, capped so a topic where nothing has been studied yet gives
         a session rather than the whole thing again.

         Hidden when there is nothing weak — a topic that is entirely solid
         has no drill to offer, and a button that would start a run of zero
         cards is worse than no button. */
      var weak = global.Store.weakCards(topic.decks, SHORT_RUN);
      if (weak.length) {
        var capped = weak.length === SHORT_RUN && topic.weak > SHORT_RUN;
        var drill = h('button', 'btn btn-ghost btn-topic-weak',
          capped ? 'Drill the ' + SHORT_RUN + ' weakest'
                 : 'Drill ' + weak.length + ' weak card' + (weak.length === 1 ? '' : 's'));
        drill.addEventListener('click', function (e) {
          e.stopPropagation();
          startSession(topic.decks.slice(), weak);
        });
        drill.style.setProperty('--i', 1);
        inner.appendChild(drill);
      }

      topic.decks.forEach(function (deck, di) {
        var d = deck._strength;
        var row = h('button', 'deck-row');
        row.style.setProperty('--i', di + 2);
        pressable(row);
        row.appendChild(h('span', 'deck-name', deck.name));
        row.appendChild(h('span', 'deck-line', d.started
          ? d.weak + ' of ' + d.total + ' weak'
          : d.total + ' cards · not started'));
        row.appendChild(meter(d.strength));
        row.addEventListener('click', function (e) {
          e.stopPropagation();
          startSession([deck]);
        });
        inner.appendChild(row);
      });

      pressable(head, group);
      head.addEventListener('click', function () {
        var open = group.classList.toggle('is-open');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      group.appendChild(head);
      group.appendChild(body);
      list.appendChild(group);
    });
  }

  /* What the phone says about its screen, to diagnose layouts that get
     cut off at the bottom: the reported heights, the bottom inset, and
     whether it runs fullscreen. */
  function renderScreenInfo() {
    var out = $('#screen-info');
    if (!out) return;
    function probe(css) {
      var d = document.createElement('div');
      d.style.cssText = 'position:fixed;left:0;top:0;width:1px;visibility:hidden;' + css;
      document.body.appendChild(d);
      var v = Math.round(d.getBoundingClientRect().height);
      d.remove();
      return v;
    }
    var vv = global.visualViewport;
    var mode = ['fullscreen', 'standalone', 'browser'].filter(function (m) {
      return global.matchMedia && matchMedia('(display-mode: ' + m + ')').matches;
    })[0] || 'unknown';
    out.textContent = 'Screen ' + innerWidth + '×' + innerHeight +
      ' · vh ' + probe('height:100vh') +
      ' · dvh ' + (probe('height:100dvh') || 'n/a') +
      ' · visual ' + (vv ? Math.round(vv.height) : 'n/a') +
      ' · device ' + screen.width + '×' + screen.height +
      ' · inset ' + probe('height:env(safe-area-inset-bottom)') +
      ' · ' + mode;
  }

  /* ──────────────────── app update ───────────────────── */
  /* The build is read off the script tag that loaded this file rather than
     written down somewhere. A constant can be forgotten on a release and
     then confidently reports the wrong number; this one cannot disagree
     with what is actually running, which is the only thing the readout is
     for — without it the button is unfalsifiable. */
  function buildId() {
    var tag = document.querySelector('script[src*="js/app.js"]');
    var m = tag && String(tag.getAttribute('src')).match(/[?&]v=([^&]+)/);
    return m ? m[1] : 'dev';
  }

  /* There is no service worker, so there is no update lifecycle to ask
     politely. What goes stale is the HTTP cache holding index.html, and
     with it the ?v= stamps that would otherwise pull fresh CSS and JS —
     so the document itself has to be refetched under a URL the cache has
     never seen.

     The service worker and cache-storage steps are guarded rather than
     assumed: they do nothing today and mean this button stays correct if
     one is ever added. */
  function forceUpdate(btn) {
    var label = btn.textContent;
    btn.textContent = 'Updating…';
    btn.disabled = true;

    var jobs = [];
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
      jobs.push(navigator.serviceWorker.getRegistrations().then(function (regs) {
        return Promise.all(regs.map(function (r) { return r.update(); }));
      }));
    }
    if (global.caches && caches.keys) {
      jobs.push(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      }));
    }

    /* A failed sub-step must not strand the button — the reload is the
       part that matters and works on its own. */
    var settled = jobs.map(function (j) { return j.catch(function () {}); });
    var went = false;
    var go = function () {
      if (went) return;
      went = true;
      btn.textContent = label;
      location.replace(location.pathname + '?u=' + Date.now());
    };

    Promise.all(settled).then(go, go);
    /* A browser that resolves neither should not leave the button sitting
       on "Updating…" forever. */
    setTimeout(go, 2500);
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
  function startSession(decks, only) {
    if (!Array.isArray(decks)) decks = [decks];

    /* `only` restricts the run to a chosen set of positions — the weak
       ones — without touching how a session is built. Selection decides
       WHICH cards; the grouping below still decides the order, so a
       shorter run is still one deck at a time rather than a pile. */
    var allow = null;
    if (only) {
      allow = {};
      only.forEach(function (x) { allow[x.deck + ':' + x.card] = true; });
    }

    var order = [];
    decks.forEach(function (d, di) {
      var idx = [];
      for (var i = 0; i < d.cards.length; i++) {
        if (!allow || allow[di + ':' + i]) idx.push(i);
      }
      global.Txt.shuffle(idx).forEach(function (i) { order.push({ deck: di, card: i }); });
    });

    if (!order.length) return;

    session = {
      decks: decks,
      deck: decks[0],
      queue: order,
      /* What the progress bar divides by. Counting every card in every
         deck would leave a filtered run stuck short of full. */
      total: order.length,
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
    var total = session.total;
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
    var mode = global.Modes.pickFor(card, deck);
    var stage = $('#stage');

    /* Retire the outgoing card. */
    var old = stage.querySelector('.card');
    if (old) {
      /* A swiped card is already flying off under its own transform;
         adding an exit animation would snap it back to centre first. */
      if (!old.classList.contains('is-swiped')) {
        old.classList.add('exit-shrink');
        old.addEventListener('animationend', function () { old.remove(); }, { once: true });
      }
      setTimeout(function () { if (old.parentNode) old.remove(); }, 900);
    }

    var el = h('div', 'card');
    /* Interaction-led modes cap the question so the control gets the room. */
    if (mode.compact) el.dataset.qsize = 'compact';

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

    function paintQuestion(text) {
      qEl.textContent = String(text);
      if (stack) { layoutStack(); return; }
      fitLater(qEl, front);
    }

    /* ── Stacked layout (recall) ──────────────────────────────
       The question is placed once and never moves; the answer slides up
       into the space under it and the explanation fades in lower down.
       Sizes come from the text length, not from fitting, so nothing
       rewraps while the card is on screen. */
    var stack = null;
    var STACK_GAP = 16;
    /* Where the question and answer sit, as a share of the space. */
    var STACK_SETTLE = 0.32;
    /* How far the explanation is lifted toward the answer, as a share of
       the empty space between them. */
    var STACK_LIFT = 0.4;
    var STACK_RISE = 24;

    function questionSize(t) { return t.length <= 50 ? 30 : t.length <= 80 ? 26 : 22; }
    function answerSize(t)   { return t.length <= 24 ? 34 : 28; }

    function place(node, y) { node.style.transform = 'translateY(' + Math.round(y) + 'px)'; }

    function layoutStack() {
      var R = flipper.clientHeight, GAP = STACK_GAP;
      /* Under a typed number the correct one matches it in size. */
      stack.answer.style.fontSize = (stack.entry
        ? parseFloat(global.getComputedStyle(stack.entry).fontSize) || 40
        : answerSize(stack.answer.textContent)) + 'px';
      var aH = stack.answer.getBoundingClientRect().height;
      /* A live entry line (the keypad's number) sits between the question
         and the answer, which then only appears on a miss. */
      var eH = stack.entry ? stack.entry.getBoundingClientRect().height + GAP : 0;

      /* The question's size comes from its length. Only on a screen too
         short for the whole block does it step down, and only before the
         answer is shown, so it never rewraps in front of you. */
      var qSize = questionSize(qEl.textContent);
      qEl.style.fontSize = qSize + 'px';
      var qH = qEl.getBoundingClientRect().height;
      while (!stack.shown && qSize > 18 && qH + GAP + eH + aH > R) {
        qSize -= 2;
        qEl.style.fontSize = qSize + 'px';
        qH = qEl.getBoundingClientRect().height;
      }

      var block = qH + GAP + eH + aH;
      var top = Math.max(0, R * STACK_SETTLE - block / 2);

      /* The explanation: inline if it fits under the answer, lifting the
         block if need be; otherwise the WHY button. */
      var whyH = 0;
      if (stack.makeWhy) {
        if (!stack.why) setWhy(stack.makeWhy(true));
        whyH = stack.why.getBoundingClientRect().height;
        var need = block + 2 * GAP + whyH;
        if (top + need > R) top = Math.max(0, R - need);
        if (top + need > R && !stack.cue) {
          setWhy(stack.makeWhy(false));
          stack.cue = true;
          whyH = stack.why.getBoundingClientRect().height;
        }
      }

      var aEnd = top + qH + GAP + eH;
      place(qEl, top);
      if (stack.entry) place(stack.entry, top + qH + GAP);
      place(stack.answer, stack.shown ? aEnd : aEnd + STACK_RISE);
      stack.aEnd = aEnd;
      if (stack.why) {
        var lowest = top + block + 2 * GAP;
        var bottom = R - whyH - GAP;
        place(stack.why, bottom > lowest ? bottom - (bottom - lowest) * STACK_LIFT : lowest);
      }
    }

    function setWhy(node) {
      if (stack.why) stack.why.remove();
      stack.why = node;
      front.appendChild(node);
    }

    function layoutStackLater() {
      requestAnimationFrame(layoutStack);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutStack);
    }

    session.keydown = {};
    session.keyup = {};
    var noteSwipe = null;

    var ctx = {
      card: card,
      deck: deck,

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
        /* Every mode reaches judge, so releasing the note here is what
           makes `why` work on all of them rather than on whichever ones
           happened to wire it up. */
        var held = el.querySelector('.why-wrap.is-held');
        if (held) held.classList.remove('is-held');

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
      /* A long explanation takes the whole card instead of folding into a
         strip under the answer. It is built here for the same reason
         enableSwipe is: only app.js holds the card element, and the sheet
         has to sit above the mode area rather than inside it.

         It is positioned against the card, so it inherits the theme and
         leaves with it — no separate teardown, no stale note surviving
         into the next question. */
      openNote: function (text) {
        if (el.querySelector('.note-sheet')) return;

        var sheet = h('div', 'note-sheet');
        var body = h('div', 'note-body');
        body.appendChild(h('p', 'note-text', text));
        sheet.appendChild(body);
        var cue = h('div', 'note-cue');
        if (noteSwipe) cue.appendChild(h('span', 'note-cue-grade', '← MISSED · GOT IT →'));
        cue.appendChild(h('span', null, 'TAP TO CLOSE'));
        sheet.appendChild(cue);
        el.appendChild(sheet);
        el.classList.add('has-note');
        session.noteOpen = true;
        requestAnimationFrame(function () { sheet.classList.add('is-in'); });

        function close() {
          sheet.classList.remove('is-in');
          el.classList.remove('has-note');
          session.noteOpen = false;
          /* A dismissing tap produces a click a few milliseconds later.
             Without this it lands on the card and advances it. */
          session.noteGuard = Date.now() + 400;
          session.closeNote = null;
          var go = function () { sheet.remove(); };
          if (reduceMotion) go(); else setTimeout(go, 200);
        }

        /* The sheet stops pointer events reaching the card: without this
           a drag to scroll a long note reads as a swipe on the question
           underneath it. */
        var y0 = null, x0 = 0, moved = false, armed = false;
        var GRADE_PX = 80;
        sheet.addEventListener('pointerdown', function (e) {
          e.stopPropagation();
          y0 = e.clientY;
          x0 = e.clientX;
          moved = false;
          armed = false;
        });
        sheet.addEventListener('pointermove', function (e) {
          if (y0 == null) return;
          var dx = e.clientX - x0;
          if (Math.abs(e.clientY - y0) > 10 || Math.abs(dx) > 10) moved = true;
          /* Tick once when a sideways drag has gone far enough to grade. */
          var far = !!noteSwipe && Math.abs(dx) >= GRADE_PX && Math.abs(dx) > Math.abs(e.clientY - y0);
          if (far && !armed) global.Sfx.arm();
          armed = far;
        });
        sheet.addEventListener('pointerup', function (e) {
          e.stopPropagation();
          /* A release with no matching press belongs to the swipe that
             opened this sheet — the finger was already down before it
             existed. Acting on it measured the whole gesture as a downward
             flick and shut the note in the same motion that opened it. */
          if (y0 == null) return;
          var dy = e.clientY - y0;
          var dx = e.clientX - x0;
          y0 = null;
          /* Sideways grades straight from the note, the same as swiping
             the card behind it, so reading the explanation never costs a
             trip back to grade. */
          if (noteSwipe && Math.abs(dx) >= GRADE_PX && Math.abs(dx) > Math.abs(dy)) {
            close();
            noteSwipe(dx > 0);
            return;
          }
          if (moved) {
            /* A downward swipe puts the note away and leaves the card
               where it is — the deliberate "not yet". */
            if (dy > 40) close();
            return;
          }
          /* A tap means done. Closing and then making the reader tap a
             second time to move on is a step that carries no decision. */
          close();
          if (session.advance) session.advance();
        });
        sheet.addEventListener('click', function (e) { e.stopPropagation(); });

        session.closeNote = close;
      },

      /* Switch this card to the stacked layout. `makeWhy(fits)` builds the
         explanation: inline when `fits`, the WHY button otherwise. */
      stack: function (answerText, makeWhy, entry) {
        el.classList.add('is-stack');
        var node = h('div', 'q a-face stack-answer', answerText);
        front.appendChild(node);
        if (entry) front.appendChild(entry);
        stack = { answer: node, entry: entry || null, makeWhy: makeWhy, why: null, cue: false, shown: false };
        /* Built now rather than at layout, so the fallback below that adds
           a missing explanation sees this one and does not add a second. */
        if (makeWhy) setWhy(makeWhy(true));
        layoutStackLater();
      },

      /* `withAnswer: false` releases only the explanation — a right answer
         on the keypad is already on screen. */
      stackReveal: function (withAnswer) {
        stack.shown = true;
        if (withAnswer !== false) {
          place(stack.answer, stack.aEnd);
          stack.answer.classList.add('is-in');
        }
        if (stack.why) stack.why.classList.remove('is-held');
      },

      /* A mode that grades by swiping hands that over here, so the same
         swipe works on the note screen. */
      onNoteSwipe: function (fn) { noteSwipe = fn; },

      /* An upward drag anywhere on the card opens the note.

         Excluding buttons was the obvious way to stop a swipe that began
         on GOT IT from grading on its way past, and it was wrong: on a
         multiple-choice card the options cover most of the lower half, so
         the gesture failed exactly where there was most room to make it.
         Instead the drag is allowed to start anywhere and the click that
         the release produces is swallowed once. */
      onSwipeUp: function (fn) {
        var y0 = null, x0 = 0;

        function swallow(e) {
          e.stopPropagation();
          e.preventDefault();
          el.removeEventListener('click', swallow, true);
        }

        el.addEventListener('pointerdown', function (e) {
          y0 = e.clientY; x0 = e.clientX;
        });
        el.addEventListener('pointermove', function (e) {
          if (y0 == null) return;
          var dy = y0 - e.clientY;
          if (dy > 48 && dy > Math.abs(e.clientX - x0)) {
            y0 = null;
            el.addEventListener('click', swallow, true);
            setTimeout(function () { el.removeEventListener('click', swallow, true); }, 500);
            fn();
          }
        });
        el.addEventListener('pointerup', function () { y0 = null; });
        el.addEventListener('pointercancel', function () { y0 = null; });
      },

      waitForTap: function (fn) {
        var cue = h('div', 'tap-cue', 'TAP TO CONTINUE');
        el.appendChild(cue);
        el.classList.add('is-tappable');
        requestAnimationFrame(function () { cue.classList.add('is-in'); });

        function go() {
          /* Never advance out from under an open explanation, whatever
             asked — tap, space or Enter. The note dismisses itself first
             and then calls this, so by then the flag is already down. */
          if (session.noteOpen) return;
          session.advance = null;
          el.removeEventListener('click', onClick);
          cue.remove();
          global.Sfx.advance();
          fn();
        }

        function onClick(e) {
          /* The explanation is the one live control once an answer is on
             screen; everything else on the card is spent. Opening it, or
             anything inside it, must not also advance.

             This guard named `.why-toggle` until the fold became a
             full-card note and the class was renamed. It matched nothing
             after that, so every tap on the cue opened the explanation
             and advanced the card in the same gesture — the note appeared
             and vanished, which looked like the note was broken rather
             than the guard. */
          if (e.target.closest('.why-cue, .note-sheet')) return;
          /* The tap that dismissed a note is spent on the dismissal. */
          if (session.noteGuard && Date.now() < session.noteGuard) return;
          go();
        }

        el.addEventListener('click', onClick);
        /* Published so an open note can hand a tap straight through to it
           rather than costing a second one. */
        session.advance = go;
        /* The mode's own shortcuts are spent too. */
        session.keydown = { ' ': go, 'Enter': go };
        session.keyup = {};
      },

      tapSurface: function (fn) {
        el.classList.add('is-tappable');
        el.addEventListener('click', function (e) {
          if (e.target.closest('button, input, .grade-bar, .swipe-bar:not(.is-waiting)')) return;
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
            if (!axis && opts.onTap) opts.onTap(startTarget, startX);
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
          backAnswer.textContent = String(aText);
          fitLater(backAnswer, back);
          el.classList.add('is-swapped');
          return backAnswer;
        }
        var node = h('div', 'answer answer-' + style);
        node.textContent = String(aText);
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

    /* `why` is documented as valid on every card, but only some modes
       mount it. Any that didn't gets one here, held until the answer
       lands — a written explanation that never reaches the screen is the
       worst kind of defect, because the file looks right. */
    if (card.why && !el.querySelector('.why-wrap')) {
      var note = global.Modes.explanation(card.why, ctx);
      note.classList.add('is-held');
      area.appendChild(note);
    }

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

  /* ───────────────────────── wiring ────────────────────────── */
  function init() {
    renderHome();

    bindToggle('#tg-submit', 'submitOnRelease');
    bindToggle('#tg-slider', 'numberSlider');
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
      renderScreenInfo();
      show('screen-settings');
    });

    $('#btn-settings-back').addEventListener('click', function () { show('screen-home'); renderHome(); });
    $('#btn-quit').addEventListener('click', function () { show('screen-home'); renderHome(); });
    $('#btn-home').addEventListener('click', function () { show('screen-home'); });
    $('#btn-again').addEventListener('click', function () { startSession(session.decks); });
    var build = $('#app-build');
    if (build) build.textContent = 'Version ' + buildId();
    $('#btn-update').addEventListener('click', function () { forceUpdate(this); });

    $('#btn-reset-progress').addEventListener('click', function () {
      if (confirm('Wipe all progress?')) { global.Store.resetProgress(); renderHome(); }
    });

    document.addEventListener('keydown', function (e) {
      if (!$('#screen-session').classList.contains('is-active')) return;
      /* An open note takes Escape first. Quitting the whole session out
         from under an explanation someone is reading is never what the
         key meant. */
      if (e.key === 'Escape') {
        if (session && session.closeNote) { session.closeNote(); return; }
        show('screen-home'); renderHome(); return;
      }
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
