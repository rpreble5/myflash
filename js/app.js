/* app.js — screens, session engine, card rendering. */

(function (global) {
  'use strict';

  var h = global.Modes.h;
  var $ = function (sel) { return document.querySelector(sel); };

  var reduceMotion = global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────────────────────── screens ───────────────────────── */
  /* Switches screens. With `animate`, the current screen fades down and
     the next rises in; `after` runs once the next screen is on. Plain
     calls switch at once, as before. */
  function show(id, animate, after) {
    var cur = document.querySelector('.screen.is-active');
    var next = document.getElementById(id);
    function flip() {
      Array.prototype.forEach.call(document.querySelectorAll('.screen'), function (s) {
        s.classList.remove('is-leaving', 'is-entering');
        s.classList.toggle('is-active', s === next);
      });
      if (after) after();
    }
    if (!animate || reduceMotion || !cur || cur === next) { flip(); return; }
    cur.classList.add('is-leaving');
    setTimeout(function () {
      flip();
      next.classList.add('is-entering');
      setTimeout(function () { next.classList.remove('is-entering'); }, 400);
    }, 150);
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
    global.Modes.pressable(el, target || el, true);
  }

  /* A deck of longer questions: locked and dimmed until the flashcards
     it follows have each been answered right once. `sub` tucks it under
     the deck it belongs to. */
  function questionRow(deck, i, sub) {
    var row = h('button', 'deck-row deck-questions' + (sub ? ' deck-sub' : ''));
    row.style.setProperty('--i', i);
    row.appendChild(h('span', 'deck-name', deck.name));
    var gate = deck._gate;
    if (gate.unlocked) {
      var d = deck._strength;
      row.appendChild(h('span', 'deck-line', d.started
        ? d.weak + ' weak' + (d.unseen ? ' · ' + d.unseen + ' unseen' : '') + ' · ' + d.total + ' questions'
        : d.total + ' questions · not started'));
      row.appendChild(meter(d.strength));
      pressable(row);
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        startSession([deck]);
      });
    } else {
      row.classList.add('is-locked');
      row.disabled = true;
      row.appendChild(h('span', 'deck-line',
        'Unlocks when each card above is answered right once · ' + gate.learned + ' of ' + gate.total));
      row.appendChild(meter(gate.total ? gate.learned / gate.total : 0));
    }
    return row;
  }

  /* The topics slide in on the first visit only; coming back from a
     session should not replay it. */
  var homeShown = false;

  /* How many cards a short run holds. Long enough to be worth opening,
     short enough to finish in a queue. */
  var SHORT_RUN = 20;

  /* A run of chosen positions, grouped by deck with the worst deck first.
     `picked` is in priority order across many decks; the session keeps
     each deck together, so the decks are ordered by where their first
     (worst) card falls and the positions are remapped onto that list. */
  function startPicked(decks, picked) {
    var order = [], index = {};
    picked.forEach(function (p) {
      if (index[p.deck] == null) { index[p.deck] = order.length; order.push(decks[p.deck]); }
    });
    startSession(order, picked.map(function (p) { return { deck: index[p.deck], card: p.card }; }));
  }

  /* The subject as a whole, above the topics: the worst cards across
     every topic to repair, what has not been started, and how much has
     slipped under the line since it was last studied. Hidden on a subject
     with nothing to say. */
  /* ── Export ──────────────────────────────────────────────
     A set of cards as plain text, to feed something else: a podcast
     generator, a study buddy, a document. Each card is its question, its
     answer in words, and its explanation. */
  function cardAnswer(card) {
    var unit = card.unit ? ' ' + card.unit : '';
    switch (card.type) {
      case 'truefalse': return card.a ? 'True' : 'False';
      case 'multi': return card.answers.join('; ') +
        (card.distractors && card.distractors.length ? ' (not: ' + card.distractors.join(', ') + ')' : '');
      case 'number':
        if (card.values) return card.values.join(' ' + (card.join || '–') + ' ') + unit;
        if (card.low != null) return card.low + ' to ' + card.high + unit;
        return card.value + unit;
      case 'bucket': return card.bins.map(function (b) {
        return b + ': ' + card.items.filter(function (i) { return i.bin === b; }).map(function (i) { return i.label; }).join(', ');
      }).join(' | ');
      case 'match': return card.pairs.map(function (p) { return p.left + ' → ' + p.right; }).join('; ');
      case 'trend': return card.items.map(function (i) {
        return i.label + ' ' + (i.dir === 'up' ? 'up' : i.dir === 'down' ? 'down' : 'unchanged');
      }).join(', ');
      case 'order': return (card.steps || []).join(' → ');
      default: return String(card.a == null ? '' : card.a);
    }
  }

  function exportText(decks, picks, heading) {
    var lines = ['MYFLASH · ' + heading + ' · ' + new Date().toISOString().slice(0, 10), ''];
    picks.forEach(function (p, i) {
      var deck = decks[p.deck], card = deck.cards[p.card];
      lines.push((i + 1) + '. ' + card.q + '  [' + deck.name + ']');
      lines.push('   Answer: ' + cardAnswer(card));
      if (card.why) lines.push('   Why: ' + card.why);
      lines.push('');
    });
    return lines.join('\n');
  }

  /* The chooser: how many of the worst, or the flagged set, then copy
     or share. */
  function openExport(decks, label) {
    if ($('.sheet')) return;
    var sheet = h('div', 'sheet');
    var panel = h('div', 'sheet-panel');
    panel.appendChild(h('p', 'sheet-title', 'Export ' + label));
    var weakAll = global.Store.drillCards(decks);
    var flagged = global.Store.flaggedCards(decks);

    function row(name, picks, heading) {
      var r = h('div', 'sheet-row export-row');
      r.appendChild(h('span', 'sheet-name', name));
      var acts = h('span', 'export-acts');
      var copy = h('button', 'lib-btn', 'Copy');
      copy.addEventListener('click', function (e) {
        e.stopPropagation();
        copyText(exportText(decks, picks, heading), copy, 'Copy');
      });
      acts.appendChild(copy);
      if (navigator.share) {
        var share = h('button', 'lib-btn', 'Share');
        share.addEventListener('click', function (e) {
          e.stopPropagation();
          navigator.share({ title: 'MYFLASH · ' + heading, text: exportText(decks, picks, heading) }).catch(function () { /* dismissed */ });
        });
        acts.appendChild(share);
      }
      r.appendChild(acts);
      panel.appendChild(r);
    }

    /* Sizes smaller than the weak set, then the whole set (capped so a
       barely-started subject does not export everything). */
    [10, 20, 40].forEach(function (n) {
      if (n < weakAll.length) row(n + ' weakest', weakAll.slice(0, n), label + ' · ' + n + ' weakest cards');
    });
    if (weakAll.length) {
      var all = weakAll.slice(0, 60);
      row(all.length === weakAll.length ? 'All ' + all.length + ' weak' : all.length + ' weakest', all,
          label + ' · ' + all.length + ' weakest cards');
    }
    if (flagged.length) row(flagged.length + ' flagged', flagged, label + ' · ' + flagged.length + ' flagged cards');
    if (!weakAll.length && !flagged.length) panel.appendChild(h('p', 'sheet-line', 'Nothing weak or flagged here yet.'));

    sheet.appendChild(panel);
    function close() {
      sheet.classList.remove('is-in');
      setTimeout(function () { if (sheet.parentNode) sheet.remove(); }, reduceMotion ? 0 : 220);
    }
    sheet.addEventListener('click', close);
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    document.querySelector('.screen.is-active').appendChild(sheet);
    requestAnimationFrame(function () { sheet.classList.add('is-in'); });
  }

  function renderDrillPanel(box, decks, label) {
    box.textContent = '';
    var weak = global.Store.drillCards(decks, SHORT_RUN);
    var unseen = global.Store.unseenCards(decks);
    var due = global.Store.dueCount(decks);
    var flagged = global.Store.flaggedCards(decks);
    box.hidden = !weak.length && !unseen.length && !flagged.length;
    if (box.hidden) return;

    var total = global.Store.drillCards(decks).length;
    var bits = [];
    if (total) bits.push(total + ' weak');
    if (due) bits.push(due + ' slipped');
    if (unseen.length) bits.push(unseen.length + ' unseen');
    if (flagged.length) bits.push(flagged.length + ' flagged');
    box.appendChild(h('div', 'subject-drill-line', bits.join(' · ')));

    if (weak.length) {
      var drill = h('button', 'btn btn-subject-weak',
        total > SHORT_RUN ? 'Drill the ' + SHORT_RUN + ' weakest' : 'Drill ' + weak.length + ' weak card' + (weak.length === 1 ? '' : 's'));
      drill.addEventListener('click', function () { startPicked(decks, weak); });
      box.appendChild(drill);
    }
    if (unseen.length) {
      var start = h('button', 'btn btn-ghost btn-subject-unseen',
        unseen.length > SHORT_RUN ? 'Start ' + SHORT_RUN + ' unseen' : 'Start ' + unseen.length + ' unseen');
      start.addEventListener('click', function () { startPicked(decks, unseen.slice(0, SHORT_RUN)); });
      box.appendChild(start);
    }
    if (flagged.length) {
      var fl = h('button', 'btn btn-ghost btn-subject-unseen',
        'Drill ' + flagged.length + ' flagged');
      fl.addEventListener('click', function () { startPicked(decks, flagged.slice(0, SHORT_RUN * 2)); });
      box.appendChild(fl);
    }
    /* The worst or the flagged, as text, for use outside the app. */
    var exp = h('button', 'subject-export', 'Export cards');
    exp.addEventListener('click', function () { openExport(decks, label || ''); });
    box.appendChild(exp);
  }

  /* ── Navigation: home → collection → subject ─────────────────
     Each step is a screen of its own with a back arrow; the list on each
     arrives staggered the first time it is shown after a move. */
  function goHome(animate) { homeShown = false; show('screen-home', animate, renderHome); }
  function openCollection(name, animate) {
    if (name) global.Store.setSetting('collection', name);
    homeShown = false;
    show('screen-collection', animate, renderCollection);
  }
  function openSubject(name, animate) {
    if (name) global.Store.setSetting('subject', name);
    homeShown = false;
    show('screen-subject', animate, renderSubject);
  }
  function rendererFor(id) {
    return id === 'screen-collection' ? renderCollection : id === 'screen-subject' ? renderSubject : renderHome;
  }
  function activeScreen() {
    var s = document.querySelector('.screen.is-active');
    return s ? s.id : 'screen-home';
  }

  /* Home: one tile per collection. */
  function renderHome() {
    var list = $('#coll-list');
    list.textContent = '';
    list.classList.toggle('is-entering', !homeShown);
    homeShown = true;
    var beaten = global.Store.challengeBeaten();
    var won = global.Challenge.TOPICS.filter(function (t) { return beaten[t.id]; }).length;
    $('#challenge-line').textContent = won >= global.Challenge.TOPICS.length
      ? 'Complete'
      : won + ' of ' + global.Challenge.TOPICS.length;

    global.Store.collections().forEach(function (coll, ci) {
      var tile = h('div', 'topic coll-tile');
      tile.style.setProperty('--i', ci);
      var head = h('button', 'topic-head');
      head.appendChild(h('span', 'topic-name coll-name', coll.name));
      var line = coll.cards
        ? coll.subjects + (coll.subjects === 1 ? ' subject' : ' subjects') + ' · ' + coll.decks + (coll.decks === 1 ? ' deck' : ' decks') + ' · ' + coll.cards + ' cards'
        : 'Nothing here yet';
      head.appendChild(h('span', 'topic-line', line));
      if (coll.cards) head.appendChild(meter(coll.strength));
      pressable(head, tile);
      head.addEventListener('click', function () { openCollection(coll.name, true); });
      tile.appendChild(head);
      list.appendChild(tile);
    });
  }

  /* Collection: its subjects as rows, weakest first, under the
     collection-wide drill. */
  function renderCollection() {
    var coll = global.Store.currentCollection();
    $('#coll-title').textContent = coll;
    renderDrillPanel($('#coll-drill'), global.Store.collectionDecks(coll), coll);
    var list = $('#subject-list');
    list.textContent = '';
    list.classList.toggle('is-entering', !homeShown);
    homeShown = true;
    var subs = global.Store.subjects(coll);
    if (!subs.length) {
      list.appendChild(h('p', 'settings-empty', 'No decks in this collection yet. Add some from Settings → Library.'));
      return;
    }
    subs.forEach(function (sub, si) {
      var row = h('div', 'topic');
      row.style.setProperty('--i', si);
      if (!sub.started) row.classList.add('is-fresh');
      var head = h('button', 'topic-head');
      head.appendChild(h('span', 'topic-name', sub.name));
      var t = sub.topics + (sub.topics === 1 ? ' topic' : ' topics');
      head.appendChild(h('span', 'topic-line', sub.started
        ? t + ' · ' + sub.weak + ' weak' + (sub.due ? ' · ' + sub.due + ' slipped' : '') + (sub.unseen ? ' · ' + sub.unseen + ' unseen' : '')
        : t + ' · ' + sub.cards + ' cards · not started'));
      head.appendChild(meter(sub.strength));
      head.appendChild(h('span', 'topic-tag', sub.started ? strengthLabel(sub.strength) : 'new'));
      pressable(head, row);
      head.addEventListener('click', function () { openSubject(sub.name, true); });
      row.appendChild(head);
      list.appendChild(row);
    });
  }

  /* Subject: topics weakest first, each opening onto its decks in the
     same order. The number itself stays out of it — a percentage invites
     you to farm the metric instead of the material, and on a ten-card
     deck it is mostly noise anyway. */
  function renderSubject() {
    var list = $('#deck-list');
    list.textContent = '';
    list.classList.toggle('is-entering', !homeShown);
    homeShown = true;
    $('#subject-title').textContent = global.Store.currentSubject();

    renderDrillPanel($('#subject-drill'), global.Store.subjectDecks(), global.Store.currentSubject());

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
        ? topic.startedDecks + ' of ' + decks + ' · ' + topic.weak + ' weak' + (topic.due ? ' · ' + topic.due + ' slipped' : '')
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
      var weak = global.Store.drillCards(topic.decks, SHORT_RUN);
      if (weak.length) {
        var capped = weak.length === SHORT_RUN;
        var drill = h('button', 'btn btn-ghost btn-topic-weak',
          capped ? 'Drill the ' + SHORT_RUN + ' weakest'
                 : 'Drill ' + weak.length + ' weak card' + (weak.length === 1 ? '' : 's'));
        drill.addEventListener('click', function (e) {
          e.stopPropagation();
          startPicked(topic.decks, weak);
        });
        drill.style.setProperty('--i', 1);
        inner.appendChild(drill);
      }
      /* Coverage is its own action: cards never met are not drilled, they
         are started, and only once the topic is under way — on a fresh
         topic "Study all" is that button. */
      if (topic.started && topic.unseen) {
        var fresh = global.Store.unseenCards(topic.decks, SHORT_RUN);
        var start = h('button', 'btn btn-ghost btn-topic-weak',
          topic.unseen > SHORT_RUN ? 'Start ' + SHORT_RUN + ' of ' + topic.unseen + ' unseen'
                                   : 'Start ' + topic.unseen + ' unseen');
        start.addEventListener('click', function (e) {
          e.stopPropagation();
          startPicked(topic.decks, fresh);
        });
        start.style.setProperty('--i', weak.length ? 2 : 1);
        inner.appendChild(start);
      }

      var questionsFor = {};
      topic.questions.forEach(function (q) { if (q.for) (questionsFor[q.for] = questionsFor[q.for] || []).push(q); });

      topic.decks.forEach(function (deck, di) {
        var d = deck._strength;
        var row = h('button', 'deck-row');
        row.style.setProperty('--i', di + 2);
        pressable(row);
        row.appendChild(h('span', 'deck-name', deck.name));
        row.appendChild(h('span', 'deck-line', d.started
          ? d.weak + ' weak' + (d.unseen ? ' · ' + d.unseen + ' unseen' : '') + ' · ' + d.total + ' cards'
          : d.total + ' cards · not started'));
        row.appendChild(meter(d.strength));
        row.addEventListener('click', function (e) {
          e.stopPropagation();
          startSession([deck]);
        });
        inner.appendChild(row);
        (questionsFor[deck.id] || []).forEach(function (q) {
          inner.appendChild(questionRow(q, di + 2, true));
        });
      });

      /* Topic-wide questions, if any, come last; a deck's own follow it. */
      topic.questions.filter(function (q) { return !q.for; }).forEach(function (deck, qi) {
        inner.appendChild(questionRow(deck, topic.decks.length + qi + 2));
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

  /* ──────────────────── challenge ───────────────────── */
  /* The path: one square per topic, beaten ones filled, the next one
     breathing, the rest faded. Beaten topics can be replayed. */
  var PATH_X = [0, 1, 1.5, 1, 0, -1, -1.5, -1, 0, 1];
  var PATH_STEP_PX = 72;
  var trailNodes = null;   // what drawTrail last drew, for a redraw on resize

  /* A placeholder for the baddie that waits at the next topic. Static
     markup, no card content. Swap for real art later. */
  var BADDIE = '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<path d="M24 6c10 0 17 7 17 17 0 8-3 14-8 19H15C10 37 7 31 7 23 7 13 14 6 24 6z"/>' +
    '<circle class="baddie-eye" cx="18" cy="24" r="3.4"/><circle class="baddie-eye" cx="30" cy="24" r="3.4"/>' +
    '<circle class="baddie-pupil" cx="18.8" cy="24.6" r="1.6"/><circle class="baddie-pupil" cx="30.8" cy="24.6" r="1.6"/>' +
    '<path class="baddie-line" d="M13 17.5l8 3.5M35 17.5l-8 3.5"/>' +
    '<path class="baddie-line" d="M19 33.5q5 3.5 10 0"/></svg>';

  /* A topic's baddie in one of its poses: map, taunt, hit or down.
     Topics without art fall back to the placeholder. */
  var BADDIE_POSES = ['map', 'taunt', 'hit', 'down'];
  function baddieSrc(topic, pose) {
    return topic && topic.baddie ? 'assets/baddies/' + topic.baddie + '-' + pose + '.webp' : null;
  }
  function baddieNode(topic, pose) {
    var src = baddieSrc(topic, pose);
    if (src) { var img = h('img', 'baddie-img is-' + pose); img.src = src; img.alt = ''; return img; }
    var ph = h('span', 'baddie');
    ph.innerHTML = BADDIE;
    return ph;
  }

  function renderChallenge() {
    var topics = global.Challenge.TOPICS;
    var beaten = global.Store.challengeBeaten();
    var won = topics.filter(function (t) { return beaten[t.id]; }).length;
    $('#path-intro').textContent = won >= topics.length
      ? 'All ' + topics.length + ' beaten. Replay any topic.'
      : 'Beat all ' + topics.length + ' topics. ' + global.Challenge.HEARTS + ' hearts per topic.';

    var path = $('#path');
    path.textContent = '';
    var trail = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    trail.setAttribute('class', 'path-trail');
    trail.innerHTML = '<path class="trail-all"/><path class="trail-done"/>';
    path.appendChild(trail);

    var current = -1;
    topics.forEach(function (t, i) { if (current < 0 && !beaten[t.id]) current = i; });

    /* Built from the top down so the first topic sits at the bottom and
       the climb goes up the screen. */
    var nodes = [];
    for (var i = topics.length - 1; i >= 0; i--) (function (topic, i) {
      var step = h('div', 'path-step');
      step.style.setProperty('--i', i);
      var x = PATH_X[i % PATH_X.length];
      step.style.setProperty('--x', x);
      var wrap = h('div', 'path-node-wrap');
      var node = h('button', 'path-node', String(i + 1));
      node.setAttribute('aria-label', topic.name);
      node._x = x;
      var side = x > 0 ? 'is-left' : 'is-right';
      if (i === current) {
        /* The next topic: the baddie stands on the path at full size,
           with the button to go beside it. */
        step.classList.add('is-current');
        var stand = baddieNode(topic, 'map');
        stand.classList.add('baddie-stand');
        stand._x = x;
        /* Art faces the viewer's left. When the button is on the right,
           the baddie is mirrored so it still squares up to it. */
        if (side === 'is-right') stand.classList.add('is-flipped');
        var col = h('div', 'path-go-col ' + side);
        /* The button is the baddie's close-up where the art has one,
           looking back at the baddie; a play glyph otherwise. */
        var go = h('button', 'path-go', topic.baddieFace ? '' : '▶');
        if (topic.baddieFace) {
          go.classList.add('has-face');
          var face = h('img', 'path-go-face' + (side === 'is-left' ? ' is-flipped' : ''));
          face.src = baddieSrc(topic, 'face');
          face.alt = '';
          go.appendChild(face);
        }
        go.setAttribute('aria-label', 'Start ' + topic.name);
        col.appendChild(go);
        col.appendChild(h('span', 'path-go-name', topic.name));
        wrap.appendChild(stand);
        wrap.appendChild(col);
        step.appendChild(wrap);
        path.appendChild(step);
        nodes[i] = stand;
        var going = false;
        function launch() {
          if (going) return;
          going = true;
          global.Sfx.flip();
          go.classList.add('is-go');
          /* The baddie gets a word in before the fight. */
          if (topic.baddie) stand.src = baddieSrc(topic, 'taunt');
          stand.classList.add('is-go');
          setTimeout(function () { startSession([topic], null, { challenge: topic }); }, 320);
        }
        go.addEventListener('pointerdown', function () { global.Sfx.press(); });
        pressable(go);
        go.addEventListener('click', launch);
        stand.addEventListener('click', launch);
        return;
      }
      if (beaten[topic.id]) {
        /* A beaten square shows the baddie knocked out, or a tick when
           the topic has no art yet. */
        step.classList.add('is-beaten');
        if (topic.baddie) { node.textContent = ''; node.appendChild(baddieNode(topic, 'down')); }
        else node.textContent = '✓';
      } else step.classList.add('is-locked');
      node.addEventListener('click', function () { startSession([topic], null, { challenge: topic }); });
      wrap.appendChild(node);
      /* The name sits on the inner side, toward the middle of the screen,
         so it never crosses the trail. */
      wrap.appendChild(h('span', 'path-name ' + side, topic.name));
      step.appendChild(wrap);
      path.appendChild(step);
      nodes[i] = node;
    })(topics[i], i);

    trailNodes = { nodes: nodes, upTo: current < 0 ? topics.length - 1 : current };
    drawTrail();
  }

  /* A smooth curve through the node centres: dotted grey the whole way,
     dotted blue over the part already climbed. Centres come from offsets
     plus the --x shift, so the entrance animation cannot skew them. */
  function drawTrail() {
    if (!trailNodes) return;
    var path = $('#path');
    var pts = trailNodes.nodes.map(function (n) {
      /* Offsets are summed up the positioned chain to the path itself. */
      var x = n.offsetWidth / 2 + n._x * PATH_STEP_PX, y = n.offsetHeight / 2, el = n;
      while (el && el !== path) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
      return [x, y];
    });
    var svg = path.querySelector('.path-trail');
    svg.setAttribute('viewBox', '0 0 ' + path.clientWidth + ' ' + path.clientHeight);
    svg.querySelector('.trail-all').setAttribute('d', curveThrough(pts));
    svg.querySelector('.trail-done').setAttribute('d', curveThrough(pts.slice(0, trailNodes.upTo + 1)));
  }

  function curveThrough(pts) {
    if (pts.length < 2) return '';
    var d = 'M' + Math.round(pts[0][0]) + ' ' + Math.round(pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + [
        p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
        p2[0], p2[1]
      ].map(Math.round).join(' ');
    }
    return d;
  }

  /* Opens scrolled to where you stand, so the climb ahead is up. */
  function openChallenge() {
    show('screen-challenge', true, function () {
      renderChallenge();
      var here = $('#path .path-step.is-current') || $('#path .path-step');
      if (here) here.scrollIntoView({ block: 'center' });
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

  /* ──────────────────── library ───────────────────── */
  /* Every deck, hidden ones included, grouped by collection and subject,
     with what can be done to it: hide or show, reset its progress, move
     it, and delete it if it was added here. Built-in decks cannot be
     deleted — they live in the source file — but they can be hidden. */
  function renderLibrary() {
    var sel = $('#lib-import-coll');
    sel.textContent = '';
    global.Store.collections().forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.name; o.textContent = c.name;
      if (c.name === global.Store.currentCollection()) o.selected = true;
      sel.appendChild(o);
    });

    var list = $('#library-list');
    list.textContent = '';
    var groups = {}, order = [];
    global.Store.allDecks(true).forEach(function (deck) {
      var key = global.Store.collectionOf(deck) + ' › ' + (deck.subject || 'Family Medicine');
      if (!groups[key]) { groups[key] = []; order.push(key); }
      groups[key].push(deck);
    });
    order.sort();
    order.forEach(function (key) {
      list.appendChild(h('h3', 'settings-head', key));
      var group = h('div', 'settings-group');
      groups[key].forEach(function (deck) { group.appendChild(libraryRow(deck)); });
      list.appendChild(group);
    });
  }

  function libraryRow(deck) {
    var row = h('div', 'lib-row');
    var text = h('div', 'manage-text');
    var name = h('span', 'manage-name', deck.name || deck.id);
    if (deck.hidden) name.appendChild(h('span', 'lib-tag', 'hidden'));
    if (deck.kind === 'questions') name.appendChild(h('span', 'lib-tag', 'questions'));
    text.appendChild(name);
    var n = deck.cards.length;
    text.appendChild(h('span', 'manage-line',
      (deck.topic ? deck.topic + ' · ' : '') + n + (n === 1 ? ' card' : ' cards') +
      (global.Store.isCustom(deck.id) ? ' · added here' : '')));
    row.appendChild(text);

    var acts = h('div', 'lib-actions');
    function act(label, fn) {
      var b = h('button', 'lib-btn', label);
      b.addEventListener('click', fn);
      acts.appendChild(b);
    }
    act(deck.hidden ? 'Show' : 'Hide', function () {
      global.Store.hideDeck(deck.id, !deck.hidden);
      renderLibrary();
    });
    act('Reset', function () {
      if (!confirm('Reset progress on ' + (deck.name || deck.id) + '?')) return;
      global.Store.resetDeckProgress(deck.id);
      renderLibrary();
    });
    act('Move', function () {
      var coll = prompt('Collection for ' + (deck.name || deck.id) + ':', global.Store.collectionOf(deck));
      if (coll == null || !coll.trim()) return;
      var subj = prompt('Subject:', deck.subject || 'Family Medicine');
      if (subj == null || !subj.trim()) return;
      global.Store.moveDeck(deck.id, coll.trim(), subj.trim());
      renderLibrary();
    });
    if (global.Store.isCustom(deck.id)) {
      act('Delete', function () {
        if (!confirm('Delete ' + (deck.name || deck.id) + '?\n\n' +
              deck.cards.length + ' cards and their progress go with it. This cannot be undone.')) return;
        global.Store.deleteDeck(deck.id);
        renderLibrary();
      });
    }
    row.appendChild(acts);
    return row;
  }

  function importFromLibrary() {
    var ta = $('#lib-import'), msg = $('#lib-import-msg');
    var text = ta.value.trim();
    if (!text) { msg.textContent = 'Paste a deck first.'; return; }
    try {
      var added = global.Store.importDecks(text, $('#lib-import-coll').value);
      msg.textContent = 'Added ' + added.length + (added.length === 1 ? ' deck: ' : ' decks: ') +
        added.map(function (d) { return d.name; }).join(', ') + '.';
      ta.value = '';
      renderLibrary();
    } catch (e) {
      msg.textContent = 'Not added: ' + (e && e.message ? e.message : 'could not read that JSON.');
    }
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
  function startSession(decks, only, opts) {
    if (!Array.isArray(decks)) decks = [decks];
    opts = opts || {};

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
      misses: {},          // card key -> times missed this session
      encore: {},          // card key -> true once sent back to the end
      answers: 0,
      correct: 0,
      score: 0,
      streak: 0,
      best: 0,
      started: Date.now(),
      /* The screen the run was started from, to return to. */
      origin: activeScreen(),
      keydown: {},
      keyup: {},
      /* A challenge run: the topic being attempted and the hearts left.
         Set only from the path. */
      challenge: opts.challenge || null,
      hearts: opts.challenge ? global.Challenge.HEARTS : 0
    };
    $('#streak').hidden = !!session.challenge;
    $('#hearts').hidden = !session.challenge;
    var hudBaddie = $('#hud-baddie');
    hudBaddie.hidden = !(session.challenge && session.challenge.baddie);
    if (!hudBaddie.hidden) {
      hudBaddie.src = baddieSrc(session.challenge, baddieRest());
      /* Every pose, so the first reaction does not flash blank. */
      BADDIE_POSES.concat(session.challenge.baddieFace ? ['face', 'nervous'] : [])
        .forEach(function (p) { var im = new Image(); im.src = baddieSrc(session.challenge, p); });
    }
    /* The list drops away and the first card rises in. */
    show('screen-session', true);
    updateHud();
    nextCard();
  }

  function updateHud() {
    var total = session.total;
    var done = Object.keys(session.resolved).length;
    $('#progress-fill').style.width = (total ? (done / total) * 100 : 0) + '%';
    $('#streak-n').textContent = session.streak;
    $('#streak').classList.toggle('is-hot', session.streak >= 3);
    if (session.challenge) {
      if (session.challenge.baddie && !reactTimer) {
        var rest = baddieSrc(session.challenge, baddieRest());
        var hb = $('#hud-baddie');
        if (hb.getAttribute('src') !== rest) hb.src = rest;
      }
      var row = $('#hearts');
      var max = global.Challenge.HEARTS;
      if (row.children.length !== max) {
        row.textContent = '';
        for (var i = 0; i < max; i++) row.appendChild(h('span', 'heart', '♥'));
      }
      Array.prototype.forEach.call(row.children, function (el, i) {
        var lost = i >= session.hearts;
        var was = el.classList.contains('is-lost');
        el.classList.toggle('is-lost', lost);
        if (lost && !was) {
          el.classList.add('is-just-lost');
          setTimeout(function () { el.classList.remove('is-just-lost'); }, 320);
        }
      });
    }
  }

  function nextCard() {
    if (!session.queue.length) return session.challenge ? endChallenge(true) : endSession();
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
    session.current = { deck: deck, index: cardIndex, card: card };
    paintNoteButton();
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

    function questionSize(t) { return t.length <= 50 ? 34 : t.length <= 80 ? 30 : t.length <= 110 ? 26 : 24; }
    function answerSize(t)   { return t.length <= 24 ? 34 : 28; }

    function place(node, y) { node.style.transform = 'translateY(' + Math.round(y) + 'px)'; }

    function layoutStack() {
      /* A vignette is read top to bottom and scrolls, so nothing is
         placed: the CSS lays it out as ordinary text. */
      if (stack.flow) { qEl.style.fontSize = ''; return; }
      var R = flipper.clientHeight, GAP = STACK_GAP;
      /* Not yet sized: nothing measured now would mean anything, and the
         resize observer below brings the layout back once it is. */
      if (!R) return;
      /* The typed number is as big as the card allows, stepping down only
         when a long range and unit would run off the edge. */
      if (stack.entry) {
        if (!stack.entrySize) stack.entrySize = parseFloat(global.getComputedStyle(stack.entry).fontSize) || 40;
        var eSize = stack.entrySize;
        stack.entry.style.fontSize = eSize + 'px';
        while (eSize > 28 && stack.entry.scrollWidth > stack.entry.clientWidth) {
          eSize -= 2;
          stack.entry.style.fontSize = eSize + 'px';
        }
      }
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
      /* Under a keypad the answer is not part of the block: it arrives
         after CHECK, once the keypad has gone and there is room. */
      var reserve = stack.entry ? 0 : aH;
      while (!stack.shown && qSize > 18 && qH + GAP + eH + reserve > R) {
        qSize -= 2;
        qEl.style.fontSize = qSize + 'px';
        qH = qEl.getBoundingClientRect().height;
      }

      var block = qH + GAP + eH + aH;
      var top = Math.max(0, R * STACK_SETTLE - block / 2);
      /* Under a keypad the question stays at the top and the number being
         typed sits in the middle of what is left. Once checked it stays
         where it was: the keypad collapses, the card grows, and the
         correct answer and the explanation take the room below it. */
      var eTop = 0;
      if (stack.entry) {
        top = 0;
        var minE = qH + GAP;
        eTop = minE + Math.max(0, (R - minE - (eH - GAP)) / 2);
        if (stack.shown && stack.eTop != null) eTop = stack.eTop;
        else stack.eTop = eTop;
      }
      /* Room for the correct answer: always while it may still appear,
         and after the reveal only if it did. */
      var aRoom = !stack.shown || stack.answer.classList.contains('is-in') ? aH + GAP : 0;

      /* The explanation: inline if it fits under the answer, lifting the
         block if need be; otherwise the WHY button. Under a keypad the
         decision waits for the reveal, when the card has its final size. */
      var whyH = 0;
      if (stack.makeWhy) {
        /* Early passes can run before the card has its full height, so a
           dock chosen for want of room is reconsidered on every pass
           until the reveal. A dock chosen because the text is long, and
           anything after the reveal, stays. */
        if (!stack.shown && stack.dock && stack.dock.noFit) setWhy(stack.makeWhy(true));
        if (!stack.why && !stack.dock) setWhy(stack.makeWhy(true));
        if (stack.why) {
          whyH = stack.why.getBoundingClientRect().height;
          var crowded;
          if (stack.entry) {
            crowded = stack.shown && eTop + eH + aRoom + GAP + whyH > R;
          } else {
            var need = block + 2 * GAP + whyH;
            if (top + need > R) top = Math.max(0, R - need);
            crowded = top + need > R;
          }
          if (crowded) {
            useDock();
            stack.dock.noFit = true;
            whyH = 0;
            if (!stack.entry) top = Math.max(0, R * STACK_SETTLE - block / 2);
          }
        }
      }

      var aEnd = stack.entry ? eTop + eH : top + qH + GAP + eH;
      place(qEl, top);
      if (stack.entry) place(stack.entry, eTop);
      place(stack.answer, stack.shown ? aEnd : aEnd + STACK_RISE);
      stack.aEnd = aEnd;
      if (stack.why) {
        var lowest = aEnd + (stack.entry ? aRoom : aH + GAP);
        var bottom = R - whyH - GAP;
        place(stack.why, bottom > lowest ? bottom - (bottom - lowest) * STACK_LIFT : lowest);
      }
    }

    /* Where the explanation lives. Inline text sits in the card's flow
       under the answer. A WHY button — because the text is long, or
       because the inline copy did not fit — is docked at the bottom of
       the card, the same place on every card. */
    function clearWhy() {
      if (stack.why) { stack.why.remove(); stack.why = null; }
      if (stack.dock) { stack.dock.remove(); stack.dock = null; }
    }
    function setWhy(node) {
      clearWhy();
      if (node.querySelector('.why-cue')) {
        node.classList.add('why-dock');
        if (stack.shown) node.classList.remove('is-held');
        el.appendChild(node);
        stack.dock = node;
      } else {
        front.appendChild(node);
        stack.why = node;
      }
    }
    function useDock() { setWhy(stack.makeWhy(false)); }

    function layoutStackLater() {
      requestAnimationFrame(layoutStack);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutStack);
    }

    /* The pieces are placed against the flipper's height at layout time
       and then left alone. That height moves afterwards — fonts arrive, a
       kicker wraps to two lines, the system bars slide in on a phone — and
       the pieces did not follow, which left the WHY cue sitting across
       the flipper's edge, clipped. Lay out again whenever it changes. */
    if (global.ResizeObserver) {
      var watch = new ResizeObserver(function () {
        if (!el.isConnected) { watch.disconnect(); return; }
        if (stack) layoutStack();
      });
      watch.observe(flipper);
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

        /* A challenge heart goes the moment the miss is on screen, not
           on the tap that moves on; the tally in finish() stays as it is. */
        if (session.challenge && score < 0.999) { session.hearts--; updateHud(); }
        if (session.challenge && session.challenge.baddie) baddieReact(score < 0.999 ? 'taunt' : 'hit');

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
        /* Only the grading directions, and only when a swipe here grades;
           no "tap to close". */
        if (noteSwipe) {
          var cue = h('div', 'note-cue');
          cue.appendChild(h('span', 'note-cue-grade', '← MISSED · GOT IT →'));
          sheet.appendChild(cue);
        }
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

        /* Moving on from the note. The sheet is not slid away — that
           showed the old question and answer for a moment before the next
           card arrived. It stays where it is and leaves with the card. */
        function leaveWithCard() {
          session.noteOpen = false;
          session.noteGuard = Date.now() + 400;
          session.closeNote = null;
          sheet.classList.add('is-leaving');
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
            leaveWithCard();
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
          if (session.advance) { leaveWithCard(); session.advance(); }
          else close();
        });
        sheet.addEventListener('click', function (e) { e.stopPropagation(); });

        session.closeNote = close;
      },

      /* Switch this card to the stacked layout. `makeWhy(fits)` builds the
         explanation: inline when `fits`, the WHY button otherwise. */
      stack: function (answerText, makeWhy, entry) {
        el.classList.add('is-stack');
        /* A card with a scenario (`stem`) is a vignette: the scenario
           and question read as a scrolling page above the options. */
        var flow = !!card.stem;
        if (flow) {
          el.classList.add('is-flow');
          front.insertBefore(h('p', 'q-stem', card.stem), qEl);
        }
        /* A string, or a node when the answer needs its own markup (the
           keypad's number with a small unit beside it). */
        var node = h('div', 'q a-face stack-answer', typeof answerText === 'string' ? answerText : '');
        if (typeof answerText !== 'string') node.appendChild(answerText);
        front.appendChild(node);
        if (entry) front.appendChild(entry);
        /* A short explanation that fits shows itself under the answer.
           One that does not becomes the WHY button, docked at the bottom
           of the card, the same place on every card (see useDock). */
        stack = { answer: node, entry: entry || null, makeWhy: makeWhy, why: null, dock: null, cue: false, shown: false, flow: flow };
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
        if (stack.dock) stack.dock.classList.remove('is-held');
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
        var cue = h('div', 'tap-cue', '');
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

        var key = deck.id + ':' + cardIndex;
        if (clean) {
          session.correct++;
          session.streak++;
          session.best = Math.max(session.best, session.streak);
          session.resolved[key] = true;
          /* Missed twice, now right once: once more at the end of the
             run, so the session closes on a second clean answer. */
          if (!session.challenge && session.misses[key] >= 2 && !session.encore[key]) {
            session.encore[key] = true;
            session.queue.push(ref);
          }
        } else {
          session.streak = 0;
          /* A challenge miss costs a heart and the card does not come
             back; a study miss is requeued a few positions back so it
             comes around again inside the same session. */
          if (!session.challenge) {
            session.misses[key] = (session.misses[key] || 0) + 1;
            var at = Math.min(3, session.queue.length);
            session.queue.splice(at, 0, ref);
          }
        }
        /* The real score, not the boolean — a 4-of-5 and a 0-of-5 are not
           the same thing and the ranking needs to know. A challenge run
           stays out of the stats: its cards are not the study cards. */
        if (!session.challenge) global.Store.recordAnswer(deck.id, cardIndex, score);
        updateHud();
        if (session.challenge && session.hearts <= 0) { setTimeout(function () { endChallenge(false); }, 600); return; }
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

    $('#btn-again').textContent = 'Run it back';
    $('#btn-home').textContent = 'Home';
    $('#summary-baddie').hidden = true;
    global.Sfx.done();
    show('screen-summary', true);
    /* The screen behind the summary is brought up to date now, so it is
       right the moment the summary is dismissed. */
    rendererFor(session.origin)();
  }

  /* A challenge run ends in one of two ways, and the summary says which.
     Beating a topic unlocks the next; beating the last beats the lot. */
  function endChallenge(won) {
    var topic = session.challenge;
    var secs = Math.round((Date.now() - session.started) / 1000);
    if (won) global.Store.beatChallengeTopic(topic.id);
    var beaten = global.Store.challengeBeaten();
    var all = global.Challenge.TOPICS.every(function (t) { return beaten[t.id]; });

    $('#summary-title').textContent = !won ? 'OUT OF HEARTS' : all ? 'CHALLENGE COMPLETE' : 'TOPIC BEATEN';
    var stats = $('#summary-stats');
    stats.textContent = '';
    [
      [session.hearts + '/' + global.Challenge.HEARTS, 'hearts left'],
      [session.correct + '/' + session.answers, 'correct'],
      [(secs < 60 ? secs + 's' : Math.floor(secs / 60) + 'm ' + (secs % 60) + 's'), 'time']
    ].forEach(function (pair, i) {
      var box = h('div', 'stat');
      box.style.setProperty('--i', i);
      box.appendChild(h('span', 'stat-n', String(pair[0])));
      box.appendChild(h('span', 'stat-l', pair[1]));
      stats.appendChild(box);
    });
    $('#btn-again').textContent = won ? 'Run it back' : 'Try again';
    $('#btn-home').textContent = 'Path';
    var big = $('#summary-baddie');
    big.hidden = !topic.baddie;
    if (topic.baddie) big.src = baddieSrc(topic, won ? 'down' : 'taunt');
    if (won) global.Sfx.done(); else global.Sfx.wrong();
    show('screen-summary', true);
    renderHome();
  }

  /* The HUD baddie answers each answer: a taunt when you miss, a flinch
     when you land one, then back to glaring. */
  var reactTimer = null;
  /* What the HUD baddie shows between reactions: its close-up where the
     art has one, and the nervous face once you are within two cards of
     beating it. */
  function baddieRest() {
    var t = session && session.challenge;
    if (!t || !t.baddieFace) return 'map';
    return session.queue.length <= 2 && session.hearts > 0 ? 'nervous' : 'face';
  }
  function baddieReact(pose) {
    var img = $('#hud-baddie');
    if (img.hidden || !session.challenge) return;
    img.src = baddieSrc(session.challenge, pose);
    img.classList.remove('is-react');
    void img.offsetWidth;
    img.classList.add('is-react');
    clearTimeout(reactTimer);
    reactTimer = setTimeout(function () {
      reactTimer = null;
      if (session && session.challenge) img.src = baddieSrc(session.challenge, baddieRest());
      img.classList.remove('is-react');
    }, 1100);
  }

  /* ──────────────────── card notes ───────────────────── */
  /* A note on the card on screen: what should be different about it.
     Saved locally and copied out from Settings as plain text. */
  function noteFor(deckId, index) {
    return global.Store.notes().filter(function (n) { return n.deck === deckId && n.index === index; }).pop();
  }

  function paintNoteButton() {
    var b = $('#btn-note');
    var cur = session && session.current;
    b.classList.toggle('has-note', !!(cur && noteFor(cur.deck.id, cur.index)));
    $('#btn-flag').classList.toggle('is-flagged', !!(cur && global.Store.isFlagged(cur.deck.id, cur.index)));
  }

  function toggleCardFlag() {
    var cur = session && session.current;
    if (!cur) return;
    var on = global.Store.toggleFlag(cur.deck.id, cur.index);
    global.Sfx.select();
    $('#btn-flag').classList.toggle('is-flagged', on);
  }

  function openCardNote() {
    if ($('.sheet') || !session || !session.current) return;
    var cur = session.current;
    var existing = noteFor(cur.deck.id, cur.index);
    var sheet = h('div', 'sheet');
    var panel = h('div', 'sheet-panel');
    panel.appendChild(h('p', 'sheet-title', 'Note on this card'));
    panel.appendChild(h('p', 'note-card-q', cur.card.q));
    var box = h('textarea', 'note-box');
    box.placeholder = 'What should be different?';
    box.rows = 4;
    if (existing) box.value = existing.text;
    panel.appendChild(box);
    var row = h('div', 'note-actions');
    var save = h('button', 'btn btn-solid', 'Save');
    var cancel = h('button', 'btn btn-ghost', 'Cancel');
    row.appendChild(cancel);
    row.appendChild(save);
    panel.appendChild(row);
    sheet.appendChild(panel);

    function close() {
      sheet.classList.remove('is-in');
      session.closeNote = null;
      setTimeout(function () { if (sheet.parentNode) sheet.remove(); }, reduceMotion ? 0 : 220);
    }
    save.addEventListener('click', function () {
      var text = box.value.trim();
      if (text) {
        global.Store.addNote({
          deck: cur.deck.id, deckName: cur.deck.name, index: cur.index,
          type: cur.card.type || 'recall', q: cur.card.q,
          a: cur.card.a != null ? String(cur.card.a) : undefined, text: text
        });
        global.Sfx.select();
      }
      paintNoteButton();
      close();
    });
    cancel.addEventListener('click', close);
    sheet.addEventListener('click', close);
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    /* The card underneath must not read the typing as swipes or keys. */
    ['pointerdown', 'pointermove', 'pointerup'].forEach(function (t) {
      sheet.addEventListener(t, function (e) { e.stopPropagation(); });
    });
    session.closeNote = close;
    $('#screen-session').appendChild(sheet);
    requestAnimationFrame(function () { sheet.classList.add('is-in'); box.focus(); });
  }

  function renderNotes() {
    var all = global.Store.notes();
    $('#notes-line').textContent = all.length
      ? all.length + (all.length === 1 ? ' note' : ' notes') + ' waiting to be copied'
      : 'No notes yet. Tap ✎ on a card while studying.';
    $('#btn-notes-copy').disabled = !all.length;
    $('#btn-notes-clear').disabled = !all.length;
  }

  function notesText() {
    return global.Store.notes().map(function (n) {
      return '[' + n.deck + ' #' + n.index + '] ' + n.type + ' · ' + n.q +
        (n.a ? '\n  answer: ' + n.a : '') + '\n  note: ' + n.text;
    }).join('\n\n');
  }

  function copyNotes(btn) { copyText(notesText(), btn, 'Copy notes'); }

  /* Copies `text`, reporting on the button pressed, which reads `label`
     again afterwards. */
  function copyText(text, btn, label) {
    function done(ok) {
      btn.textContent = ok ? 'Copied' : 'Could not copy';
      setTimeout(function () { btn.textContent = label; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      return;
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { /* unsupported */ }
    ta.remove();
    done(ok);
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

    $('#btn-note').addEventListener('click', openCardNote);
    $('#btn-flag').addEventListener('click', toggleCardFlag);
    $('#btn-notes-copy').addEventListener('click', function () { copyNotes(this); });
    $('#btn-notes-clear').addEventListener('click', function () {
      if (confirm('Clear all card notes?')) { global.Store.clearNotes(); renderNotes(); }
    });
    $('#btn-settings').addEventListener('click', function () {
      renderScreenInfo();
      renderNotes();
      show('screen-settings');
    });

    $('#btn-settings-back').addEventListener('click', function () { goHome(); });
    $('#btn-coll-back').addEventListener('click', function () { goHome(true); });
    $('#btn-subject-back').addEventListener('click', function () { openCollection(null, true); });
    $('#btn-library').addEventListener('click', function () { renderLibrary(); show('screen-library'); });
    $('#btn-library-back').addEventListener('click', function () { show('screen-settings'); });
    $('#btn-lib-import').addEventListener('click', importFromLibrary);
    /* Leaving a run lands back where it was started from; a challenge
       run goes back to the path. */
    function leaveSession() {
      if (session && session.challenge) { openChallenge(); return; }
      var to = (session && session.origin) || 'screen-home';
      homeShown = false;             // the list arrives again, one after another
      show(to, true, rendererFor(to));
    }
    $('#btn-quit').addEventListener('click', leaveSession);
    $('#btn-home').addEventListener('click', leaveSession);
    $('#btn-again').addEventListener('click', function () {
      startSession(session.decks, null, session.challenge ? { challenge: session.challenge } : null);
    });
    $('#btn-challenge').addEventListener('click', openChallenge);
    global.addEventListener('resize', function () {
      if ($('#screen-challenge').classList.contains('is-active')) drawTrail();
    });
    $('#btn-challenge-back').addEventListener('click', function () { show('screen-home', true); renderHome(); });
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
        leaveSession(); return;
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
