/**
 * navigation.js — Movement logic and win detection.
 */

import { AppState }  from './state.js';
import * as viewport from '../components/viewport/viewport.js';
import * as timer    from '../components/timer/timer.js';

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
  await viewport.animateTo(dir);

  const delta = { n: [-1, 0], s: [1, 0], e: [0, 1], w: [0, -1] };
  const [dr, dc] = delta[dir];
  AppState.pos.row += dr;
  AppState.pos.col += dc;

  viewport.setPlayerDir(dir);
  viewport.buildViewport(AppState.pos.row, AppState.pos.col);
  viewport.resetToCenter();

  AppState.transitioning = false;
  checkWin();
}

/** Dispatch 'maze:win' if the player is on the win tile. */
export function checkWin() {
  const { maze, pos } = AppState;
  if (!maze) return;
  const cell = maze[pos.row]?.[pos.col];
  if (cell?.win) {
    const elapsed = timer.getElapsedMs();
    window.dispatchEvent(new CustomEvent('maze:win', { detail: { elapsedMs: elapsed } }));
  }
}
