# MYFLASH

Fullscreen flashcards with bold type, randomized themes, and varied inputs.

Every card is a full-screen poster: one huge word set in a random display
face, on a random palette, over a generated backdrop, arriving with a random
animation. And you never know how it will ask you to answer — five input
modes rotate underneath the question.

No build step, no dependencies, no framework. Open `index.html` and it runs.

## Run it

```bash
# any static server works — this one needs no install
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly off disk works too (all scripts are classic
`<script>` tags, not ES modules, specifically so `file://` doesn't break).

On Android: open in Chrome → **Add to Home Screen**. The manifest requests
fullscreen portrait, so it launches with no browser chrome.

## Card types

A card's **type** decides what it asks. A **presentation** decides how it
asks. Most types have exactly one presentation; `recall` has four, which is
where the original "never the same twice" variety now lives.

| Type | Shape | Interaction |
|---|---|---|
| `recall` | `{ q, a }` | flip · hold-to-reveal · type it · unscramble |
| `mcq` | `{ q, a, distractors[] }` | four options, authored distractors |
| `truefalse` | `{ q, a:bool, why }` | two buttons, explanation on reveal |
| `number` | `{ q, value, unit, tolerance }` | slider, giant readout |
| `number` | `{ q, low, high, unit }` | two sliders for a normal range |
| `trend` | `{ q, items:[{label, dir}] }` | mark each row ↑ / — / ↓ |
| `bucket` | `{ q, bins[], items:[{label, bin}] }` | one big item at a time, tap its bin |
| `order` | `{ q, steps[] }` | tap phrases into sequence |
| `match` | `{ q, pairs:[{left, right}] }` | link two columns, four pairs |

`dir` is `'up' | 'down' | 'same'`. Steps and pairs are stored in the correct
order and shuffled at render. Any card may carry an optional `ref` for its
source citation.

Keyboard: `Space` flip/hold · `1`–`4` pick an option or bin · `←`/`→` grade ·
`Enter` submit · `Esc` quit.

## Scoring

Multi-row types award **partial credit** — three of four trend rows scores
0.75, and it counts toward session accuracy. But only a clean sweep marks the
card resolved, and anything short of one requeues it later in the session.
Match scores `1 − misses/pairs`, since with four pairs the last one is free.

## The look engine

`js/theme.js` composes each card from four axes:

- **32 palettes** — hand-paired `bg` / `ink` / `acc`, not random hues, and
  contrast-verified rather than eyeballed (see below).
- **14 display faces** — each carries its own tracking and caps preference,
  because a face that needs `-.045em` at 200px looks broken at `0`.
- **54 backdrops** across four tiers — see below.
- **8 entrances** — four stagger per letter (cascade, drop, skew, pop), four
  animate the whole line (slam, blur, wipe, roll).

### Motion

Short, eased, no overshoot, no oscillation. Nothing animates longer than
~340ms except the deliberate card flip (680ms) and ambient backdrop drift.
Easing is a plain ease-out; the springy `cubic-bezier(.34,1.56,.64,1)`
overshoots its target and is what made the old motion read as bouncy.

**Stagger is capped as a span, not a step.** Per-letter entrances delay each
letter by `index × stagger`, so a fixed 34ms step meant a 45-letter question
took 2.5s to finish arriving — almost all of it accumulated delay rather than
animation. `app.js` recomputes `--stagger` per card as
`min(base, 240ms / letterCount)`, which holds the worst case at ~640ms while
short questions keep their original ripple.

**Wrong answers dim and settle** — opacity plus a `scale(.98)`, no shake.
Colour already says "wrong"; oscillation just adds noise on top of
information you have already received.

Entrance selectors are scoped to `.face .letter` rather than `.letter`, or
revealed answers would animate twice: once from their own reveal and again
from the card's entrance rule.

### Backdrops

Flat by design: every colour stop is hard, so there are no soft gradients,
no glow, and nothing that fakes depth. Variety comes from colour and
composition rather than texture density.

Everything is flat and two-tone; the tiers describe **loudness**, not style.

| Tier | Share | What it is |
|---|---|---|
| **flat** | ~40% | Compositions, not patterns — splits, wedges, discs, bands, SVG shapes, clip-path forms, camo, collage |
| **quiet** | ~26% | Sparse repeats — wavy lines, thin diagonals, grain, half-drop dots, dashes, wide stripes |
| **mid** | ~25% | The same families tighter — dense waves, cross-hatch, checkerboard, scallops, zigzag, terrazzo, bricks, triangles |
| **loud** | ~10% | Tight stripes, rays, concentric rings, crosses, halftone |

Tier also decides layout: `flat` backdrops render against the true card box
with `no-repeat`, everything else gets a 20% oversize and tiles.

The flat tier is built three ways:

**CSS gradients** with hard stops — splits, corner wedges, discs, bands,
stacked rules. Cheapest, no DOM.

**Inline SVG as a data-URI** — in two forms. `svgUrl` stretches a full-bleed
composition to the card (ridges, waves, arcs, torn edges, shards, staircases,
crescents, camo); `svgTile` keeps its own viewBox and does *not* stretch, so
`background-size` scales a seamless repeat (wavy lines, scallops, zigzag,
bricks, triangles, dashes, half-drop dots, grain, terrazzo). Grain and
terrazzo scatter via a seeded LCG rather than `Math.random`, so a tile looks
random but stays identical across renders.

`encodeURIComponent` is mandatory in both: an unescaped `#` in a colour
terminates the URL and the background silently disappears.

**Positioned layers** — `clip-path` forms (ribbon, arrow block, notched and
angled slabs) and **collage**, a generator rather than a fixed look. Collage
places 2–4 primitives (disc, ring, triangle, wedge, bar) into top/bottom/left
/right zones by rule: each bleeds off an edge, and none lands in the vertical
middle where the question sits. It carries the heaviest single weight because
it is a family, not one design.

One trap worth knowing if you extend it: a square layer's width is a share of
card *width* while its `top`/`bottom` offset is a share of card *height*.
Bleeding by a fraction of the width pushes shapes almost entirely off a
portrait card, so `shapeIn` converts between the two.

Motion is slow enough to be felt rather than watched: drifts run 105–120s
over ~100px of travel, the ray spin takes 300s, and the "breathe" scale tops
out at 1.035. Roughly half of all cards have no motion at all.

Flat backdrops render against the true card box; tiled ones get a 20%
oversize so drift never exposes an edge.

### Verifying contrast

```bash
node tools/check-contrast.js   # exits non-zero if any palette fails
open tools/backdrops.html      # contact sheet of all 26 backdrops
```

`ink` targets 4.5:1 against its background since it's used for small UI as
well as display type; `acc` targets 3:1 because it only ever appears large.
All 32 palettes currently pass, 24 of them at AAA.

Randomness is bounded on purpose. Palette, font, backdrop, and entrance each
refuse to repeat back-to-back — consecutive repeats are what make shuffled
design read as broken rather than varied. Text treatments (outline, hard
shadow, accent words, vertical stretch) are weighted so plain wins most of
the time; every card shouting is the same as no card shouting.

Question text is binary-searched to the largest size that fits its box
(`js/text.js`), re-run once webfonts land. Length buckets guess wrong the
moment a face is unusually wide.

## Structure

```
index.html                 four screens: home, session, summary, editor
css/base.css               reset, chrome around the cards
css/themes.css             card surface, treatments, per-mode UI
css/animations.css         every keyframe + entrance dispatch
js/theme.js                palettes, faces, backdrops, entrances
js/text.js                 letter splitting, fit-to-box, fuzzy matching
js/modes.js                the five input modes
js/decks.js                built-in decks
js/store.js                localStorage decks + per-card stats
js/audio.js                WebAudio blips, no asset files
js/app.js                  screens and the session engine
tools/check-contrast.js    palette contrast gate
tools/backdrops.html       backdrop contact sheet
```

## Session logic

Cards are shuffled; a missed card is requeued three positions back so it
comes around again in the same session. A card counts as resolved once
answered correctly, and the HUD tracks resolved-vs-deck. Per-card stats
persist in `localStorage`; three correct answers in a row marks a card
learned, which is what the deck meters on the home screen show.

## Custom decks

**+ New deck** takes one card per line as `front | back`, which produces
`recall` cards. Richer types are authored in `js/decks.js` for now; a
paste-JSON importer with validation is the next step, aimed at decks
generated from source material.

Sample decks are standard teaching material for testing the formats. Treat
them as a study aid, not a clinical reference.

## Accessibility notes

`prefers-reduced-motion` collapses every animation and stops backdrop drift.
The HUD takes its colour from the current card's ink, so it stays legible on
light and dark palettes alike. Audio is opt-out via `Sfx.setEnabled(false)`
and vibration is used only where the platform supports it.

## Not built yet

Swipe-to-grade (should replace the MISSED/GOT IT buttons everywhere),
paste-JSON import with validation, rapid-fire true/false as a timed session
mode, spaced repetition across sessions, and a service worker for offline
use. Timeline placement and next-step chains are deliberately parked.
