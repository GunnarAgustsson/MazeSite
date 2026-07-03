# Dungeon Maze

A dungeon-themed random maze game — vanilla HTML/CSS/JS, no build step required.

## Play

Serve with any static file server (ES modules require HTTP):

```bash
python -m http.server 8080
```

Then open **http://localhost:8080**

## Controls

| Input | Action |
|-------|--------|
| Arrow keys / WASD | Move |
| Mouse wheel | Move (dominant axis) |
| Swipe | Move (50% threshold) |

## Features

- 20×20 randomly generated maze per run
- Smooth CSS-transform viewport sliding
- Rotating arrow player indicator
- Flickering torch decorations on dead-end alcoves
- Top-5 local leaderboard (localStorage)
- Configurable timer visibility

See [AGENT.md](AGENT.md) for architecture and code conventions.
