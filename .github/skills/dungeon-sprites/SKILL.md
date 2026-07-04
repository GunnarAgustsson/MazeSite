---
name: dungeon-sprites
description: Create or update 64x64 pixel dungeon sprites with SMIL animation and room decoration wiring.
  Use when adding props, player visuals, room atmosphere, or sprite animation.
---

# Dungeon Sprites Skill

Use this skill when adding or modifying player/prop sprites in MazeSite.

## Goals

- Keep all sprites at **64×64**
- Keep a consistent pixel-art look
- Animate only high-impact props (player/fire/cloth), not every object
- Wire sprites into room decoration randomization

## Procedure

1. Add or update a sprite in `resources/sprites/<name>.svg`.
2. Use `viewBox="0 0 64 64"` and pixel blocks (`<rect>`), with `shape-rendering="crispEdges"`.
3. For animated sprites, use SMIL (`<animate>` / `<animateTransform>`) for subtle loops.
4. Keep CSS sizing tied to `--sprite-size` and use pixel rendering:
   - `.tile-decoration`, `.player-sprite` → `image-rendering: pixelated`.
5. Register random room usage in `js/decorations.js` by updating `THEME_DECORATIONS`.
6. If adding new sprite slots/behaviors, update `css/game.css` and viewport decoration class wiring.
7. Update docs:
   - `documents/components.md` for pipeline changes
   - `documents/theme-palette.md` for palette/theming updates

## Animation guidance

- Good candidates: `player`, `torch`, `brazier`, optional cloth/banners
- Keep loops short and readable (about 0.2s to 2.8s)
- Avoid continuous motion on every prop to reduce visual noise

## Learnings

- Per-room randomization looks best when each room chunk gets a shared theme
  and each tile toggles decorations independently.
- Win-room readability improves when forcing a warmer theme (`ember`) with stronger light-source props.
