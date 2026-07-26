# MYFLASH

Fullscreen flashcards with bold type, randomized themes, and varied inputs.

Every card is a full-screen poster: one huge word set in a random display
face, on a random palette, over a generated backdrop, arriving with a random
animation. What it asks of you depends on the card: reveal, multiple choice,
true/false, a slider, a trend panel, a sort, a sequence, or a match.

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

A card's **type** decides what it asks, and each type has exactly one
behaviour — content drives the format. The variety comes from the theme
layer, which reshuffles palette, face, backdrop and entrance every render.

| Type | Shape | Interaction |
|---|---|---|
| `recall` | `{ q, a, why? }` | tap anywhere to reveal, then swipe to grade |
| `mcq` | `{ q, a, distractors[] }` | tap one; grid or list, decided by option length |
| `multi` | `{ q, answers[], distractors[], why? }` | select all that apply, swipe right to submit |
| `truefalse` | `{ q, a:bool, why }` | two buttons, explanation on reveal |
| `number` | `{ q, value, unit, tolerance, step? }` | drag anywhere to dial a value |
| `number` | `{ q, low, high, unit, step? }` | dial to any value inside the band |
| `trend` | `{ q, items:[{label, dir}] }` | mark each row ↑ / — / ↓ |
| `bucket` | `{ q, bins[], items:[{label, bin}] }` | swipe each item left or right into a running list |
| `order` | `{ q, steps[] }` | tap phrases into sequence |
| `match` | `{ q, pairs:[{left, right}] }` | link two columns, four pairs |

### The recall card

One card, one behaviour — no random rotation between presentations.

Tap anywhere to reveal. The flipper is a clipped viewport holding two faces,
and the reveal is a **crossfade with a short rise** — the question fades out
as it lifts, the answer fades in behind it, both on one 200ms curve. One
motion, every time: a reveal answers a tap, so it has to feel predictable.

Opacity is what hides the waiting answer, since an 18% offset would otherwise
leave it in view. The flipper clips so the incoming face can't bleed past the
viewport mid-transition.

**The controls are sequenced behind it.** The explanation and the swipe bar
animate in at a 180ms delay, so the answer lands before anything else moves.
Firing them together was the same clutter this redesign set out to remove,
just smaller. The kicker crossfades over 130ms rather than snapping — it was
the last hard cut on an otherwise eased card.

Entrance animations are scoped to `.face-front` for the same reason. A
question's entrance is ambient, so randomising it is fine — but the answer
must never replay whichever entrance the card happened to draw, or the
reveal looks different every time and trails past the transition it
belongs to.

An optional `why` appears **before** grading, since grading advances to the
next card. Short explanations (≤ 140 chars) render inline; longer ones fold
behind a `WHY?` toggle so they can't squeeze the answer off screen.

Grading is a swipe — left for missed, right for got it. The card follows your
finger and flies off in the direction you sent it. The `MISSED` / `GOT IT`
labels either side are real buttons, so the card still works by tap and by
keyboard while the gesture stays discoverable; whichever side you're dragging
toward lights up on the way. Drags lock to an axis on first movement, so
scrolling a long explanation never grades the card by accident.

`dir` is `'up' | 'down' | 'same'`. Steps and pairs are stored in the correct
order and shuffled at render. Any card may carry an optional `ref` for its
source citation.

Keyboard: `Space` / `Enter` reveal · `1`–`4` pick an option or bin ·
`←`/`→` grade · `Esc` quit.

### The number card

No track. **The whole card is the control** — drag up to raise, down to
lower. Horizontal sliders are awkward one-handed on a phone, and a
full-screen vertical drag has far more travel than any track could.

Range cards ask for a single number too: "a normal serum sodium" is answered
by any value inside the band, which is a truer question than dialling both
ends of it.

**Scale bounds where the derived one is silly.** A value card otherwise
derives `[0, value × 2.5]`, which is meaningless for a quantity that never
approaches zero — a body temperature of 37 got a 0–92.5 scale and 925 steps.
`min` / `max` override it: temperature runs 33–42, blood volume 2000–8000.

**Step scales per question.** `step` is authored where it matters —
`10000` for a platelet count, `100` for blood volume, `0.1` for a 1 mg dose.
Left out, it derives from the scale: aim for ~80 steps, round to 1/2/5 ×
10ⁿ so the increments are numbers people think in, and floor at 1 for
integer questions so they never ask for fractions.

Both drag gestures take **pointer capture** on `pointerdown`. Without it a
drag ends the moment the pointer leaves the card — and the HUD strip is a
sibling of the card, not a descendant, so dragging up into it fired
`pointerleave` and killed the gesture. That is why decreasing a value used
to work better if you started near the top: you simply had further to go
before crossing an edge. `lostpointercapture` replaces `pointerleave` as the
end signal.

Selection is off across `#app` rather than only while dragging. Switching it
off once a drag has started is already too late — the browser has begun
selecting, and on a card made of huge text that fights the gesture.

Drag sensitivity is deliberately unhurried — a full sweep takes roughly
1000px, clamped to 10–56px per step. Landing on one specific number should
be easy, so a coarse scale takes a couple of drags rather than a flick. `tools/` aside, the derivation is worth checking after
editing any number card: every answer must be reachable on the step grid,
and the dial must not *start* on a correct value. For range cards the
scale's midpoint is the answer, so the dial opens a quarter of the way up
and steps away if it still lands inside the band.

**Nothing on this card is ever added or removed.** Every slot — the "you
said" line, the track, the hint, CHECK — exists from mount and is only
hidden. Removing an element shifts every line below it, which is jarring on
a card whose whole point is one number holding still. CHECK is
`visibility: hidden` rather than absent in submit-on-release mode too, so
the layout matches between the two modes.

**The reveal.** Right: the number turns accent and the card advances in
700ms. Nothing else appears — you just produced that number, so showing it
back is noise.

Wrong: your answer demotes to a small `you said 39.0` line and the correct
value crossfades into the hero slot. There is no strikethrough; the label
and the size difference already say your value has been superseded.

**A gesture card must silence its own scroller.** `touch-action: none` on
the card is not enough: `.mode-area` is a scroll container, and a scroll
container ignores an ancestor's `touch-action`. The browser therefore
claimed vertical drags that *started inside* the mode area as scrolls and
fired `pointercancel` two moves in — a 150px drag moved one step instead of
seven, which reads as the number simply not responding to your finger.
`enableDial` and `enableSwipe` both tag the card `is-gesture`, and the CSS
sets `touch-action: none` on the mode area as well, re-enabling `pan-y` on
`.why-body` since that is the one thing inside a card that must still
scroll.

The question is capped to 40vh on these cards (`data-qsize="compact"`). The
value is the interaction and the question only the prompt — but capped too
hard the question becomes unreadable, so this is a balance rather than a
demotion.

### DIAL LAB

Eight `number` cards and nothing else, for testing the dial. Covers steps
from `0.1` to `10000`, both card shapes (a band you can land anywhere
inside, and an exact value with a tolerance), and both derived and authored
scale bounds.

Worth re-running the scale check after editing any number card: every answer
must be reachable on the step grid, the dial must not *open* on a correct
value, and the step count wants to stay in roughly the 8–150 band. A card
can satisfy the first two and still be unusable if its scale is absurdly
long — that is how the 925-step temperature card slipped through.

### REVEAL LAB

A built-in deck of nothing but `recall` cards, for judging the reveal motion
without other formats interrupting. Fifteen cards covering the cases that
stress it: short-to-short, a long answer under a short question, a long
question over a short answer, three explanations (one long enough to fold).

Delete the deck from `js/decks.js` when it has served its purpose.

## Settings

Stored in `localStorage` under `myflash.prefs.v1`, with defaults in
`Store.SETTING_DEFAULTS`. Anything not listed there is not a setting —
`setSetting` ignores unknown keys — and every default matches the previous
behaviour, so an empty store behaves exactly as before.

**Submit on release** (off by default). Number cards answer the instant you
lift your finger instead of waiting for CHECK.

A release that changed nothing never submits, so a stray tap is harmless.
CHECK stays on the card as a fallback.

This originally had a ~420ms cancel window so a mid-drag re-grip wouldn't
answer for you — a full sweep is around 1000px on a shorter screen, so
letting go partway seemed likely. In practice it isn't, and the delay was
just latency.

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
~340ms except ambient backdrop drift.
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

**Text fitting measures `getBoundingClientRect().height`, not
`scrollHeight`.** Two reasons, both load-bearing now that the flipper clips.
The rect includes the element's *own* transform, so the `stretch`
treatment's `scaleY(1.22)` is accounted for — sizing a stretched block by
its untransformed height would lose its top and bottom to the clip. And the
rect *excludes* scrollable overflow, which matters because `line-height:
.92` lets descenders spill past their line boxes by a constant ~8px. That
spill is not clipping, and measuring it would shrink type that fits fine —
it also produced a long run of phantom overflow reports before the metric
was corrected. An 8px `pad` guards the real clip edge.

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
`recall` cards (without explanations). Richer types are authored in `js/decks.js` for now; a
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
