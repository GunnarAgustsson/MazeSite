/**
 * decorations.js — room themes + randomized dungeon decoration payload.
 *
 * Adds two optional fields to each maze cell:
 *   cell.roomTheme:   'crypt' | 'moss' | 'ember' | 'ruin'
 *   cell.decorations: Array<{sprite:string, slot:string, mirror:boolean}>
 */

const ROOM_SIZE = 6;
const ROOM_THEMES = ['crypt', 'moss', 'ember', 'ruin'];

const FLOOR_SLOTS = [
  'north-inner-floor',
  'south-inner-floor',
  'east-inner-floor',
  'west-inner-floor',
  'north-east-floor',
  'north-west-floor',
  'south-east-floor',
  'south-west-floor',
];

const FLOOR_DECAL_SLOTS = [
  'center',
  ...FLOOR_SLOTS,
];

const THEME_DECORATIONS = {
  crypt: [
    { sprite: 'torch',       slotKind: 'wall',       chance: 0.46 },
    { sprite: 'chains',      slotKind: 'wall',       chance: 0.28 },
    { sprite: 'shield-rack', slotKind: 'wall',       chance: 0.2 },
    { sprite: 'bones',       slotKind: 'floor',      chance: 0.2 },
    { sprite: 'floor-cracks', slotKind: 'floorDecal', chance: 0.15 },
  ],
  moss: [
    { sprite: 'torch',       slotKind: 'wall',       chance: 0.32 },
    { sprite: 'moss',        slotKind: 'floorDecal', chance: 0.52 },
    { sprite: 'carpet',      slotKind: 'floorDecal', chance: 0.2 },
    { sprite: 'rubble',      slotKind: 'floor',      chance: 0.2 },
    { sprite: 'crate',       slotKind: 'floor',      chance: 0.18 },
  ],
  ember: [
    { sprite: 'torch',   slotKind: 'wall',       chance: 0.5 },
    { sprite: 'banner',  slotKind: 'wall',       chance: 0.26 },
    { sprite: 'brazier', slotKind: 'floor',      chance: 0.16 },
    { sprite: 'carpet',  slotKind: 'floorDecal', chance: 0.22 },
  ],
  ruin: [
    { sprite: 'rubble',       slotKind: 'floor',      chance: 0.42 },
    { sprite: 'banner',       slotKind: 'wall',       chance: 0.2 },
    { sprite: 'altar',        slotKind: 'floor',      chance: 0.12 },
    { sprite: 'crate',        slotKind: 'floor',      chance: 0.2 },
    { sprite: 'floor-cracks', slotKind: 'floorDecal', chance: 0.28 },
  ],
};

/**
 * Decorate maze cells with room themes and sprite toggles.
 * @param {Array<Array<{n:boolean,s:boolean,e:boolean,w:boolean,win?:boolean}>>} maze
 */
export function decorateMaze(maze) {
  if (!maze?.length || !maze[0]?.length) return;
  _assignRoomThemes(maze, ROOM_SIZE);
  _assignCellDecorations(maze);
}

/**
 * Split the map into room-sized chunks and assign one theme per chunk.
 * @param {Array<Array<object>>} maze
 * @param {number} roomSize
 */
function _assignRoomThemes(maze, roomSize) {
  const rows = maze.length;
  const cols = maze[0].length;

  for (let row = 0; row < rows; row += roomSize) {
    for (let col = 0; col < cols; col += roomSize) {
      const theme = _pick(ROOM_THEMES);
      for (let r = row; r < Math.min(row + roomSize, rows); r += 1) {
        for (let c = col; c < Math.min(col + roomSize, cols); c += 1) {
          maze[r][c].roomTheme = theme;
        }
      }
    }
  }
}

/**
 * Create the per-cell decoration list.
 * @param {Array<Array<object>>} maze
 */
function _assignCellDecorations(maze) {
  for (const row of maze) {
    for (const cell of row) {
      if (cell.win) {
        cell.roomTheme = 'ember';
      }

      const defs = THEME_DECORATIONS[cell.roomTheme] || [];
      const usedSlots = new Set();
      const decorations = [];

      for (const def of defs) {
        if (Math.random() > def.chance) continue;
        if (decorations.length >= 2) break;

        const slot = _pickAvailableSlot(cell, def.slotKind, usedSlots);
        if (!slot) continue;

        usedSlots.add(slot);
        decorations.push({
          sprite: def.sprite,
          slot,
          mirror: Math.random() < 0.5,
        });
      }

      cell.decorations = decorations;
    }
  }
}

/**
 * @param {{n:boolean,s:boolean,e:boolean,w:boolean}} cell
 * @param {'wall'|'floor'|'floorDecal'} slotKind
 * @param {Set<string>} usedSlots
 * @returns {string|null}
 */
function _pickAvailableSlot(cell, slotKind, usedSlots) {
  let slots = [];

  if (slotKind === 'wall') {
    if (!cell.n) slots.push('north-wall');
    if (!cell.s) slots.push('south-wall');
    if (!cell.e) slots.push('east-wall');
    if (!cell.w) slots.push('west-wall');
  } else if (slotKind === 'floor') {
    slots = [...FLOOR_SLOTS];
  } else if (slotKind === 'floorDecal') {
    slots = [...FLOOR_DECAL_SLOTS];
  } else {
    return null;
  }

  slots = slots.filter(slot => !usedSlots.has(slot));
  if (!slots.length) return null;
  return _pick(slots);
}

/**
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
function _pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
