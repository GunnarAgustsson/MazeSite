# MazeSite — Copilot Agent Instructions

## Project Overview
A browser-based dungeon maze game built with **vanilla HTML, CSS, and ES modules** (no build step, no framework).
The player navigates a procedurally generated 20×20 maze rendered in a 3×3 rolling viewport.

### Key directories
```
css/                  Global design tokens and utilities
components/           Feature components (each owns its own CSS + JS)
  viewport/           The 3×3 rolling tile viewport
  tiles/              Tile type classification and background builder
js/                   Core modules: state, maze generation, navigation, input
resources/sprites/    64×64 SVG sprites with SMIL animation
```

### Key constraints
- No bundler, no npm — all imports are native ES module paths
- CSS custom properties (`--corridor-width`, `--tile-anim-duration`, etc.) are the single source of truth for geometry and timing
- Sprites are **SVG files** in `resources/sprites/`, animated via **SMIL** (not CSS sprite sheets)
- All decoration/atmosphere logic lives in `js/decorations.js` and `css/game.css`

---

## Skill Management

### When to CREATE a new skill
Create a skill whenever you encounter a **reusable, specialist workflow** that:
- Has more than ~5 steps
- Involves multiple files or a non-obvious pattern specific to this project
- Would benefit future sessions (the workflow will come up again)

Examples that warrant a skill:
- Adding a new sprite and wiring it into the decoration system
- Creating a new tile type and registering it in `tile-utils.js`
- Extending the maze generator with a new post-processing pass
- Setting up a new component (CSS + JS + viewport integration)

### When to UPDATE an existing skill
Update a skill when:
- A referenced file path or API changes
- A better pattern is discovered during work
- New steps are needed (e.g. a new file must be touched for a task to be complete)
- A step in the existing skill turned out to be wrong or incomplete

### Skill locations for this project
```
.github/skills/<name>/SKILL.md       Project-level skills (preferred)
~/.copilot/skills/<name>/SKILL.md    Personal skills (for cross-project patterns)
```

### Existing skills
| Skill | Trigger phrases | What it covers |
|-------|----------------|----------------|
| `dungeon-sprites` | add sprite, new decoration, new prop, room atmosphere, sprite animation | SVG palette, SMIL animation templates, decoration system architecture, how to add a new sprite type end-to-end |

### Skill file structure reminder
```
.github/skills/<name>/
├── SKILL.md               # Required — frontmatter + procedure
└── references/            # Optional — detailed reference docs
    ├── color-palette.md
    ├── animation-patterns.md
    └── decoration-system.md
```

`SKILL.md` frontmatter must include:
- `name` — lowercase, hyphens, matches folder name
- `description` — keyword-rich, starts with action verbs, includes "Use when …" triggers

---

## Coding Standards

- **ES modules only** — use `import`/`export`, never `<script>` globals
- **CSS custom properties** for any value shared across files
- **No inline styles** except for dynamic CSS variable overrides (`el.style.setProperty('--x', v)`)
- Comment only non-obvious logic; do not comment self-evident code
- Keep component files co-located: `components/<name>/<name>.css` + `<name>.js`
- SVG sprites: 64×64 `viewBox`, SMIL for animation, dungeon palette from `css/game.css` color section
- Max **120 characters** per line; max **300 lines** per file
- JS naming: `camelCase` functions/variables, `SCREAMING_SNAKE` constants

---

## Quick Start

Open `index.html` in any modern browser — no server or build step required.

## Key Files

| Path | Role |
|------|------|
| `index.html`                              | HTML skeleton; loads CSS then `js/app.js` |
| `css/style.css`                           | Design tokens (`:root`), global reset |
| `js/state.js`                             | `AppState` singleton + localStorage helpers |
| `js/app.js`                               | Bootstrap, `showScreen`, `startGame`, `endGame` |
| `js/maze-generator.js`                    | `generateMaze(rows, cols)` — iterative DFS |
| `js/decorations.js`                       | Room themes + per-cell sprite decoration |
| `js/navigation.js`                        | `canMove`, `navigate`, `checkWin` |
| `js/input.js`                             | Keyboard / wheel / touch handlers |
| `components/viewport/viewport.js`         | 3×3 rolling viewport (CSS transform slide) |
| `components/tiles/tile-utils.js`          | `getTileType`, `buildBackground` |
| `resources/sprites/`                      | 64×64 pixel-art SVG sprite files |

## Further Reading

| File | When to read |
|------|---------------|
| `documents/architecture.md`   | Screen flow, module wiring, state shape |
| `documents/components.md`     | Tile rendering, viewport pattern, decoration pipeline |
| `documents/conventions.md`    | Naming rules, line/file limits |
| `documents/maze-generation.md`| Algorithm details, cell schema |
| `documents/theme-palette.md`  | Colour tokens and sprite pixel palette |
