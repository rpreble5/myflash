/* validate.js — shape-checks a generated deck before it reaches a session.

   The app degrades rather than crashes: pickFor falls back to the recall
   presentation when nothing else is eligible. That is kind for `mcq`,
   which still has an `a` to reveal, and silent murder for `multi`,
   `trend`, `bucket`, `order`, `match` and `number`, none of which have
   one. Those render an empty answer face — a card that looks perfect in
   the file and fails in your hand a week later.

   So: errors are cards that will render broken or ungradable. Warnings
   are cards that will work but read badly. Neither can tell you whether
   a card is TRUE. That stays with the author.                           */

(function (global) {
  'use strict';

  /* Observed ceilings from the built-in decks, which have been read and
     approved on a phone. Thresholds sit a little above the real maxima so
     genuine content passes and only outliers are flagged. */
  var Q_MAX = 90;          // longest built-in question is 80
  var ANSWER_MAX = 48;     // longest built-in recall answer is 30
  var OPTION_MAX = 32;     // longest built-in option is 30
  var LABEL_MAX = 28;      // trend rows are narrower than option buttons
  var PAIR_MAX = 24;       // match runs two columns, so half the width
  var WHY_MAX = 400;       // the note gets a few percent of the card
  var DECK_MAX = 40;

  var TYPES = ['recall', 'mcq', 'multi', 'truefalse', 'number',
               'trend', 'bucket', 'order', 'match'];

  var FIELDS = {
    common:    ['type', 'q', 'why', 'ref'],
    recall:    ['a'],
    mcq:       ['a', 'distractors'],
    multi:     ['answers', 'distractors'],
    truefalse: ['a'],
    number:    ['value', 'low', 'high', 'unit', 'tolerance', 'step', 'min', 'max'],
    trend:     ['items'],
    bucket:    ['bins', 'items'],
    order:     ['steps'],
    match:     ['pairs']
  };

  /* Names a model reaches for when it half-remembers the schema. Mapping
     them by hand beats edit distance: `options` is nowhere near
     `distractors`, but it is what every other flashcard format calls it.

     Card-level only, and deliberately conservative. `value` means one
     thing on a number card and something else inside a match pair, so
     nothing that is a real field on any type appears here. */
  var ALIASES = {
    answer: 'a', correct: 'a', back: 'a', front: 'q', question: 'q',
    prompt: 'q', options: 'distractors', choices: 'distractors',
    wrong: 'distractors', explanation: 'why', rationale: 'why',
    note: 'why', source: 'ref', citation: 'ref', units: 'unit',
    steps_in_order: 'steps', order: 'steps', buckets: 'bins',
    categories: 'bins', rows: 'items', tolerence: 'tolerance'
  };

  var DIRS = ['up', 'down', 'same'];
  var DIR_ALIASES = {
    increase: 'up', increased: 'up', rise: 'up', rises: 'up', rising: 'up',
    high: 'up', elevated: 'up', '+': 'up', 'increases': 'up',
    decrease: 'down', decreased: 'down', fall: 'down', falls: 'down',
    falling: 'down', low: 'down', reduced: 'down', '-': 'down',
    'decreases': 'down',
    unchanged: 'same', 'no change': 'same', stable: 'same', normal: 'same',
    flat: 'same', none: 'same', '=': 'same'
  };

  function isStr(v) { return typeof v === 'string' && v.trim().length > 0; }
  function isArr(v) { return Object.prototype.toString.call(v) === '[object Array]'; }
  function norm(s) { return String(s).trim().toLowerCase(); }

  function dupes(list) {
    var seen = {}, out = [];
    list.forEach(function (v) {
      var k = norm(v);
      if (seen[k] === 1) { out.push(v); seen[k] = 2; } else if (!seen[k]) seen[k] = 1;
    });
    return out;
  }

  /* ─────────────────────────── parsing ─────────────────────────── */

  /* Models fence their JSON, prefix it with a sentence, and trail it with
     an offer to make more. Strip all of that before blaming the author. */
  function parse(text) {
    if (!isStr(text)) return { error: 'Nothing pasted.' };
    var s = text.trim();

    var fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) s = fence[1].trim();

    var open = s.search(/[{[]/);
    if (open < 0) return { error: 'No JSON found. Paste the deck object itself.' };
    var close = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
    if (close > open) s = s.slice(open, close + 1);

    var deck;
    try {
      deck = JSON.parse(s);
    } catch (e) {
      var m = String(e.message).match(/position (\d+)/);
      var where = '';
      if (m) {
        var pos = Number(m[1]);
        var line = s.slice(0, pos).split('\n').length;
        where = ' (line ' + line + ': ' + JSON.stringify(s.slice(Math.max(0, pos - 30), pos + 30)) + ')';
      }
      return { error: 'That is not valid JSON. ' + e.message + where };
    }

    if (!deck || typeof deck !== 'object') return { error: 'Expected a deck object.' };

    /* Three shapes arrive in practice: one deck, the set of sub-decks for
       one disease, and a bare list of cards someone forgot to wrap. */
    if (isArr(deck)) {
      if (!deck.length) return { error: 'That is an empty list.' };
      var looksLikeDecks = deck.every(function (d) { return d && typeof d === 'object' && isArr(d.cards); });
      if (looksLikeDecks) return { decks: deck };
      return { decks: [{ cards: deck, _wrapped: true }] };
    }
    if (isArr(deck.decks)) return { decks: deck.decks };
    return { decks: [deck] };
  }

  /* ─────────────────────────── checking ─────────────────────────── */

  function Report() { this.items = []; }

  Report.prototype.add = function (level, where, msg, fix) {
    this.items.push({ level: level, where: where, msg: msg, fix: fix || '' });
  };
  Report.prototype.err = function (w, m, f) { this.add('error', w, m, f); };
  Report.prototype.warn = function (w, m, f) { this.add('warn', w, m, f); };
  Report.prototype.errors = function () {
    return this.items.filter(function (i) { return i.level === 'error'; });
  };
  Report.prototype.warnings = function () {
    return this.items.filter(function (i) { return i.level === 'warn'; });
  };

  function longText(r, where, list, max, what) {
    list.forEach(function (v) {
      if (isStr(v) && v.trim().length > max) {
        r.warn(where, what + ' runs ' + v.trim().length + ' characters: "' + v.trim() + '"',
          'Shorten to under ' + max + '. Long text drops the card out of its grid and into a cramped list.');
      }
    });
  }

  /* Report the misnamed field once, then check the card as if it had been
     named properly. Otherwise one typo cascades: "options" is not read,
     AND there are no distractors, AND the card has fewer than two — three
     messages for one mistake, which buries the fix in noise. */
  function checkFields(r, where, card, type) {
    var allowed = FIELDS.common.concat(FIELDS[type] || []);
    var fixed = null;

    Object.keys(card).forEach(function (k) {
      if (k.charAt(0) === '_' || allowed.indexOf(k) !== -1) return;
      var alias = ALIASES[norm(k)];
      if (alias && allowed.indexOf(alias) !== -1 && card[alias] == null) {
        r.err(where, 'Field "' + k + '" is not read by the app.',
          'Rename it to "' + alias + '".');
        if (!fixed) { fixed = {}; Object.keys(card).forEach(function (x) { fixed[x] = card[x]; }); }
        fixed[alias] = card[k];
        delete fixed[k];
      } else if (alias && allowed.indexOf(alias) !== -1) {
        r.err(where, 'Has both "' + k + '" and "' + alias + '".',
          'Keep "' + alias + '" and delete "' + k + '".');
      } else {
        r.warn(where, 'Field "' + k + '" is not read by the app and will be ignored.');
      }
    });

    return fixed || card;
  }

  function checkStrings(r, where, list, label) {
    var bad = 0;
    list.forEach(function (v) { if (!isStr(v)) bad++; });
    if (bad) r.err(where, label + ' contains ' + bad + ' entr' + (bad === 1 ? 'y' : 'ies') +
      ' that are empty or not text.', 'Every entry must be a non-empty string.');
    return bad === 0;
  }

  var CHECK = {};

  CHECK.recall = function (r, w, c) {
    if (!isStr(c.a)) return r.err(w, 'No answer.', 'Add "a": "the answer".');
    longText(r, w, [c.a], ANSWER_MAX, 'Answer');
  };

  CHECK.mcq = function (r, w, c) {
    if (!isStr(c.a)) r.err(w, 'No answer.', 'Add "a": "the right answer".');
    if (!isArr(c.distractors) || c.distractors.length < 2) {
      return r.err(w, 'Needs at least 2 distractors, has ' +
        (isArr(c.distractors) ? c.distractors.length : 0) + '.',
        'Add wrong answers until there are three, or change this to a recall card.');
    }
    if (!checkStrings(r, w, c.distractors, 'distractors')) return;

    var clash = c.distractors.filter(function (d) { return norm(d) === norm(c.a); });
    if (clash.length) r.err(w, 'A distractor repeats the answer: "' + clash[0] + '".',
      'Replace it. The card is unanswerable as written.');

    dupes(c.distractors).forEach(function (d) {
      r.err(w, 'Duplicate distractor: "' + d + '".', 'Replace one of them.');
    });

    if (c.distractors.length > 4) r.warn(w, c.distractors.length +
      ' distractors is a lot to read on a phone.', 'Three is the sweet spot.');

    longText(r, w, [c.a].concat(c.distractors), OPTION_MAX, 'Option');
  };

  CHECK.multi = function (r, w, c) {
    var a = isArr(c.answers) ? c.answers : [];
    var d = isArr(c.distractors) ? c.distractors : [];

    if (!a.length) return r.err(w, 'No answers.',
      'Add "answers": ["...", "..."]. Without it this card renders blank.');
    if (a.length === 1) r.err(w, 'Only one right answer, so there is nothing to select.',
      'Add another right answer, or change this to an mcq card.');
    if (!d.length) return r.err(w, 'No distractors.',
      'Add at least one wrong option. Without it this card renders blank.');

    if (!checkStrings(r, w, a, 'answers')) return;
    if (!checkStrings(r, w, d, 'distractors')) return;

    var overlap = d.filter(function (x) {
      return a.some(function (y) { return norm(x) === norm(y); });
    });
    if (overlap.length) r.err(w, '"' + overlap[0] + '" is listed as both right and wrong.',
      'Remove it from one of the two lists.');

    dupes(a.concat(d)).forEach(function (x) {
      r.err(w, 'Duplicate option: "' + x + '".', 'Replace one of them.');
    });

    if (a.length + d.length > 7) r.warn(w, (a.length + d.length) +
      ' options is more than fits comfortably.', 'Six or fewer.');

    longText(r, w, a.concat(d), OPTION_MAX, 'Option');
  };

  CHECK.truefalse = function (r, w, c) {
    if (typeof c.a !== 'boolean') {
      return r.err(w, 'Answer is ' + JSON.stringify(c.a) + ', which is not a boolean.',
        'Use "a": true or "a": false — no quotes.');
    }
    if (!isStr(c.why)) r.warn(w, 'No "why".',
      'A true/false card exists to correct a misconception. Without the explanation it just tests a guess.');
  };

  CHECK.number = function (r, w, c) {
    var hasVal = c.value != null, hasRange = c.low != null || c.high != null;

    if (!hasVal && !hasRange) {
      return r.err(w, 'No number.',
        'Add "value" for a target, or "low" and "high" for a range. Without one the card renders blank.');
    }
    if (hasVal && hasRange) {
      return r.err(w, 'Has both "value" and a range.',
        'Pick one. "value" for a target, "low" + "high" for a genuine range.');
    }
    if (hasRange && (c.low == null || c.high == null)) {
      return r.err(w, 'A range needs both ends, has only "' + (c.low == null ? 'high' : 'low') + '".',
        'Add the other, or use "value" instead.');
    }

    var nums = hasVal ? { value: c.value } : { low: c.low, high: c.high };
    var bad = Object.keys(nums).filter(function (k) { return typeof nums[k] !== 'number' || !isFinite(nums[k]); });
    if (bad.length) {
      return r.err(w, '"' + bad[0] + '" is ' + JSON.stringify(nums[bad[0]]) + ', not a number.',
        'Write it as a bare number: 3.3, not "3.3" or "3.3 mEq/L".');
    }
    if (hasRange && c.low >= c.high) {
      return r.err(w, 'low (' + c.low + ') is not below high (' + c.high + ').', 'Swap them.');
    }
    if (c.tolerance != null && (typeof c.tolerance !== 'number' || c.tolerance < 0)) {
      r.err(w, 'tolerance is ' + JSON.stringify(c.tolerance) + '.', 'Use a number of 0 or more.');
    }
    if (!isStr(c.unit)) r.warn(w, 'No unit.', 'Add "unit": "mg" — the dial shows it beside the number.');

    /* The check that only the app can answer: the dial moves in discrete
       steps, and a well-formed card whose answer falls between two of them
       can never be got right. */
    if (global.Modes && global.Modes.scaleFor) {
      var sc = global.Modes.scaleFor(c);
      var lo = hasVal ? c.value - (c.tolerance || 0) : c.low;
      var hi = hasVal ? c.value + (c.tolerance || 0) : c.high;

      if (hi < sc.min || lo > sc.max) {
        r.err(w, 'The answer is outside the dial, which runs ' + sc.min + ' to ' + sc.max + '.',
          'Set "min" and "max" to bracket the answer.');
      } else {
        var first = Math.ceil((lo - sc.min) / sc.step - 1e-9);
        var landed = sc.min + first * sc.step;
        if (landed > hi + 1e-9) {
          r.err(w, 'The dial steps by ' + sc.step + ' and skips straight over the answer — it is unreachable.',
            'Add "step": ' + (hasVal ? suggestStep(c.value) : suggestStep(c.low)) +
            ', or widen "tolerance".');
        }
      }
      if (sc.step && (sc.max - sc.min) / sc.step > 400) {
        r.warn(w, 'The dial needs ' + Math.round((sc.max - sc.min) / sc.step) +
          ' steps to cross, which is a long drag.',
          'Add "min" and "max" to narrow the range, or a coarser "step".');
      }
    }
  };

  function suggestStep(v) {
    var dp = String(v).indexOf('.') < 0 ? 0 : String(v).length - String(v).indexOf('.') - 1;
    return dp > 0 ? Number(Math.pow(10, -dp).toFixed(dp)) : 1;
  }

  CHECK.trend = function (r, w, c) {
    if (!isArr(c.items) || !c.items.length) {
      return r.err(w, 'No items.',
        'Add "items": [{ "label": "...", "dir": "up" }]. Without it this card renders blank.');
    }
    if (c.items.length === 1) {
      r.warn(w, 'One row is a coin flip.',
        'Two to five rows. Two is fine when the pair is the whole pattern — TSH up with free T4 down — but one direction on its own is not a pattern.');
    }
    if (c.items.length > 5) {
      r.warn(w, c.items.length + ' rows will not fit without scrolling.', 'Split into two cards of three or four.');
    }

    var labels = [];
    c.items.forEach(function (it, n) {
      var at = w + ', row ' + (n + 1);
      if (!it || typeof it !== 'object') return r.err(at, 'Not an object.', 'Each row is { "label": "...", "dir": "up" }.');
      if (!isStr(it.label)) r.err(at, 'No label.', 'Add "label": "what is changing".');
      else labels.push(it.label);

      if (!isStr(it.dir)) {
        r.err(at, 'No direction.', 'Add "dir": "up", "down" or "same".');
      } else if (DIRS.indexOf(norm(it.dir)) === -1) {
        var guess = DIR_ALIASES[norm(it.dir)];
        r.err(at, 'dir is "' + it.dir + '", which the app does not understand.',
          guess ? 'Use "' + guess + '".' : 'Use exactly "up", "down" or "same".');
      } else if (it.dir !== norm(it.dir)) {
        r.err(at, 'dir is "' + it.dir + '" — the match is case-sensitive.', 'Use lowercase "' + norm(it.dir) + '".');
      }
    });

    dupes(labels).forEach(function (l) { r.err(w, 'Duplicate row: "' + l + '".', 'Each row must name a different value.'); });
    longText(r, w, labels, LABEL_MAX, 'Row label');
  };

  CHECK.bucket = function (r, w, c) {
    if (!isArr(c.bins) || c.bins.length < 2) {
      return r.err(w, 'Needs 2 bins, has ' + (isArr(c.bins) ? c.bins.length : 0) + '.',
        'Add "bins": ["First", "Second"]. Without two this card renders blank.');
    }
    if (!checkStrings(r, w, c.bins, 'bins')) return;
    if (c.bins.length > 2) {
      r.warn(w, c.bins.length + ' bins means the card loses the swipe and falls back to buttons.',
        'Two bins is the good version of this card.');
    }
    if (!isArr(c.items) || !c.items.length) {
      return r.err(w, 'No items to sort.',
        'Add "items": [{ "label": "...", "bin": "' + c.bins[0] + '" }].');
    }
    if (c.items.length < 4) r.warn(w, 'Only ' + c.items.length + ' items to sort.', 'Four to eight makes a card worth playing.');
    if (c.items.length > 10) r.warn(w, c.items.length + ' items is a long haul in one card.', 'Split it.');

    var bins = c.bins.map(norm), labels = [], used = {};
    c.items.forEach(function (it, n) {
      var at = w + ', item ' + (n + 1);
      if (!it || typeof it !== 'object') return r.err(at, 'Not an object.', 'Each item is { "label": "...", "bin": "..." }.');
      if (!isStr(it.label)) r.err(at, 'No label.', 'Add "label".');
      else labels.push(it.label);

      if (!isStr(it.bin)) {
        r.err(at, 'No bin.', 'Add "bin": "' + c.bins[0] + '".');
      } else if (bins.indexOf(norm(it.bin)) === -1) {
        r.err(at, 'bin is "' + it.bin + '", which is not one of ' + JSON.stringify(c.bins) + '.',
          'Use one of those two strings exactly.');
      } else {
        if (it.bin !== c.bins[bins.indexOf(norm(it.bin))]) {
          r.err(at, 'bin is "' + it.bin + '" but the bin is named "' +
            c.bins[bins.indexOf(norm(it.bin))] + '" — the match is exact.',
            'Copy the string from "bins" character for character.');
        }
        used[norm(it.bin)] = true;
      }
    });

    if (Object.keys(used).length === 1) {
      r.warn(w, 'Every item falls in the same bin.', 'A sorting card needs both answers used.');
    }
    dupes(labels).forEach(function (l) { r.err(w, 'Duplicate item: "' + l + '".', 'Each item must be distinct.'); });
    longText(r, w, labels, OPTION_MAX, 'Item');
    longText(r, w, c.bins, 16, 'Bin name');
  };

  CHECK.order = function (r, w, c) {
    if (!isArr(c.steps) || c.steps.length < 2) {
      return r.err(w, 'Needs at least 2 steps, has ' + (isArr(c.steps) ? c.steps.length : 0) + '.',
        'Add "steps": ["first", "second", "third"] in the correct order. Without them this card renders blank.');
    }
    if (!checkStrings(r, w, c.steps, 'steps')) return;
    if (c.steps.length === 2) r.warn(w, 'Two steps is a coin flip.', 'Three to six is the useful range.');
    if (c.steps.length > 6) r.warn(w, c.steps.length + ' steps will not fit.', 'Split into two cards.');

    dupes(c.steps).forEach(function (s) {
      r.err(w, 'Duplicate step: "' + s + '".',
        'Steps are graded by their text, so two identical steps cannot be told apart. Reword one.');
    });
    longText(r, w, c.steps, OPTION_MAX, 'Step');
  };

  CHECK.match = function (r, w, c) {
    if (!isArr(c.pairs) || c.pairs.length < 2) {
      return r.err(w, 'Needs at least 2 pairs, has ' + (isArr(c.pairs) ? c.pairs.length : 0) + '.',
        'Add "pairs": [{ "left": "...", "right": "..." }]. Without them this card renders blank.');
    }
    if (c.pairs.length === 2) r.warn(w, 'Two pairs is a coin flip.', 'Three to five is the useful range.');
    if (c.pairs.length > 5) r.warn(w, c.pairs.length + ' pairs will not fit in two columns.', 'Split it.');

    var lefts = [], rights = [];
    c.pairs.forEach(function (p, n) {
      var at = w + ', pair ' + (n + 1);
      if (!p || typeof p !== 'object') return r.err(at, 'Not an object.', 'Each pair is { "left": "...", "right": "..." }.');
      if (!isStr(p.left)) r.err(at, 'No left.', 'Add "left".'); else lefts.push(p.left);
      if (!isStr(p.right)) r.err(at, 'No right.', 'Add "right".'); else rights.push(p.right);
    });

    dupes(lefts).forEach(function (l) { r.err(w, 'Duplicate left: "' + l + '".', 'Each left needs exactly one right.'); });
    dupes(rights).forEach(function (x) {
      r.err(w, 'Duplicate right: "' + x + '".',
        'Two identical right-hand options cannot be told apart, so the card cannot be graded fairly. Reword one.');
    });
    longText(r, w, lefts.concat(rights), PAIR_MAX, 'Pair text');
  };

  /* "Endocrinology" beside "Endocrine" is the failure this exists to
     catch: two topics that read as one and rank as two. A shared stem is
     the signal — neither string contains the other, so a prefix test
     misses it. Require five common characters and most of the shorter
     word, which pairs Endocrine/Endocrinology and Cardio/Cardiology
     while leaving Renal and Respiratory alone. */
  function closeTo(a, b) {
    a = norm(a); b = norm(b);
    if (a === b) return true;
    var n = Math.min(a.length, b.length), i = 0;
    while (i < n && a.charAt(i) === b.charAt(i)) i++;
    return i >= 5 && i >= n * 0.6;
  }

  /* ─────────────────────────── the deck ─────────────────────────── */

  function check(deck, knownTopics) {
    var r = new Report();

    if (deck._wrapped) {
      r.warn('deck', 'You pasted a bare list of cards, not a deck.',
        'It needs "name", "topic" and "cards". I have wrapped it so the rest of the check can run.');
    }
    if (!isStr(deck.name)) r.err('deck', 'No name.', 'Add "name": "SHORT NAME".');
    else if (deck.name.trim().length > 22) r.warn('deck', 'Name is long and the home row will clip it.', 'Under 20 characters.');

    if (!isStr(deck.topic)) {
      r.warn('deck', 'No topic, so this deck lands under "Other".',
        'Add "topic": "Endocrine" — it is how the home screen groups and ranks decks.');
    } else if (knownTopics && knownTopics.length) {
      var exact = knownTopics.some(function (t) { return t === deck.topic; });
      if (!exact) {
        var near = knownTopics.filter(function (t) { return closeTo(t, deck.topic); });
        if (near.length) {
          r.err('deck', 'Topic "' + deck.topic + '" nearly matches "' + near[0] + '" but is not identical.',
            'Grouping is an exact string match, so this would create a second topic sitting beside the first. Use "' + near[0] + '".');
        } else {
          r.warn('deck', 'Topic "' + deck.topic + '" is new — no existing deck uses it.',
            'Fine if intended. Existing topics: ' + knownTopics.join(', ') + '.');
        }
      }
    }

    if (!isArr(deck.cards) || !deck.cards.length) {
      r.err('deck', 'No cards.', 'Add "cards": [ ... ].');
      return r;
    }
    if (deck.cards.length > DECK_MAX) {
      r.warn('deck', deck.cards.length + ' cards is more than one sitting.',
        'Under ' + DECK_MAX + '. Two decks under one topic beats one long deck — they still study together.');
    }

    var questions = [], types = {};

    deck.cards.forEach(function (card, i) {
      var w = 'card ' + (i + 1);
      if (!card || typeof card !== 'object') return r.err(w, 'Not an object.', 'Each card is a JSON object.');

      var type = card.type;
      if (type == null) {
        r.warn(w, 'No type, so the app treats it as recall.', 'Add "type": "recall" to be explicit.');
        type = 'recall';
      } else if (TYPES.indexOf(type) === -1) {
        r.err(w, 'Type "' + type + '" does not exist.', 'One of: ' + TYPES.join(', ') + '.');
        return;
      }
      types[type] = (types[type] || 0) + 1;
      w += ' (' + type + ')';

      if (!isStr(card.q)) r.err(w, 'No question.', 'Add "q": "...".');
      else {
        questions.push(card.q);
        if (card.q.trim().length > Q_MAX) {
          r.warn(w, 'Question runs ' + card.q.trim().length + ' characters.',
            'Under ' + Q_MAX + '. Long questions shrink to fit and lose the card its impact.');
        }
        if (/which of the following|all of the above|none of the above/i.test(card.q)) {
          r.warn(w, 'Question uses exam-paper phrasing.',
            'Ask the thing directly — the app already shows the options.');
        }
      }

      if (card.why != null) {
        if (!isStr(card.why)) r.err(w, '"why" is not text.', 'Make it a string, or remove it.');
        else if (card.why.length > WHY_MAX) {
          r.warn(w, '"why" runs ' + card.why.length + ' characters.',
            'Under ' + WHY_MAX + '. The note gets a small band under the answer.');
        }
      }

      var checked = checkFields(r, w, card, type);
      if (CHECK[type]) CHECK[type](r, w, checked);
    });

    dupes(questions).forEach(function (q) {
      r.warn('deck', 'Two cards ask the same question: "' + q + '".', 'Drop one, or make them different facts.');
    });

    return { report: r, types: types, count: deck.cards.length };
  }

  /* One disease arrives as several sub-decks, and the defects that matters
     most then live BETWEEN them: the same fact written into DIAGNOSIS and
     again into MANAGEMENT, or two decks claiming one id. Neither is
     visible while reading a deck at a time, which is exactly how they get
     through. */
  function checkSet(decks, knownTopics) {
    var r = new Report(), types = {}, count = 0;
    var ids = {}, seenQ = {}, topics = {};
    var many = decks.length > 1;

    decks.forEach(function (deck, n) {
      var tag = many ? (isStr(deck.name) ? deck.name.trim() : 'deck ' + (n + 1)) + ' · ' : '';
      var one = check(deck, knownTopics);

      one.report.items.forEach(function (i) {
        r.add(i.level, tag + i.where, i.msg, i.fix);
      });
      Object.keys(one.types || {}).forEach(function (t) { types[t] = (types[t] || 0) + one.types[t]; });
      count += one.count || 0;

      if (isStr(deck.id)) {
        if (ids[deck.id]) {
          r.err(tag + 'deck', 'id "' + deck.id + '" is already used by ' + ids[deck.id] + '.',
            'Ids must be unique — name them like "hypertension-diagnosis".');
        } else ids[deck.id] = isStr(deck.name) ? deck.name : 'another deck';
      } else if (many) {
        r.warn(tag + 'deck', 'No id.', 'Give each sub-deck its own, like "hypertension-diagnosis".');
      }

      if (isStr(deck.topic)) topics[deck.topic] = true;

      if (isArr(deck.cards)) {
        deck.cards.forEach(function (c, i) {
          if (!c || !isStr(c.q)) return;
          var k = norm(c.q).replace(/[^a-z0-9 ]/g, '');
          if (seenQ[k]) {
            r.err(tag + 'card ' + (i + 1), 'Same question as ' + seenQ[k] + ': "' + c.q.trim() + '".',
              'Splitting a disease into sub-decks makes this easy to do twice. Keep one and delete the other.');
          } else seenQ[k] = tag ? tag.replace(' · ', '') : 'an earlier card';
        });
      }
    });

    /* True/false is a coin flip, so a deck loaded with them is weaker than
       its card count suggests. It is also the easiest card to write and
       the natural home for "the trap", which is exactly the material the
       prompt asks for — so the share creeps up without anyone choosing
       it. Measured across three generated diseases it went 24, 28, 33
       percent, which is what prompted the check. */
    var tf = types.truefalse || 0;
    if (count >= 10 && tf / count > 0.3) {
      r.warn('set', Math.round(100 * tf / count) + '% of these cards are true/false (' + tf + ' of ' + count + ').',
        'Aim for under a fifth. A trap usually works better as an mcq with the trap as the tempting wrong answer — a guess then pays 1 in 4 rather than 1 in 2.');
    }

    /* A deck where nearly every true/false is false can be beaten by
       always answering false, and the instruction that causes it is the
       same one that makes the cards worth having: a misconception stated
       plainly is false. Measured across ten written decks it reached 70%
       before anyone noticed. State some of them the right way round. */
    if (tf >= 6) {
      var no = 0;
      decks.forEach(function (d) {
        if (!isArr(d.cards)) return;
        d.cards.forEach(function (c) { if (c && c.type === 'truefalse' && c.a === false) no++; });
      });
      var lean = Math.max(no, tf - no) / tf;
      if (lean > 0.7) {
        r.warn('set', Math.round(100 * lean) + '% of the true/false cards have the same answer (' +
          no + ' false, ' + (tf - no) + ' true).',
          'Rephrase some so the correct statement is the true one. As it stands the type can be guessed.');
      }
    }

    var names = Object.keys(topics);
    if (many && names.length > 1) {
      r.err('set', 'These decks carry ' + names.length + ' different topics: ' + names.join(', ') + '.',
        'Sub-decks of one disease must share one topic exactly, or they will not group or rank together.');
    }

    return { report: r, types: types, count: count, decks: decks };
  }

  /* A paste-back fix request. The point of the tool is that you never
     write one of these by hand. */
  function fixRequest(result) {
    var errs = result.report.errors(), warns = result.report.warnings();
    if (!errs.length && !warns.length) return '';

    var out = ['Some cards in that deck do not match the format. Please return the whole deck again as one JSON object, with these fixed and nothing else changed.', ''];
    if (errs.length) {
      out.push('Must fix — these cards will not work:');
      errs.forEach(function (i) { out.push('- ' + i.where + ': ' + i.msg + (i.fix ? ' ' + i.fix : '')); });
      out.push('');
    }
    if (warns.length) {
      out.push('Worth fixing — these will work but read badly:');
      warns.forEach(function (i) { out.push('- ' + i.where + ': ' + i.msg + (i.fix ? ' ' + i.fix : '')); });
    }
    return out.join('\n');
  }

  global.Validate = {
    parse: parse, check: check, checkSet: checkSet, fixRequest: fixRequest, TYPES: TYPES
  };
})(typeof window !== 'undefined' ? window : global);
