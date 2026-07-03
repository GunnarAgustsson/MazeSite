# Maze Generation

## Algorithm — Iterative DFS (Recursive Backtracking)

1. Initialise 20×20 grid of fully-closed cells.
2. Push `[0][0]` onto stack; mark visited.
3. While stack non-empty: peek top, shuffle unvisited neighbours, pick first, carve passage both sides, push.
4. Post-process `[0][0]`: open both south and east (only in-bounds neighbours at the corner).
5. Mark `[19][19].win = true`.

## Cell Schema

```ts
type Cell = {
  n: boolean;  // corridor open north
  s: boolean;  // corridor open south
  e: boolean;  // corridor open east
  w: boolean;  // corridor open west
  win?: true;  // only on [rows-1][cols-1]
};
```

## Guarantees

| Property | Value |
|----------|-------|
| Connectivity | Every cell reachable from `[0][0]` |
| Perfectness | No loops; one path between any two cells |
| Start | `[0][0]` has south and east open |
| Exit | `[19][19].win === true` |
| Size | Fixed 20×20 (v1) |

## Tile Types

| Open sides | Type |
|-----------|------|
| 4 | `cross` |
| 3 (miss N) | `t-s` |
| 3 (miss S) | `t-n` |
| 3 (miss E) | `t-w` |
| 3 (miss W) | `t-e` |
| N+S | `straight-v` |
| E+W | `straight-h` |
| N+E/NW/SE/SW | `l-ne` etc. |
| 1 open | `dead-n/s/e/w` |
| 0 | `wall` |
