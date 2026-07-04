/**
 * viewport.js — 3×3 rolling tile viewport.
 *
 * Structure:
 *   #viewport-outer  (overflow:hidden, full screen)
 *     #viewport-grid (3×3 CSS grid, 300vw × 300vh, translated via --tx/--ty)
 *       .tile × 9    (each 100vw × 100vh)
 *
 * Grid cell indices (row-major):
 *   0 1 2
 *   3 4 5
 *   6 7 8
 *
 * --tx / --ty are integers in [0, 2]; the grid is translated so that the
 * desired cell is in the viewport centre.  During animation the grid shifts
 * one full tile in the move direction, then snaps silently back to centre.
 */

import { AppState }                   from '../../js/state.js';
import { buildBackground, getTileType } from '../tiles/tile-utils.js';

// ---- DOM references ----------------------------------------------------

let outer = null;   /** @type {HTMLElement} */
let grid  = null;   /** @type {HTMLElement} */
let tiles = [];     /** @type {HTMLElement[]} length 9 */

/** Player icon element rendered as a viewport overlay */
let playerEl = null;
const ROOM_THEME_CLASSES = ['theme-crypt', 'theme-moss', 'theme-ember', 'theme-ruin'];
const FLOOR_DECORATION_SPRITES = new Set(['moss', 'carpet', 'floor-cracks']);

// ---- Direction → grid offset mapping ----------------------------------

const DIR_OFFSET = {
  n: { dtx: 0,  dty: -1 },
  s: { dtx: 0,  dty:  1 },
  e: { dtx: 1,  dty:  0 },
  w: { dtx: -1, dty:  0 },
};

// ---- Public API --------------------------------------------------------

/** Create DOM structure and cache references.  Safe to call multiple times. */
export function init() {
  outer = document.getElementById('viewport-outer');
  grid  = document.getElementById('viewport-grid');
  tiles = Array.from(grid.querySelectorAll('.tile'));

  if (!playerEl) {
    playerEl = document.createElement('div');
    playerEl.id = 'player';
    const sprite = document.createElement('img');
    sprite.className = 'player-sprite';
    sprite.src = 'resources/sprites/player.svg';
    sprite.alt = '';
    sprite.setAttribute('aria-hidden', 'true');
    playerEl.appendChild(sprite);
  }

  if (outer && playerEl.parentElement !== outer) {
    outer.appendChild(playerEl);
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
    [-1, -1], [-1, 0], [-1,  1],
    [ 0, -1], [ 0, 0], [ 0,  1],
    [ 1, -1], [ 1, 0], [ 1,  1],
  ];

  offsets.forEach(([dr, dc], i) => {
    const r = row + dr;
    const c = col + dc;
    const el = tiles[i];

    /* Clear previous state */
    el.style.background = '';
    el.classList.remove('win-tile', ...ROOM_THEME_CLASSES);
    el.dataset.tileType = '';
    _clearDecorations(el);

    const oob = !maze || r < 0 || r >= maze.length || c < 0 || c >= maze[0].length;
    const cell = oob ? null : maze[r][c];

    el.style.background = buildBackground(cell, oob);
    el.dataset.tileType = oob ? 'wall' : getTileType(cell);

    if (cell?.roomTheme) {
      el.classList.add(`theme-${cell.roomTheme}`);
    }

    if (cell?.win) {
      el.classList.add('win-tile');
    }

    _renderDecorations(el, cell, oob);
  });

  /* Keep player fixed in viewport while the maze slides underneath */
  if (outer && playerEl.parentElement !== outer) {
    outer.appendChild(playerEl);
  }

  /* Always start centred */
  _setTranslate(1, 1, false);
}

/**
 * Animate the grid sliding in a direction.
 * The grid moves so the *next* tile slides to centre.
 *
 * @param {'n'|'s'|'e'|'w'} dir
 * @returns {Promise<void>}  Resolves when the CSS transition ends.
 */
export function animateTo(dir) {
  return new Promise(resolve => {
    const { dtx, dty } = DIR_OFFSET[dir];
    let resolved = false;

    /* Squash/stretch the player for the duration of the tile slide */
    if (playerEl) {
      playerEl.classList.add('is-moving');
      playerEl.addEventListener('animationend', () => {
        playerEl.classList.remove('is-moving');
      }, { once: true });
    }

    /* Target translate: 1 (centre) + delta */
    const tx = 1 + dtx;
    const ty = 1 + dty;

    _setTranslate(tx, ty, true);

    function onEnd(e) {
      if (e.target !== grid) return;
      if (resolved) return;
      resolved = true;
      grid.removeEventListener('transitionend', onEnd);
      clearTimeout(fallbackTimer);
      resolve();
    }
    grid.addEventListener('transitionend', onEnd);

    /* Safety net: if transitionend never fires (e.g. touch events cancel the
       transition mid-slide), resolve after a generous timeout so the game
       never gets permanently locked.                                          */
    const fallbackTimer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      grid.removeEventListener('transitionend', onEnd);
      resolve();
    }, 700);
  });
}

/**
 * Teleport grid silently back to centre (used after updating tile content).
 * Forces a reflow between removing and re-adding the animation class so that
 * no transition flash occurs.
 */
export function resetToCenter() {
  grid.classList.remove('grid-animating');
  _setTranslate(1, 1, false);
  /* Trigger reflow so the browser processes the class removal before we
     might re-add it on the next navigateFunc call.                        */
  void grid.offsetHeight; // eslint-disable-line no-void
}

/**
 * Play a bump animation when movement is blocked.
 * Animates #player toward the wall and back via inline style, leaving
 * --tx/--ty untouched so a valid move immediately after is never affected.
 * @param {'n'|'s'|'e'|'w'} dir
 */
export function bump(dir) {
  if (!playerEl) return;
  const ANIM = {
    n: `bump-n var(--bump-duration) ease-out`,
    s: `bump-s var(--bump-duration) ease-out`,
    e: `bump-e var(--bump-duration) ease-out`,
    w: `bump-w var(--bump-duration) ease-out`,
  };
  /* Override the float animation for the duration of the bump */
  playerEl.style.animation = ANIM[dir];
  playerEl.addEventListener('animationend', () => {
    playerEl.style.animation = '';
  }, { once: true });
}

// ---- Private helpers ---------------------------------------------------

/**
 * Set --tx and --ty CSS variables on the grid.
 * @param {number} tx  0–2 (column index)
 * @param {number} ty  0–2 (row index)
 * @param {boolean} animate  Whether to enable CSS transition
 */
function _setTranslate(tx, ty, animate) {
  if (animate) {
    grid.classList.add('grid-animating');
  } else {
    grid.classList.remove('grid-animating');
  }
  grid.style.setProperty('--tx', tx);
  grid.style.setProperty('--ty', ty);
}

/**
 * @param {HTMLElement} tile
 */
function _clearDecorations(tile) {
  tile.querySelector('.tile-decoration-layer')?.remove();
}

/**
 * @param {HTMLElement} tile
 * @param {{decorations?: Array<{sprite:string,slot:string,mirror:boolean}>}|null} cell
 * @param {boolean} isOob
 */
function _renderDecorations(tile, cell, isOob) {
  if (isOob || !cell?.decorations?.length) return;

  const layer = document.createElement('div');
  layer.className = 'tile-decoration-layer';

  for (const decoration of cell.decorations) {
    const el = document.createElement('img');
    el.className = `tile-decoration sprite-slot--${decoration.slot}`;
    el.src = `resources/sprites/${decoration.sprite}.svg`;
    el.alt = '';
    el.setAttribute('aria-hidden', 'true');

    if (decoration.mirror) {
      el.classList.add('is-mirrored');
    }
    if (decoration.sprite === 'torch' || decoration.sprite === 'brazier') {
      el.classList.add('is-light-source');
    }
    if (decoration.sprite === 'banner') {
      el.classList.add('is-swaying');
    }
    if (FLOOR_DECORATION_SPRITES.has(decoration.sprite)) {
      el.classList.add('is-floor-decoration');
    }

    layer.appendChild(el);
  }

  tile.appendChild(layer);
}
