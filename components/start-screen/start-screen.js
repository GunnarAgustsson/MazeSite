/**
 * start-screen.js — Start screen + leaderboard component.
 */

import { startGame }               from '../../js/app.js';
import { AppState, getLeaderboard } from '../../js/state.js';
import * as settings                from '../settings/settings.js';
import * as timer                   from '../timer/timer.js';

let _boardEl = null;

export function init() {
  settings.init();
  settings.refresh();

  _boardEl = document.getElementById('leaderboard-list');

  document.getElementById('btn-start')
    ?.addEventListener('click', _onStartClick);
  document.getElementById('btn-settings-toggle')
    ?.addEventListener('click', () => settings.toggle());

  window.addEventListener('maze:score-saved', renderLeaderboard);
  renderLeaderboard();
}

export function renderLeaderboard() {
  if (!_boardEl) return;
  const scores = getLeaderboard();

  if (scores.length === 0) {
    _boardEl.innerHTML = '<li class="lb-empty">No runs yet — be the first!</li>';
    return;
  }

  _boardEl.innerHTML = scores.map((s, i) =>
    `<li class="lb-row">
      <span class="lb-rank">${_medal(i)}</span>
      <span class="lb-time">${_format(s.ms)}</span>
      <span class="lb-date">${s.date}</span>
    </li>`
  ).join('');
}

function _onStartClick() {
  timer.setVisible(AppState.settings.timerVisible);
  startGame();
}

function _medal(i) {
  return ['🥇', '🥈', '🥉', '4', '5'][i] ?? String(i + 1);
}

function _format(ms) {
  const total = Math.floor(ms);
  const mins  = Math.floor(total / 60000);
  const secs  = Math.floor((total % 60000) / 1000);
  const cents = Math.floor((total % 1000) / 10);
  return `${_pad(mins)}:${_pad(secs)}.${_pad(cents)}`;
}

function _pad(n) { return String(n).padStart(2, '0'); }
