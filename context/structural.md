# Structural Context

Code layout and runtime model for Simple Game.

## Module Graph

```
src/
├── core/
│   ├── config.js          # game constants and tuning
│   ├── context.js         # runtime state + config + actions holder
│   ├── seed.js            # initial game state
│   └── actions.js         # state-mutation action definitions
├── services/
│   ├── bulletManager/     # player and enemy bullet generation
│   ├── gameService.js     # high-level game helpers (restart, save)
│   ├── helperService.js   # collection/math utilities
│   ├── playerManager.js   # collisions, scoring, health, movement, combos
│   ├── positionService.js # coordinate math and bounds checking
│   ├── shortcutManager.js # keyboard shortcut wiring
│   ├── targetManager/     # enemy target spawn logic
│   ├── targetMovement.js  # movement pattern math (static, linear, sine, zigzag)
│   ├── ticker/            # game loop components
│   │   ├── index.js       # interval-based ticker runner
│   │   ├── masterLoop.js  # ordered action list per tick
│   │   └── timeService.js # time adjustment helpers
│   └── urlService.js      # mode query-param parsing
├── components/
│   ├── 2dMode/            # DOM/CSS renderer components
│   ├── 3dMode/            # R3F / Three.js renderer components
│   ├── gameScreen.js      # input handler, mode selector, ticker starter
│   ├── welcomeScreen.js   # start/help UI
│   ├── gameOverScreen.js  # score/combo display + restart
│   ├── score.js           # 2D score/combo UI
│   ├── healthBar.js       # 2D health indicator
│   ├── keyboard/          # shortcut key definitions
│   └── help/              # help overlay
└── App.js                 # root component
```

## Data Flow

1. `ticker/index.js` runs on an interval (`config.tickerDelay`).
2. Each tick calls `masterLoop.runMasterLoop()`, which iterates action names in fixed order.
3. Each action is looked up in `actions.js` and called with `context`.
4. Actions return partial state patches; context merges them.
5. React re-renders; whichever renderer is active (2D or 3D) reads the same state.

## Renderer Duality

- **2D mode** uses absolutely positioned DOM nodes (`px`/`%` via SCSS).
- **3D mode** uses `@react-three/fiber` `<Canvas>` with GLTF models and spring animations.
- Both modes consume identical `state` objects; no renderer-specific state lives in core.

## Test Structure

Every source file has a parallel `.test.js`. Coverage threshold is 100% branches/functions/lines/statements.

## Key Configuration Dimensions

- `config.movementTypes`: static, linear, sine, zigzag — assigned per-target at spawn.
- `config.targets`: shooter, firingShooter — with health, damage, spawn probability.
- `config.bulletsType` / `config.enemyBulletsType`: normal, superBullet — with size, color, damage.
- `config.powers`: doubleBullet — duration-based power-up.
- `config.comboTimeout` / `config.comboMultiplierMax`: combo scoring tuning.
