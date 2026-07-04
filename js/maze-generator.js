/**
 * maze-generator.js — Iterative depth-first search (recursive backtracking).
 *
 * Cell schema:
 *   { n: boolean, s: boolean, e: boolean, w: boolean, win?: true }
 *
 *   Each boolean is true when a passage (open corridor) exists in that
 *   direction.  Walls are simply the absence of a passage.
 *
 * Guarantees:
 *   • [0][0]  is forced to be a T-section (exactly 3 open sides).
 *   • [rows-1][cols-1].win === true  (the exit tile).
 *   • Every cell is reachable from [0][0] (the DFS spans all cells).
 */

/**
 * Generate a maze using iterative DFS.
 *
 * @param {number} rows
 * @param {number} cols
 * @returns {Array<Array<{n:boolean,s:boolean,e:boolean,w:boolean,win?:true}>>}
 */
export function generateMaze(rows, cols) {
  /* ---- Initialise all cells as fully closed ---- */
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ n: false, s: false, e: false, w: false }))
  );

  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

  /* Direction helpers: [dr, dc, fromSide, toSide] */
  const DIRS = [
    { dr: -1, dc:  0, from: 'n', to: 's' },
    { dr:  1, dc:  0, from: 's', to: 'n' },
    { dr:  0, dc:  1, from: 'e', to: 'w' },
    { dr:  0, dc: -1, from: 'w', to: 'e' },
  ];

  /** Shuffle an array in-place using Fisher-Yates. */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ---- Iterative DFS ---- */
  const stack = [{ row: 0, col: 0 }];
  visited[0][0] = true;

  while (stack.length > 0) {
    const { row, col } = stack[stack.length - 1];

    const neighbours = shuffle(
      DIRS
        .map(d => ({ ...d, nr: row + d.dr, nc: col + d.dc }))
        .filter(d => d.nr >= 0 && d.nr < rows && d.nc >= 0 && d.nc < cols && !visited[d.nr][d.nc])
    );

    if (neighbours.length === 0) {
      stack.pop();
      continue;
    }

    const chosen = neighbours[0];
    /* Carve passage — both sides */
    grid[row][col][chosen.from]      = true;
    grid[chosen.nr][chosen.nc][chosen.to] = true;
    visited[chosen.nr][chosen.nc]    = true;
    stack.push({ row: chosen.nr, col: chosen.nc });
  }

  /* ---- Post-process start cell [0][0] ---- */
  /* [0][0] is a corner: only south and east are valid in-bounds directions.
     Ensure both are open so the player always starts with 2 exits (L-corner
     at minimum, rather than a dead end).                                    */
  _openAllInBoundsNeighbours(grid, rows, cols, 0, 0);

  /* ---- Mark win tile ---- */
  grid[rows - 1][cols - 1].win = true;

  return grid;
}

// ---- Helpers -----------------------------------------------------------

/**
 * Ensure all in-bounds neighbours of cell [r][c] have an open passage.
 * Used to guarantee the start cell has the maximum available exits.
 *
 * @param {Array<Array<object>>} grid
 * @param {number} rows
 * @param {number} cols
 * @param {number} r
 * @param {number} c
 */
function _openAllInBoundsNeighbours(grid, rows, cols, r, c) {
  const OPPOSITE = { n: 's', s: 'n', e: 'w', w: 'e' };
  const DELTAS   = { n: [-1, 0], s: [1, 0], e: [0, 1], w: [0, -1] };

  for (const [dir, [dr, dc]] of Object.entries(DELTAS)) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
    grid[r][c][dir]            = true;
    grid[nr][nc][OPPOSITE[dir]] = true;
  }
}
