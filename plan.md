# Plan

Items to implement next. Each entry must be actionable enough to execute.

## Table of Contents

- [Hold to Shoot](#hold-to-shoot)
- [Gets Harder Over Time](#gets-harder-over-time)
- [Explosion Effects](#explosion-effects)

---

## Hold to Shoot (🟢 Low)

Reward the player with automatic fire when holding the mouse button down.

### Approach
1. Add `isShooting` boolean to `seed.js` (default `false`).
2. Replace the `onClick` handler in `gameScreen.js` with `onMouseDown` and `onMouseUp`.
3. On `onMouseDown`, set `isShooting = true` and start an interval to generate player bullets at the current fire rate.
4. On `onMouseUp`, set `isShooting = false` and clear the interval.
5. Alternatively, add a `tick`-based firing cooldown in `gameScreen.js` or let `bulletManager` read `isShooting` and generate bullets automatically.
6. Ensure the interval matches the existing `tickerDelay` cadence so fire rate feels consistent.

### Files to Modify
| # | File | Change |
|---|------|--------|
| 1 | `src/core/seed.js` | Add `isShooting: false` |
| 2 | `src/core/actions.js` | Add `setShooting` action |
| 3 | `src/components/gameScreen.js` | Wire `onMouseDown` / `onMouseUp` to dispatch `setShooting` |
| 4 | `src/services/bulletManager/index.js` | Generate bullets when `isShooting` is true and firing cooldown elapsed |

### Acceptance
- Holding the mouse button fires continuously.
- Releasing stops firing immediately.
- Existing single click still works as one shot.

---

## Gets Harder Over Time (🟢 Low)

Scale difficulty based on score / elapsed time.

### Approach
1. In `targetManager.addTargets()`, increase `maxTargets` as score rises.
2. Scale movement speed multipliers from `config.movementTypes` based on a difficulty function.
3. Optionally decrease `spawn` intervals or increase enemy bullet probability at higher scores.
4. Keep tuning parameters in `config.js` (e.g., `difficultyScalePerScore`, `maxDifficulty`).

### Files to Modify
| # | File | Change |
|---|------|--------|
| 1 | `src/core/config.js` | Add difficulty-scaling constants |
| 2 | `src/services/targetManager/index.js` | Apply difficulty multiplier to spawn count and speed |

### Acceptance
- Higher scores produce more targets and/or faster targets.
- Difficulty increase is perceptible but not punishing.

---

## Explosion Effects (🟢 Low)

Visual feedback when bullets hit targets.


### Approach
1. Detect hit events in `processBullets` (already happens).
2. Add a transient `explosions` array to state (`x`, `y`, `createdAt`, `duration`).
3. An `addExplosions` action populates the array from freshly hit targets.
4. A `removeExplosions` action purges expired entries after `duration`.
5. In 2D mode, render explosions as a CSS keyframe sprite or animated div.
6. In 3D mode, render a short particle burst or sprite via R3F.

### Files to Modify
| # | File | Change |
|---|------|--------|
| 1 | `src/core/seed.js` | Add `explosions: []` |
| 2 | `src/core/actions.js` | Add `addExplosions` and `removeExplosions` |
| 3 | `src/services/playerManager.js` | Emit explosion state from `processHits` or `updateScore` |
| 4 | `src/services/ticker/masterLoop.js` | Add `addExplosions` and `removeExplosions` to loop |
| 5 | `src/components/target.js` or new `explosion.js` | Render 2D explosions |
| 6 | `src/components/3dMode/scene/targets.js` or new component | Render 3D explosions |

### Acceptance
- A brief explosion appears at the location of a destroyed target.
- Explosions auto-remove after their duration.
- No memory leaks or lingering DOM nodes.
