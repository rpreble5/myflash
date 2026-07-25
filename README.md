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

## Input modes

The mode is picked per card, weighted, never the same twice in a row, and
each mode declares its own eligibility so you're never asked to unscramble a
thirty-letter phrase.

| Mode | Interaction | Eligible when |
|---|---|---|
| **Tap to flip** | Tap anywhere, 3D flip, self-grade | always |
| **Hold to reveal** | Press and hold to un-blur the answer | always |
| **Type it** | Type the answer, fuzzy-matched | answer ≤ 18 chars |
| **Pick one** | Four options, distractors drawn from the deck | deck ≥ 4 cards |
| **Unscramble** | Tap letter tiles into order | answer is 3–10 letters |

Keyboard: `Space` flip/hold · `1`–`4` pick an option · `←`/`→` grade ·
`Enter` submit · `Esc` quit.

## The look engine

`js/theme.js` composes each card from four axes:

- **14 palettes** — hand-paired `bg` / `ink` / `acc`, not random hues. Ink is
  chosen against its own background so contrast never depends on luck.
- **14 display faces** — each carries its own tracking and caps preference,
  because a face that needs `-.045em` at 200px looks broken at `0`.
- **12 backdrops** — CSS-generated stripes, halftone, rays, rings, blobs…
  drawn in the palette's own accent at low alpha and slowly drifting.
- **9 entrances** — five stagger per letter (cascade, drop, flip, skew, pop),
  four animate the whole line (slam, blur, wipe, roll).

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
```

## Session logic

Cards are shuffled; a missed card is requeued three positions back so it
comes around again in the same session. A card counts as resolved once
answered correctly, and the HUD tracks resolved-vs-deck. Per-card stats
persist in `localStorage`; three correct answers in a row marks a card
learned, which is what the deck meters on the home screen show.

## Custom decks

**+ New deck** takes one card per line as `front | back`. Stored in
`localStorage` under `myflash.decks.v1`.

## Accessibility notes

`prefers-reduced-motion` collapses every animation and stops backdrop drift.
The HUD takes its colour from the current card's ink, so it stays legible on
light and dark palettes alike. Audio is opt-out via `Sfx.setEnabled(false)`
and vibration is used only where the platform supports it.

## Not built yet

Spaced repetition scheduling across sessions, image and audio cards,
speech-input mode, deck import/export, and a service worker for offline use.
