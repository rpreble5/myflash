/* Verify every palette meets its contrast targets.
   Run: node tools/check-contrast.js

   ink is body-weight display text at very large sizes but is also used for
   small UI (kicker, row labels), so it targets the WCAG AA normal-text bar
   of 4.5:1 and we aim for 7:1. acc only ever appears large — answers,
   shapes, big buttons — so 3:1 is the real floor there.                   */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'theme.js'), 'utf8');
const block = src.slice(src.indexOf('var PALETTES'), src.indexOf('/* Per-palette derived'));

const PALETTES = [...block.matchAll(
  /name:\s*'([^']+)',\s*bg:\s*'(#[0-9A-Fa-f]{6})',\s*ink:\s*'(#[0-9A-Fa-f]{6})',\s*acc:\s*'(#[0-9A-Fa-f]{6})'/g
)].map(m => ({ name: m[1], bg: m[2], ink: m[3], acc: m[4] }));

const chan = v => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

const lum = hex => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * chan((n >> 16) & 255) + 0.7152 * chan((n >> 8) & 255) + 0.0722 * chan(n & 255);
};

const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const INK_MIN = 4.5;
const ACC_MIN = 3.0;

let failures = 0;
const rows = PALETTES.map(p => {
  const ink = ratio(p.ink, p.bg);
  const acc = ratio(p.acc, p.bg);
  const bad = ink < INK_MIN || acc < ACC_MIN;
  if (bad) failures++;
  return { name: p.name, ink: ink.toFixed(2), acc: acc.toFixed(2), ok: bad ? 'FAIL' : (ink >= 7 ? 'AAA' : 'AA') };
});

const pad = (s, n) => String(s).padEnd(n);
console.log(pad('palette', 13) + pad('ink:bg', 9) + pad('acc:bg', 9) + 'grade');
console.log('-'.repeat(38));
for (const r of rows) console.log(pad(r.name, 13) + pad(r.ink, 9) + pad(r.acc, 9) + r.ok);

console.log(`\n${PALETTES.length} palettes, ${failures} failing ` +
            `(ink >= ${INK_MIN}:1, acc >= ${ACC_MIN}:1)`);
process.exit(failures ? 1 : 0);
