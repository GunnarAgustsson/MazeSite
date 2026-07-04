# Components

## Component Folder Pattern

Each component lives in its own folder under `components/`:

```
components/
  <name>/
    <name>.js   ← logic + DOM wiring
    <name>.css  ← styles scoped to this component
```

Tile components additionally have a shared parent:

```
components/tiles/
  tile-utils.js        ← getTileType() + buildBackground() — shared utilities
  <tile-name>/
    <tile-name>.js
    <tile-name>.css
```

## Tile Rendering Pipeline

### 1. Maze cell schema
Each cell carries four booleans — `n`, `s`, `e`, `w` — that indicate whether
a corridor passage exists in that direction.  The win tile also has `win: true`.

### 2. getTileType(cell) → string
Classifies a cell into a canonical type name (`'cross'`, `'t-n'`, `'l-ne'`,
`'straight-h'`, `'dead-s'`, `'wall'`, …).  Used for diagnostics and
`data-tile-type` attributes; not required for rendering.

### 3. buildBackground(cell, isOOB) → CSS string
Builds a multi-layer CSS `linear-gradient` background:

```
center floor square
  + one arm per open side (n / s / e / w)
  + wall colour as background-color fallback
```

The geometry is expressed entirely with CSS `calc()` and `:root` tokens:

| Token              | Default | Meaning                          |
|--------------------|---------|----------------------------------|
| `--corridor-width` | `60%`   | Width/height of each corridor arm |
| `--corridor-half`  | `calc(50% - 30%)` = `20%` | Wall margin on each side |

Because adjacent tiles share the same token values the corridors align
seamlessly without any pixel arithmetic in JavaScript.

### 4. Individual tile .js files
Each tile's `render(el, cell)` function:
1. Calls `buildBackground(cell)`.
2. Assigns the result to `el.style.background`.
3. Sets `el.dataset.tileType` for debugging.
4. The win-tile additionally adds/removes the `win-tile` CSS class for the glow animation.

## Viewport — 3×3 Rolling Window

### DOM structure
```
#viewport-outer   (position:fixed, 100vw×100vh, overflow:hidden)
  #viewport-grid  (display:grid, 3 cols × 3 rows, 300vw×300vh)
    .tile × 9     (100vw × 100vh each)
```

### Translation mechanism
`--tx` and `--ty` are CSS custom properties set on `#viewport-grid`:

```css
transform: translate(calc(var(--tx) * -100vw), calc(var(--ty) * -100vh));
```

| Value | Effect |
|-------|--------|
| `--tx=1, --ty=1` | Centre tile visible (default / player position) |
| `--tx=0, --ty=1` | Left tile visible |
| `--tx=2, --ty=1` | Right tile visible |
| `--tx=1, --ty=0` | Top tile visible |
| `--tx=1, --ty=2` | Bottom tile visible |

### Move animation sequence
1. `navigate(dir)` is called.
2. `animateTo(dir)` adds `.grid-animating` and shifts `--tx`/`--ty` by ±1.
3. On `transitionend` (or 700ms fallback): update `AppState.pos`, call `buildViewport(newRow, newCol)`.
4. `resetToCenter()` removes `.grid-animating`, sets `--tx=1, --ty=1`,
   forces a reflow (`offsetHeight`), making the snap invisible to the user.

### Bump animation (blocked direction)
`bump(dir)` shifts only 20% of a tile width/height then snaps back,
giving tactile wall-collision feedback.

## Decoration & Sprite Pipeline

### Maze decoration data generation
`js/decorations.js` runs once per generated maze and extends each cell with:

- `roomTheme`: one of `crypt | moss | ember | ruin`
- `decorations`: random sprite toggles + slot placement metadata

The map is chunked into 6×6 room blocks so neighboring cells share a
theme while still toggling props randomly per tile.

### Viewport decoration rendering
`components/viewport/viewport.js` reads each cell's decoration metadata and:

1. Applies room tint class (`theme-crypt`, `theme-moss`, etc.)
2. Creates `.tile-decoration-layer` per tile
3. Appends `img.tile-decoration` for each sprite with slot-based positioning
4. Applies behavior classes for mirrored props, light sources, and floor decals

### Sprite assets
All sprites live in `resources/sprites/` as **64×64 pixel-style SVGs**.

- Player sprite: `resources/sprites/player.svg`
- Animated light props: `torch.svg`, `brazier.svg`
- Static/ambient props: `banner.svg`, `chains.svg`, `rubble.svg`, `bones.svg`, `moss.svg`, `altar.svg`, `crate.svg`, `shield-rack.svg`
- Floor decals: `carpet.svg`, `floor-cracks.svg`

SMIL animation is used selectively for props that benefit from motion (fire,
idle bobbing, cloth sway), while most scenery remains static.

### Player layering
The player sprite is mounted as a fixed overlay inside `#viewport-outer`, not
inside a tile. This keeps the character visually stable while the 3×3 maze grid
slides between cells.
