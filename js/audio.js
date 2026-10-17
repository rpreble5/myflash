/* audio.js — WebAudio: a tiny synth for most sounds, plus a few short
   recorded clips. Muted until the first user gesture (browser policy). */

(function (global) {
  'use strict';

  var ctx = null;
  var enabled = true;
  /* Separate from sound on purpose: they are different senses, and a
     phone on a desk wants the opposite settings to one in a pocket. */
  var haptics = true;

  function ac() {
    if (!ctx) {
      var Ctor = global.AudioContext || global.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* One blip: freq sweep + fast decay. `delay` is in seconds and is
     scheduled on the audio clock, so a two-note figure stays in time
     even when the main thread is busy laying out a card. */
  function blip(from, to, dur, type, gain, delay) {
    if (!enabled) return;
    var c = ac();
    if (!c) return;
    var t0 = c.currentTime + (delay || 0);
    var osc = c.createOscillator();
    var amp = c.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    amp.gain.setValueAtTime(gain == null ? 0.06 : gain, t0);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  /* Recorded clips. Fetched and decoded on the first touch, since the
     audio context cannot start before one. Until a clip is ready — or if
     it never loads — the synth version plays instead. */
  var CLIPS = { wrong: 'assets/sfx/wrong.mp3', select: 'assets/sfx/select.mp3' };
  var buffers = {};
  var loading = false;

  function loadClips() {
    if (loading || !global.fetch) return;
    loading = true;
    var c = ac();
    if (!c) return;
    Object.keys(CLIPS).forEach(function (name) {
      fetch(CLIPS[name])
        .then(function (r) { return r.arrayBuffer(); })
        .then(function (data) {
          /* The callback form, for Safari versions without the promise. */
          c.decodeAudioData(data, function (buf) { buffers[name] = buf; }, function () {});
        })
        .catch(function () { /* offline or missing: the synth covers it */ });
    });
  }
  global.addEventListener('pointerdown', loadClips, { once: true });

  /* Returns false when the clip is not ready, so the caller can fall back. */
  function clip(name, gain) {
    if (!enabled) return true;
    var c = ac();
    var buf = buffers[name];
    if (!c || !buf) return false;
    var src = c.createBufferSource();
    var amp = c.createGain();
    src.buffer = buf;
    amp.gain.value = gain;
    src.connect(amp).connect(c.destination);
    src.start();
    return true;
  }

  function buzz(ms) {
    if (!haptics) return;
    if (global.navigator && navigator.vibrate) navigator.vibrate(ms);
  }

  global.Sfx = {
    flip:    function () { blip(320, 620, 0.09, 'triangle', 0.05); buzz(8); },
    tick:    function () { blip(880, 880, 0.03, 'square', 0.03); },
    /* Choosing something that is not yet an answer: a box, an arrow, a
       side, a key. A recorded click, with the tick as its fallback. */
    select:  function () { if (!clip('select', 0.5)) blip(880, 880, 0.03, 'square', 0.03); },
    /* A finger landing on a button: softer than a tick, and felt. */
    press:   function () { blip(660, 560, 0.025, 'triangle', 0.035); buzz(6); },
    /* A swipe has passed the point where letting go would commit. The
       card itself doesn't move, so this is the only signal that the
       gesture has taken hold. */
    arm:     function () { blip(1040, 1040, 0.025, 'square', 0.025); buzz(12); },
    right:   function () { blip(520, 990, 0.12, 'triangle', 0.07); buzz(14); },
    /* Some of it landed. A fall that stops rather than resolving — it
       should not be mistakable for either of its neighbours. */
    partial: function () {
      blip(700, 700, 0.075, 'triangle', 0.05);
      blip(560, 560, 0.11,  'triangle', 0.05, 0.075);
      buzz(10);
    },
    /* A recorded clip, played well under full volume: it peaks near
       0 dB while the synth sounds sit around -25. */
    wrong:   function () {
      if (!clip('wrong', 0.35)) blip(200, 120, 0.13, 'sawtooth', 0.05);
      buzz(20);
    },
    /* Transport, not verdict: you moved the session on. Flat pitch and
       the quietest thing in the app apart from a tick, because it is
       confirming input rather than judging it. */
    advance: function () { blip(320, 320, 0.03, 'triangle', 0.04); buzz(6); },
    streak:  function (n) { blip(440 + n * 60, 1200 + n * 60, 0.16, 'square', 0.06); buzz(22); },
    done:    function () { blip(392, 784, 0.35, 'triangle', 0.08); buzz([20, 60, 20, 60, 40]); },
    setEnabled: function (v) { enabled = !!v; },
    isEnabled:  function () { return enabled; },
    setHaptics: function (v) { haptics = !!v; },
    hasHaptics: function () { return !!(global.navigator && navigator.vibrate); }
  };
})(window);
