# Components

## Component Folder Pattern

```
components/
  <name>/
    <name>.js   ← logic + DOM wiring
    <name>.css  ← styles scoped to this component
```

## Tile Rendering Pipeline

1. `getTileType(cell)` — classifies cell into a type string.
2. `buildBackground(cell, isOOB)` — returns CSS multi-layer gradient background.
3. `viewport.buildViewport(row, col)` sets `el.style.background` and `el.dataset.tileType` on all 9 tile elements.
4. CSS selectors on `[data-tile-type]` drive decoration (torch flames, win glow).

## Background Position Fix

CSS `background-position` percentages use `offset = (container - image) * p%`.
Do NOT use `calc(30%)` for "30% from left". Use keyword positions:
- `center center` → centred square
- `center top` → corridor arm anchored to top edge
- `center bottom` → arm anchored to bottom edge
- `right center` / `left center` → east/west arms

## Viewport — 3×3 Rolling Window

`--tx` / `--ty` CSS vars (0–2) drive `translate(--tx * -100vw, --ty * -100vh)`.
Centre = 1,1. Moves shift by ±1, then `resetToCenter()` snaps back silently.

## Leaderboard

`saveScore(ms)` in `state.js` writes to `localStorage`.
`win-screen.show()` calls `saveScore` then dispatches `maze:score-saved`.
`start-screen.init()` listens for `maze:score-saved` and re-renders.
