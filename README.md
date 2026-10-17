# MYFLASH

Fullscreen flashcards for family medicine board prep, with varied inputs.

Every card uses one plain look: Nunito on white, with green for right
answers, red for wrong ones and blue for the current pick. What a card asks
of you depends on its type: reveal, multiple choice, true/false, a number
keypad, a trend panel, a sort, or a match.

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
behaviour — content drives the format.

| Type | Shape | Interaction |
|---|---|---|
| `recall` | `{ q, a, why? }` | tap anywhere to reveal, then swipe to grade |
| `mcq` | `{ q, a, distractors[] }` | tap one; grid or list, decided by option length |
| `multi` | `{ q, answers[], distractors[], why? }` | select all that apply, swipe right to submit |
| `truefalse` | `{ q, a:bool, why? }` | swipe left for false, right for true |
| `number` | `{ q, value, unit, tolerance, step? }` | type it on the keypad (or dial it, with the slider setting) |
| `number` | `{ q, low, high, unit, step? }` | any value inside the band counts |
| `trend` | `{ q, items:[{label, dir}] }` | mark each row ↑ / — / ↓, swipe right to submit |
| `bucket` | `{ q, bins[], items:[{label, bin}] }` | swipe each item left or right into a running list |
| `match` | `{ q, pairs:[{left, right}] }` | link two columns; fumbled pairs stay marked |

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

`dir` is `'up' | 'down' | 'same'`. Pairs are stored matched and shuffled at
render. Any card may carry an optional `ref` for its
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

## Text sizing

Question text is binary-searched to the largest size that fits its box, up
to a reading-size cap (`js/text.js`), and re-run once the webfont lands.

## Structure

```
index.html                 screens: home, settings, session, summary
css/base.css               color scheme, reset, chrome around the cards
css/themes.css             card surface and per-mode UI
css/animations.css         keyframes
js/text.js                 fit-to-box, fuzzy matching, shuffle
js/modes.js                the card types
js/decks.js                built-in decks
js/store.js                localStorage decks + per-card stats
js/audio.js                WebAudio blips, no asset files
js/app.js                  screens and the session engine
tools/check.html           card-writing prompt and deck checker
tools/validate.js          the checker's rules
```

## Session logic

Cards are shuffled; a missed card is requeued three positions back so it
comes around again in the same session. A card counts as resolved once
answered correctly, and the HUD tracks resolved-vs-deck. Per-card stats
persist in `localStorage`; three correct answers in a row marks a card
learned, which is what the deck meters on the home screen show.

## Custom decks

Decks are generated by another AI using the prompt in `tools/check.html`,
checked there, and installed into this browser's `localStorage`. They show
up under Settings → Your decks, where they can be deleted.

Sample decks are standard teaching material for testing the formats. Treat
them as a study aid, not a clinical reference.

## Accessibility notes

`prefers-reduced-motion` collapses every animation. Sound and vibration are separate switches in
Settings, since they are different senses; where the browser exposes no
vibration API the switch says so rather than sitting there inert.

Sound is split by role. A verdict — right, partial, wrong, streak — plays the
moment an answer appears. Transport, meaning the tap that moves the session
on, gets its own flat, quiet click that judges nothing. Ticks confirm state
changes that carry no verdict of their own, like selecting a checkbox or
stepping the dial.

## Not built yet

Backup and restore of progress, rapid-fire true/false as a timed session
mode, a cross-topic review session, and a service worker for offline
use. Timeline placement and next-step chains are deliberately parked.
