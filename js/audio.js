/* audio.js — tiny WebAudio synth. No files to load, no licensing,
   ~30 lines. Muted until the first user gesture (browser policy). */

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

  function buzz(ms) {
    if (!haptics) return;
    if (global.navigator && navigator.vibrate) navigator.vibrate(ms);
  }

  global.Sfx = {
    flip:    function () { blip(320, 620, 0.09, 'triangle', 0.05); buzz(8); },
    tick:    function () { blip(880, 880, 0.03, 'square', 0.03); },
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
    /* Shorter and flatter than it was. The old 220ms plummet with a
       triple buzz was covering a wait — the card used to sweep away on a
       timer. Nothing is waiting now; the card just sits there. */
    wrong:   function () { blip(200, 120, 0.13, 'sawtooth', 0.05); buzz(20); },
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
