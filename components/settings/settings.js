/**
 * settings.js — Settings panel component.
 */

import { AppState, saveSettings } from '../../js/state.js';
import * as timer from '../timer/timer.js';

let _panel    = null;
let _checkbox = null;

export function init() {
  _panel    = document.getElementById('settings-panel');
  _checkbox = document.getElementById('timer-visible-checkbox');
  if (_checkbox) {
    _checkbox.checked = AppState.settings.timerVisible;
    _checkbox.addEventListener('change', _onTimerVisibleChange);
  }
}

export function open()   { _panel?.classList.remove('state-hidden'); }
export function close()  { _panel?.classList.add('state-hidden'); }
export function toggle() { _panel?.classList.toggle('state-hidden'); }
export function refresh() {
  if (_checkbox) _checkbox.checked = AppState.settings.timerVisible;
}

function _onTimerVisibleChange(e) {
  AppState.settings.timerVisible = e.target.checked;
  saveSettings();
  timer.setVisible(AppState.settings.timerVisible);
}
