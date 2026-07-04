# Dungeon Maze

A dungeon-themed random maze game — vanilla HTML/CSS/JS, no build step required.

## Play

Serve with any static file server (ES modules require HTTP):

```bash
python -m http.server 3000
```

Then open **http://localhost:3000**

## Controls

| Input | Action |
|-------|--------|
| Arrow keys / WASD | Move |
| Mouse wheel | Move (dominant axis) |
| Swipe | Move (50% threshold) |

## Features

- 20×20 randomly generated maze per run
- Smooth CSS-transform viewport sliding — player stays fixed while rooms slide
- Pixel-art knight player sprite with squash/stretch movement animation
- Room themes (crypt, moss, ember, ruin) with per-chunk decoration variety
- Flickering torches, braziers, banners, chains, shields, crates, carpets and more
- Floor decals (moss, carpet, cracks) that stay under the player
- Top-5 local leaderboard (localStorage)
- Configurable timer visibility

See [AGENTS.md](AGENTS.md) for architecture and code conventions.
