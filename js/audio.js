/* audio.js — tiny WebAudio synth. No files to load, no licensing,
   ~30 lines. Muted until the first user gesture (browser policy). */

(function (global) {
  'use strict';

  var ctx = null;
  var enabled = true;

  function ac() {
    if (!ctx) {
      var Ctor = global.AudioContext || global.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* One blip: freq sweep + fast decay. */
  function blip(from, to, dur, type, gain) {
    if (!enabled) return;
    var c = ac();
    if (!c) return;
    var osc = c.createOscillator();
    var amp = c.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(from, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(to, c.currentTime + dur);
    amp.gain.setValueAtTime(gain == null ? 0.06 : gain, c.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    osc.connect(amp).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + dur + 0.02);
  }

  function buzz(ms) {
    if (global.navigator && navigator.vibrate) navigator.vibrate(ms);
  }

  global.Sfx = {
    flip:    function () { blip(320, 620, 0.09, 'triangle', 0.05); buzz(8); },
    tick:    function () { blip(880, 880, 0.03, 'square', 0.03); },
    right:   function () { blip(520, 990, 0.12, 'triangle', 0.07); buzz(14); },
    wrong:   function () { blip(220, 90, 0.22, 'sawtooth', 0.05); buzz([18, 40, 18]); },
    streak:  function (n) { blip(440 + n * 60, 1200 + n * 60, 0.16, 'square', 0.06); buzz(22); },
    done:    function () { blip(392, 784, 0.35, 'triangle', 0.08); buzz([20, 60, 20, 60, 40]); },
    setEnabled: function (v) { enabled = !!v; },
    isEnabled:  function () { return enabled; }
  };
})(window);
