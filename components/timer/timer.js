/**
 * timer.js — requestAnimationFrame-based game timer.
 */

import { AppState } from '../../js/state.js';

let _el    = null;
let _rafId = null;

export function init()  { _el = document.getElementById('timer-display'); }

export function start() {
  if (AppState.timer.running) return;
  AppState.timer.running = true;
  AppState.timer.startMs = performance.now() - AppState.timer.elapsedMs;
  _tick();
}

export function stop() {
  if (!AppState.timer.running) return;
  AppState.timer.running   = false;
  AppState.timer.elapsedMs = performance.now() - AppState.timer.startMs;
  if (_rafId !== null) { cancelAnimationFrame(_rafId); _rafId = null; }
  _render();
}

export function reset() {
  stop();
  AppState.timer.elapsedMs = 0;
  AppState.timer.startMs   = 0;
  _render();
}

export function getElapsedMs() {
  return AppState.timer.running
    ? performance.now() - AppState.timer.startMs
    : AppState.timer.elapsedMs;
}

export function getFormattedTime() { return _format(getElapsedMs()); }

export function setVisible(visible) {
  if (!_el) return;
  _el.classList.toggle('state-hidden', !visible);
}

function _tick() {
  if (!AppState.timer.running) return;
  _render();
  _rafId = requestAnimationFrame(_tick);
}

function _render() {
  if (_el) _el.textContent = _format(getElapsedMs());
}

function _format(ms) {
  const total = Math.floor(ms);
  const mins  = Math.floor(total / 60000);
  const secs  = Math.floor((total % 60000) / 1000);
  const cents = Math.floor((total % 1000) / 10);
  return `${_pad(mins)}:${_pad(secs)}.${_pad(cents)}`;
}

function _pad(n) { return String(n).padStart(2, '0'); }
