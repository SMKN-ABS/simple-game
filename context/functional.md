# Functional Context

Runtime behaviors that are implemented and verified.

## Verified Behaviors

### Input & Controls
- Mouse movement updates flight horizontal position (clamped to screen bounds).
- Click fires a single player bullet upward.
- `Enter`, `P`, `H`, `M` keys dispatch `gameStart`, `playPause`, `help`, `mute`.

### Game Loop (per tick)
1. `decreaseHealth` — drains health by `config.damage` every tick.
2. `backGroundMovingAxis` — scrolls background offset.
3. `addTargets` — spawns enemies up to `config.maxTargets` with random `movement` types.
4. `generateObjects` / `generatePowers` — spawns clouds, ships, power-ups by probability.
5. `updateObjects` / `updatePowers` — moves background objects downward.
6. `resetObjects` — removes objects that exit the screen.
7. `moveTargets` — applies `targetMovement` patterns; removes out-of-bounds targets.
8. `moveBullets` — moves player bullets up, enemy bullets down.
9. `processBullets` — detects bullet-target overlaps; reduces health of hit targets and player.
10. `clearHitBullets` — removes bullets marked as hit.
11. `updateScore` — increments score with combo multiplier; tracks `comboCount`, `comboTimer`, `maxCombo`.
12. `removeTargets` — removes targets with zero health.
13. `generateEnemyBullets` — enemies fire bullets probabilistically.
14. `processPowers` — detects flight-power collisions; activates `doubleBullet` duration.

### Scoring
- Combo increments per kill; resets after `comboTimeout` ms of no kills.
- Multiplier is `min(comboCount, comboMultiplierMax)`.
- Score increases by `kills * multiplier`.
- `maxCombo` records the highest streak.

### Power-ups
- `doubleBullet` is the only implemented power-up.
- Grants extra bullets for a fixed duration (configurable).
- Dropped probabilistically on target destruction.

### Rendering
- 2D mode renders all entities as CSS-positioned `<img>` / `<div>` elements.
- 3D mode renders entities inside `<Canvas>` with `<Suspense>` and contact shadows.
- Welcome, Game Over, Pause, and Help overlays are DOM-based and work across both renderers.

## Known Gaps

- **Hold to shoot:** Not implemented — only per-click firing.
- **Explosion effects:** No hit feedback beyond target removal.
- **Difficulty scaling:** Target spawn speed and movement speed are static; no progressive difficulty.
- **Extra lives:** Game ends immediately when health reaches zero.
- **High score list:** Only `localStorage` score persistence; no leaderboard UI.
- **Settings menu:** Not implemented.
- **Mobile / touch:** No touch input support.
- **3D positional audio:** Simple global audio only.
- **Screen resize in 3D:** Layout issues observed when resizing the browser window.
