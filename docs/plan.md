# Plan: Moving Targets

## Feature
Make enemy targets fly side-to-side or in patterns instead of staying still while descending.

## Status
- [ ] Not started
- [ ] In progress
- [ ] Complete

## Architecture Alignment
Verified against `docs/architecture.md`. Uses existing layers:
- **Core**: state shape (`seed.js`), config (`config.js`), actions (`actions.js`)
- **Services**: master loop (`masterLoop.js`), target manager (`targetManager.js`), position service (`positionService.js`)
- **Renderers**: 2D (`2dMode.js`) and 3D (`3dMode.js`) consume position from shared state; no renderer changes required

## Approach

### 1. State Shape
Extend the target object in `src/core/seed.js` with a `movement` property:
```js
movement: {
  type: 'static' | 'linear' | 'sine' | 'circular' | 'bounce' | 'figure8',
  speed: number,        // units per second
  direction: 1 | -1,    // for linear / bounce
  amplitude: number,    // for wave/orbit magnitude
  origin: { x, y },     // spawn pivot for relative patterns
  phase: number         // time offset for pattern desync
}
```

### 2. Patterns
| Pattern | Formula |
|---|---|
| **Linear** | `pos.x += speed * direction * dt` |
| **Sine** | `pos.x = origin.x + sin(time * speed + phase) * amplitude` |
| **Bounce** | `pos.x += speed * direction * dt`; reverse at bounds |
| **Circular** | `pos.x = origin.x + cos(time * speed + phase) * amplitude`; `pos.y = origin.y + sin(...) * amplitude` |
| **Figure-8** | `pos.x = origin.x + sin(time * speed) * amplitude`; `pos.y += descentSpeed * dt + sin(2 * time * speed) * (amplitude / 2)` |

### 3. Integration Points

#### Add Step to Master Loop
`src/services/ticker/masterLoop.js`
- Insert `moveTargets` after `addTargets` and before `processBullets`
- This keeps target positions updated before collision detection

#### Spawn Logic
`src/services/targetManager.js`
- When spawning a target, randomly assign a `movement` config:
  - Early levels: mostly `static` / `linear`
  - Later levels: `sine`, `bounce`, `circular`, `figure8`
- Pull max speeds and probabilities from `src/core/config.js`

#### Position Update Logic
Option A: Add to `src/services/playerManager.js` alongside existing movement helpers.
Option B: Create `src/services/targetMovementService.js` if patterns grow complex.
- Implement a `updateTargetPosition(target, dt, bounds)` dispatcher
- Use `src/services/positionService.js` for bounds checking

#### Edge Handling
Use `src/services/positionService.js` helpers:
- **Wrap**: re-enter from opposite side
- **Bounce**: reverse `direction`
- **Despawn**: mark for removal if exited bounds

#### Config
`src/core/config.js`
- Add `TARGET_MOVEMENT` section:
  - `ENABLED_TYPES` array
  - `BASE_SPEED`, `MAX_SPEED`
  - `AMPLITUDE_DEFAULT`, `AMPLITUDE_MAX`
  - `DIFFICULTY_SCALE`: speed multiplier per level

## Files to Modify
1. `src/core/seed.js` — add `movement` to initial target state
2. `src/core/config.js` — add target movement constants
3. `src/core/actions.js` — add/update patch action for target positions
4. `src/services/ticker/masterLoop.js` — insert `moveTargets` step
5. `src/services/targetManager.js` — assign random movement on spawn
6. `src/services/playerManager.js` (or new `targetMovementService.js`) — pattern math
7. `src/services/positionService.js` — add bounds/edge helper if missing

## Rollout Plan

### Phase 1: Foundation
- [ ] Update seed, config, and actions for `movement` state
- [ ] Add `moveTargets` to master loop skeleton (no-op first)
- [ ] Verify 2D and 3D renderers still work with new state field

### Phase 2: Linear & Bounce
- [ ] Implement linear and bounce patterns
- [ ] Add spawn assignment in targetManager
- [ ] Test with increasing difficulty

### Phase 3: Wave & Orbit Patterns
- [ ] Implement sine, circular, figure8 patterns
- [ ] Tune amplitude and speed per difficulty level
- [ ] Playtest for readability in both 2D and 3D modes

### Phase 4: Polish
- [ ] Balance spawn probabilities across levels
- [ ] Ensure frame-rate independence with `dt`
- [ ] Final integration and regression testing

## Open Questions
- Should targets change patterns mid-life (e.g., linear → sine after taking damage)?
- Do power-ups affect target movement (e.g., slow effect)?
- Should 3D mode use additional visual cues (tilt, roll) to indicate lateral motion?
