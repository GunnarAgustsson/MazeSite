# Architecture

## Screen Flow

```
Browser opens index.html
       │
       ▼
  app.js: init()
    loadSettings()
    showScreen('start')
       │
       ▼ [player clicks "Enter the Dungeon"]
  startGame()
    generateMaze(20, 20)
    viewport.init() → buildViewport(0, 0)
    timer.reset() → timer.start()
    showScreen('game')
    input.init()
       │
       ▼ [player reaches [19][19]]
  checkWin() → endGame(elapsedMs)
    timer.stop()
    input.destroy()
    winScreen.show(elapsedMs)  → saveScore(ms)
    showScreen('win')
       │
       ▼ [player clicks "Enter Again"]
  restartGame() → startGame()  (loop)
```

## AppState Shape

```js
AppState = {
  screen:        'start' | 'game' | 'win',
  maze:          Array<Array<Cell>> | null,
  pos:           { row: number, col: number },
  transitioning: boolean,
  timer:  { running, startMs, elapsedMs },
  settings: { timerVisible: boolean },
}
```

## Module Dependency Graph

```
app.js
  ├── state.js
  ├── maze-generator.js
  ├── navigation.js → viewport.js, timer.js, state.js
  ├── input.js → navigation.js, state.js
  ├── viewport.js → state.js, tiles/tile-utils.js
  ├── timer.js → state.js
  ├── start-screen.js → app.js, state.js, settings.js, timer.js
  └── win-screen.js → app.js, state.js
```

Circular imports between app.js ↔ start-screen.js and app.js ↔ win-screen.js
are safe — both use live ES module bindings only invoked from click handlers.
navigation.js avoids importing app.js by dispatching `CustomEvent('maze:win')`.
