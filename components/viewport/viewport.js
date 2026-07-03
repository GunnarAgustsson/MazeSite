/**
 * viewport.js — 3×3 rolling tile viewport.
 */

import { AppState }                   from '../../js/state.js';
import { buildBackground, getTileType } from '../tiles/tile-utils.js';

let outer    = null;
let grid     = null;
let tiles    = [];
let playerEl = null;

const DIR_OFFSET = {
  n: { dtx: 0,  dty: -1 },
  s: { dtx: 0,  dty:  1 },
  e: { dtx: 1,  dty:  0 },
  w: { dtx: -1, dty:  0 },
};

export function init() {
  outer = document.getElementById('viewport-outer');
  grid  = document.getElementById('viewport-grid');
  tiles = Array.from(grid.querySelectorAll('.tile'));

  if (!playerEl) {
    playerEl = document.createElement('div');
    playerEl.id = 'player';
    playerEl.style.setProperty('--player-rot', '0deg');
  }
}

/**
 * Fill the 3×3 grid around (row, col) with maze tiles.
 * @param {number} row
 * @param {number} col
 */
export function buildViewport(row, col) {
  const maze = AppState.maze;
  const offsets = [
    [-1,-1],[-1,0],[-1, 1],
    [ 0,-1],[ 0,0],[ 0, 1],
    [ 1,-1],[ 1,0],[ 1, 1],
  ];

  offsets.forEach(([dr, dc], i) => {
    const r  = row + dr;
    const c  = col + dc;
    const el = tiles[i];

    el.style.background = '';
    el.classList.remove('win-tile');
    el.dataset.tileType = '';

    const oob  = !maze || r < 0 || r >= maze.length || c < 0 || c >= maze[0].length;
    const cell = oob ? null : maze[r][c];

    el.style.background = buildBackground(cell, oob);
    el.dataset.tileType = oob ? 'wall' : getTileType(cell);

    if (cell?.win) el.classList.add('win-tile');
  });

  tiles[4].appendChild(playerEl);
  _setTranslate(1, 1, false);
}

/**
 * Animate the grid sliding in a direction.
 * @param {'n'|'s'|'e'|'w'} dir
 * @returns {Promise<void>}
 */
export function animateTo(dir) {
  return new Promise(resolve => {
    const { dtx, dty } = DIR_OFFSET[dir];
    _setTranslate(1 + dtx, 1 + dty, true);

    function onEnd(e) {
      if (e.target !== grid) return;
      grid.removeEventListener('transitionend', onEnd);
      resolve();
    }
    grid.addEventListener('transitionend', onEnd);
  });
}

export function resetToCenter() {
  grid.classList.remove('grid-animating');
  _setTranslate(1, 1, false);
  void grid.offsetHeight;
}

/**
 * Animate the player arrow toward the wall and back (blocked move feedback).
 * @param {'n'|'s'|'e'|'w'} dir
 */
export function bump(dir) {
  if (!playerEl) return;
  const ANIM = {
    n: 'bump-n var(--bump-duration) ease-out',
    s: 'bump-s var(--bump-duration) ease-out',
    e: 'bump-e var(--bump-duration) ease-out',
    w: 'bump-w var(--bump-duration) ease-out',
  };
  playerEl.style.animation = ANIM[dir];
  playerEl.addEventListener('animationend', () => {
    playerEl.style.animation = '';
  }, { once: true });
}

/**
 * Rotate the player arrow to face a given direction.
 * @param {'n'|'s'|'e'|'w'} dir
 */
export function setPlayerDir(dir) {
  if (!playerEl) return;
  const ROT = { e: '0deg', s: '90deg', w: '180deg', n: '270deg' };
  playerEl.style.setProperty('--player-rot', ROT[dir]);
}

function _setTranslate(tx, ty, animate) {
  if (animate) {
    grid.classList.add('grid-animating');
  } else {
    grid.classList.remove('grid-animating');
  }
  grid.style.setProperty('--tx', tx);
  grid.style.setProperty('--ty', ty);
}
