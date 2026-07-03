/**
 * win-screen.js — Win / escape screen. Saves score and notifies leaderboard.
 */

import { restartGame } from '../../js/app.js';
import { saveScore }   from '../../js/state.js';

let _timeEl = null;

export function init() {
  _timeEl = document.getElementById('win-time');
  document.getElementById('btn-play-again')
    ?.addEventListener('click', () => restartGame());
}

/**
 * @param {number} elapsedMs
 */
export function show(elapsedMs) {
  if (_timeEl) _timeEl.textContent = _format(elapsedMs);
  saveScore(elapsedMs);
  window.dispatchEvent(new CustomEvent('maze:score-saved'));
}

function _format(ms) {
  const total = Math.floor(ms);
  const mins  = Math.floor(total / 60000);
  const secs  = Math.floor((total % 60000) / 1000);
  const cents = Math.floor((total % 1000) / 10);
  return `${_pad(mins)}:${_pad(secs)}.${_pad(cents)}`;
}

function _pad(n) { return String(n).padStart(2, '0'); }
