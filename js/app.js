/**
 * app.js — Bootstrap, screen management, and high-level game lifecycle.
 */

import { AppState, loadSettings } from './state.js';
import { generateMaze }           from './maze-generator.js';
import * as viewport               from '../components/viewport/viewport.js';
import * as timer                  from '../components/timer/timer.js';
import * as startScreen            from '../components/start-screen/start-screen.js';
import * as winScreen              from '../components/win-screen/win-screen.js';
import * as input                  from './input.js';

const SCREENS = {
  start: document.getElementById('start-screen'),
  game:  document.getElementById('game-screen'),
  win:   document.getElementById('win-screen'),
};

/**
 * Show one screen and hide all others.
 * @param {'start'|'game'|'win'} name
 */
export function showScreen(name) {
  AppState.screen = name;
  for (const [key, el] of Object.entries(SCREENS)) {
    if (!el) continue;
    if (key === name) {
      el.classList.remove('screen-hidden');
    } else {
      el.classList.add('screen-hidden');
    }
  }
}

/** Called by start-screen when the player presses "Start". */
export function startGame() {
  const ROWS = 20;
  const COLS = 20;

  AppState.maze = generateMaze(ROWS, COLS);
  AppState.pos  = { row: 0, col: 0 };
  AppState.transitioning = false;

  viewport.init();
  viewport.buildViewport(0, 0);

  timer.reset();
  timer.setVisible(AppState.settings.timerVisible);
  timer.start();

  showScreen('game');
  input.init();
}

/**
 * Called when the player reaches the win tile.
 * @param {number} elapsedMs
 */
export function endGame(elapsedMs) {
  timer.stop();
  input.destroy();
  winScreen.show(elapsedMs);
  showScreen('win');
}

/** Called by win-screen "Play Again" button. */
export function restartGame() {
  startGame();
}

function init() {
  loadSettings();

  SCREENS.game?.classList.add('screen-hidden');
  SCREENS.win?.classList.add('screen-hidden');

  startScreen.init();
  timer.init();
  winScreen.init();

  /* Navigation dispatches 'maze:win' to avoid a circular import */
  window.addEventListener('maze:win', (e) => endGame(e.detail.elapsedMs));

  showScreen('start');
}

init();
