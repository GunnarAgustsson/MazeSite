# AGENT.md — Dungeon Maze Project

## Overview
A dungeon-themed single-page maze game built with vanilla HTML/CSS/JS (ES modules,
no build step required).  The player navigates a randomly-generated 20×20 maze
using a 3×3 rolling viewport; the goal is to reach the bottom-right exit tile.

## Quick Start
Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
No server required — ES modules load fine via `file://` in most browsers,
or serve with any static file server.

## Code Conventions (summary — full details in `documents/conventions.md`)
- Max **120 characters** per line; max **300 lines** per file.
- ES module imports use relative paths with file extensions (`.js`).
- Utility CSS only; no inline styles except tile `background` (set by JS).
- CSS variable tokens defined in `css/style.css`; prefix utility classes in `css/utilities.css`.
- `AppState` in `js/state.js` is the single source of truth — no module-local state for app-level data.
- Comment only where clarification is genuinely needed.
- JS naming: `camelCase` functions/variables, `PascalCase` classes (none currently), `SCREAMING_SNAKE` constants.

## Document Index

| File | When to read |
|------|--------------|
| `documents/architecture.md`    | Understanding screen flow, module wiring, state shape |
| `documents/components.md`      | How tile rendering works, viewport rolling-window pattern |
| `documents/conventions.md`     | Line/file limits, naming rules, CSS prefix system |
| `documents/maze-generation.md` | Algorithm details, cell schema, start/end guarantees |

## Key Files

| Path | Role |
|------|------|
| `index.html`                          | HTML skeleton; loads all CSS then `js/app.js` |
| `css/style.css`                       | Design tokens (`:root`), global reset |
| `css/utilities.css`                   | Prefix utility classes |
| `js/state.js`                         | `AppState` + settings + leaderboard (localStorage) |
| `js/app.js`                           | Bootstrap, `showScreen`, `startGame`, `endGame`, `restartGame` |
| `js/maze-generator.js`                | `generateMaze(rows, cols)` — iterative DFS; start cell guaranteed open south+east |
| `js/navigation.js`                    | `canMove`, `navigate`, `checkWin` |
| `js/input.js`                         | Keyboard / wheel / touch handlers |
| `components/viewport/viewport.js`     | 3×3 rolling viewport (CSS transform) |
| `components/tiles/tile-utils.js`      | `getTileType`, `buildBackground` |
| `components/timer/timer.js`           | rAF-based game timer |
| `components/start-screen/start-screen.js` | Start screen + leaderboard rendering |
| `components/win-screen/win-screen.js` | Win screen display + score saving |
| `components/settings/settings.js`     | Settings panel, localStorage persistence |
