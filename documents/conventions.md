# Code Conventions

## File Limits
- **120 characters** max per line
- **300 lines** max per file

## JavaScript

| Kind | Convention |
|------|------------|
| Variables / functions | `camelCase` |
| Constants | `SCREAMING_SNAKE` |
| Private helpers | `_camelCase` |

- ES modules only, relative paths with `.js` extensions
- Named exports only (no default exports)
- `AppState` is the only source of truth for app-level state
- Comments only where the *why* is non-obvious

## CSS

| Prefix | Applies to |
|--------|------------|
| `bg-*` | background |
| `color-*` | color |
| `margin-*` | margin |
| `pad-*` | padding |
| `flex-*` | flex layout |
| `gap-*` | gap |
| `text-*` | typography |
| `radius-*` | border-radius |
| `state-*` | visibility |
| `btn` / `btn-*` | button variants |

Inline `element.style.*` only permitted for tile `background` and player `--player-rot`.
