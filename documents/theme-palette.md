# Dungeon Theme & Palette

## Core UI Tokens (`css/style.css`)

| Token | Value | Purpose |
|---|---|---|
| `--color-wall` | `#1a1008` | Dungeon wall base |
| `--color-floor` | `#2c1f10` | Walkable floor base |
| `--color-floor-win` | `#1a2e1a` | Exit tile floor |
| `--color-accent` | `#c8860a` | Primary highlight |
| `--color-accent-dim` | `#7a5205` | Muted highlight |
| `--color-text` | `#e8d8b0` | Main text |
| `--color-text-dim` | `#8a7450` | Secondary text |

## Room Atmosphere Tints (`css/game.css`)

| Theme | Tint Token | Value | Intent |
|---|---|---|---|
| Crypt | `--room-tint-crypt` | `rgba(68, 89, 112, 0.28)` | Cold stone |
| Moss | `--room-tint-moss` | `rgba(54, 90, 52, 0.28)` | Damp growth |
| Ember | `--room-tint-ember` | `rgba(112, 68, 32, 0.28)` | Warm firelight |
| Ruin | `--room-tint-ruin` | `rgba(98, 84, 74, 0.28)` | Dusty decay |

## Sprite Pixel Palette

Use these colors when adding/updating sprite pixels in `resources/sprites/*.svg`:

- Stone: `#4a3f35`, `#6e5e4f`, `#8a7968`
- Wood/leather: `#4d3212`, `#6b4324`, `#8b5d2d`
- Metal: `#6f5c3f`, `#8a7450`
- Steel: `#5f6d7a`, `#7f8b96`, `#d0d6dc`
- Flame: `#ff9a3b`, `#ffd16e`, `#fff5b7`
- Organic: `#345f35`, `#4f8f4f`, `#5fa35e`
- Character skin/cloth: `#e8d8b0`, `#b48659`, `#5e3f16`, `#c8860a`
