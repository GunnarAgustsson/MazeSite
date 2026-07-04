/**
 * navigation.js — Movement logic and win detection.
 *
 * canMove(dir)  — returns true if the current cell has an open passage.
 * navigate(dir) — guard checks → animate → update state → rebuild viewport.
 * checkWin()    — called after each move; triggers endGame if on win tile.
 */

import { AppState }        from './state.js';
import * as viewport        from '../components/viewport/viewport.js';
import * as timer           from '../components/timer/timer.js';

// ---- Public API --------------------------------------------------------

/**
 * @param {'n'|'s'|'e'|'w'} dir
 * @returns {boolean}
 */
export function canMove(dir) {
  const { maze, pos } = AppState;
  if (!maze) return false;
  const cell = maze[pos.row]?.[pos.col];
  return cell ? !!cell[dir] : false;
}

/**
 * Attempt to move the player in dir.
 * Blocked moves trigger a bump animation.
 *
 * @param {'n'|'s'|'e'|'w'} dir
 */
export async function navigate(dir) {
  if (AppState.transitioning) return;
  if (AppState.screen !== 'game')  return;

  if (!canMove(dir)) {
    viewport.bump(dir);
    return;
  }

  AppState.transitioning = true;

  /* Slide the viewport */
  await viewport.animateTo(dir);

  /* Update player position */
  const delta = { n: [-1, 0], s: [1, 0], e: [0, 1], w: [0, -1] };
  const [dr, dc] = delta[dir];
  AppState.pos.row += dr;
  AppState.pos.col += dc;

  /* Rebuild tile content then snap grid back to centre */
  viewport.buildViewport(AppState.pos.row, AppState.pos.col);
  viewport.resetToCenter();

  AppState.transitioning = false;

  checkWin();
}

/**
 * Check whether the player has reached the win tile.
 * If so, stop the timer and dispatch 'maze:win' for app.js to handle.
 */
export function checkWin() {
  const { maze, pos } = AppState;
  if (!maze) return;
  const cell = maze[pos.row]?.[pos.col];
  if (cell?.win) {
    const elapsed = timer.getElapsedMs();
    window.dispatchEvent(new CustomEvent('maze:win', { detail: { elapsedMs: elapsed } }));
  }
}
