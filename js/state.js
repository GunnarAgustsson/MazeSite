/**
 * state.js — AppState shape + localStorage settings persistence
 *
 * AppState is the single source of truth for the entire application.
 * Modules read from and write to this object; they never maintain
 * their own copies of application-level state.
 */

export const AppState = {
  /** @type {'start'|'game'|'win'} */
  screen: 'start',

  /** @type {Array<Array<{n:boolean,s:boolean,e:boolean,w:boolean,win?:boolean}>>|null} */
  maze: null,

  /** Current player position in the maze grid */
  pos: { row: 0, col: 0 },

  /** True while a viewport slide animation is in progress */
  transitioning: false,

  timer: {
    running:   false,
    startMs:   0,
    elapsedMs: 0,
  },

  settings: {
    timerVisible: true,
  },
};

// ---- localStorage helpers -----------------------------------------------

const SETTINGS_KEY    = 'mazeSite_settings_v1';
const LEADERBOARD_KEY = 'mazeSite_leaderboard_v1';
const MAX_SCORES      = 5;

/** Persist current settings to localStorage. */
export function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(AppState.settings));
  } catch (_) { /* private browsing / storage full */ }
}

/** Load settings from localStorage; merges into AppState.settings. */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    Object.assign(AppState.settings, JSON.parse(raw));
  } catch (_) { /* corrupted — keep defaults */ }
}

// ---- Leaderboard helpers ------------------------------------------------

/**
 * @typedef {{ms: number, date: string}} ScoreEntry
 */

/**
 * Save a completed run to the leaderboard.
 * Keeps only the top MAX_SCORES entries sorted fastest-first.
 * @param {number} ms
 */
export function saveScore(ms) {
  const board = getLeaderboard();
  board.push({ ms, date: new Date().toLocaleDateString() });
  board.sort((a, b) => a.ms - b.ms);
  const trimmed = board.slice(0, MAX_SCORES);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  } catch (_) { /* ignore */ }
}

/**
 * Return the current leaderboard, fastest-first.
 * @returns {ScoreEntry[]}
 */
export function getLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (_) {
    return [];
  }
}
