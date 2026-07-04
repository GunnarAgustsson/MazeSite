/**
 * input.js — Keyboard, mouse wheel, and touch input handlers.
 *
 * init()    — Wire all input listeners.
 * destroy() — Remove all listeners (called when leaving the game screen).
 *
 * Touch behaviour:
 *   • touchstart  — record origin.
 *   • touchmove   — axis-lock after 10px; translate #viewport-grid live
 *                   (clamped to ±100vw or ±100vh so the grid never over-scrolls).
 *   • touchend    — if |delta| ≥ 50% of the screen dimension → commit navigate();
 *                   else animate back to centre.
 */

import { navigate } from './navigation.js';
import { AppState } from './state.js';

// ---- Bound listener references (needed for removeEventListener) --------

let _onKeyDown   = null;
let _onWheel     = null;
let _onTouchStart= null;
let _onTouchMove = null;
let _onTouchEnd  = null;

// ---- Touch state -------------------------------------------------------

const touch = {
  startX:   0,
  startY:   0,
  axis:     null,   /** @type {'h'|'v'|null} */
  dx:       0,
  dy:       0,
};

// ---- Wiring ------------------------------------------------------------

export function init() {
  _onKeyDown    = onKeyDown;
  _onWheel      = onWheel;
  _onTouchStart = onTouchStart;
  _onTouchMove  = onTouchMove;
  _onTouchEnd   = onTouchEnd;

  window.addEventListener('keydown',    _onKeyDown,    { passive: false });
  window.addEventListener('wheel',      _onWheel,      { passive: false });
  window.addEventListener('touchstart', _onTouchStart, { passive: true  });
  window.addEventListener('touchmove',  _onTouchMove,  { passive: false });
  window.addEventListener('touchend',   _onTouchEnd,   { passive: true  });
}

export function destroy() {
  window.removeEventListener('keydown',    _onKeyDown);
  window.removeEventListener('wheel',      _onWheel);
  window.removeEventListener('touchstart', _onTouchStart);
  window.removeEventListener('touchmove',  _onTouchMove);
  window.removeEventListener('touchend',   _onTouchEnd);
}

// ---- Keyboard ----------------------------------------------------------

function onKeyDown(e) {
  if (AppState.screen !== 'game') return;
  const MAP = {
    ArrowUp:    'n',
    ArrowDown:  's',
    ArrowRight: 'e',
    ArrowLeft:  'w',
    w: 'n', W: 'n',
    s: 's', S: 's',
    d: 'e', D: 'e',
    a: 'w', A: 'w',
  };
  const dir = MAP[e.key];
  if (!dir) return;
  e.preventDefault();
  navigate(dir);
}

// ---- Mouse wheel -------------------------------------------------------

function onWheel(e) {
  if (AppState.screen !== 'game') return;
  e.preventDefault();

  const ax = Math.abs(e.deltaX);
  const ay = Math.abs(e.deltaY);

  let dir;
  if (ax > ay) {
    dir = e.deltaX > 0 ? 'e' : 'w';
  } else {
    dir = e.deltaY > 0 ? 's' : 'n';
  }
  navigate(dir);
}

// ---- Touch -------------------------------------------------------------

function onTouchStart(e) {
  if (AppState.screen !== 'game') return;
  const t = e.touches[0];
  touch.startX = t.clientX;
  touch.startY = t.clientY;
  touch.axis   = null;
  touch.dx     = 0;
  touch.dy     = 0;
}

function onTouchMove(e) {
  if (AppState.screen !== 'game') return;
  if (AppState.transitioning) return;
  e.preventDefault();
  if (!e.touches.length) return;

  const t  = e.touches[0];
  const dx = t.clientX - touch.startX;
  const dy = t.clientY - touch.startY;

  /* Axis-lock once motion exceeds 10px */
  if (!touch.axis) {
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      touch.axis = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
    } else {
      return;
    }
  }

  const grid = document.getElementById('viewport-grid');
  if (!grid) return;
  grid.classList.remove('grid-animating');

  const W = window.innerWidth;
  const H = window.innerHeight;

  if (touch.axis === 'h') {
    touch.dx = Math.max(-W, Math.min(W, dx));
    /* swipe right (dx>0) → east tile slides in → --tx increases toward 2 */
    const tx = 1 + (touch.dx / W);
    grid.style.setProperty('--tx', tx);
    grid.style.setProperty('--ty', 1);
  } else {
    touch.dy = Math.max(-H, Math.min(H, dy));
    /* swipe down (dy>0) → south tile slides in → --ty increases toward 2 */
    const ty = 1 + (touch.dy / H);
    grid.style.setProperty('--tx', 1);
    grid.style.setProperty('--ty', ty);
  }
}

function onTouchEnd(_e) {
  if (AppState.screen !== 'game') return;

  /* Don't interfere with a keyboard/programmatic navigation already in progress */
  if (AppState.transitioning) {
    touch.axis = null;
    touch.dx   = 0;
    touch.dy   = 0;
    return;
  }

  const W = window.innerWidth;
  const H = window.innerHeight;

  const grid = document.getElementById('viewport-grid');
  if (!grid) return;

  if (touch.axis === 'h' && Math.abs(touch.dx) >= W * 0.5) {
    navigate(touch.dx > 0 ? 'e' : 'w');
  } else if (touch.axis === 'v' && Math.abs(touch.dy) >= H * 0.5) {
    navigate(touch.dy > 0 ? 's' : 'n');
  } else {
    /* Snap back to centre */
    grid.classList.add('grid-animating');
    grid.style.setProperty('--tx', 1);
    grid.style.setProperty('--ty', 1);
  }

  touch.axis = null;
  touch.dx   = 0;
  touch.dy   = 0;
}
