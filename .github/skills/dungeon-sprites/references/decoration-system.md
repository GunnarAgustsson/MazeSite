# Decoration System Wiring

1. `js/decorations.js` assigns:
   - `cell.roomTheme`
   - `cell.decorations[]` entries with `{ sprite, slot, mirror }`
2. `components/viewport/viewport.js` renders tile decoration images and behavior classes.
3. `css/game.css` controls:
   - room tint overlays (`theme-*`)
   - decoration slot placement (`sprite-slot--*`)
   - prop effects (`is-light-source`, `is-swaying`)

When adding a new sprite:

- add `resources/sprites/<name>.svg`
- include it in `THEME_DECORATIONS`
- add any special behavior class mapping in viewport rendering if needed
