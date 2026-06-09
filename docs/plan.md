# Plan: Combo Bonus

## Feature
Reward the player for destroying multiple targets in rapid succession. A multiplier increases with each consecutive kill, resetting if the player waits too long between hits.

## Status
- [ ] Not started
- [ ] In progress
- [ ] Complete

## Architecture Alignment
Uses existing layers without adding new actions or services:
- **Core**: `seed.js` (new state fields), `config.js` (new tuning parameters)
- **Services**: `playerManager.js` — expands existing `updateScore` to count kills and manage combo timer
- **UI/Renderers**: `score.js` (2D), `3dMode/score.js` (3D), and `gameOverScreen.js` for display

## Approach

### 1. State Shape
Add three fields to `src/core/seed.js` alongside `score` and `health`:

```js
comboCount: 0,
comboTimer: 0,
maxCombo: 0,
```

### 2. Scoring Logic
Modify `updateScore` in `src/services/playerManager.js`:
1. Count freshly destroyed targets (`health === 0`).
2. If kills > 0: increment `comboCount`, set `comboTimer = now + comboTimeout`.
3. If kills === 0 and `now > comboTimer`: reset `comboCount` to 0.
4. Apply multiplier: `score += kills × min(comboCount, comboMultiplierMax)`.
5. Update `maxCombo` if streak exceeded previous best.

**Why here?** `updateScore` runs in the one-frame window after `processBullets` marks targets dead but before `removeTargets` removes them, making it the only place that can count kills reliably.

### 3. Config Parameters
Add to `src/core/config.js`:

```js
comboTimeout: 3000,
comboMultiplierMax: 5,
```

### 4. Visual Feedback

| Mode | UI Element | Behavior |
|------|------------|----------|
| **2D** | `score.js` combo badge | Show "🔥 N×" when `comboCount > 1`. Optional thin timer bar below badge. |
| **3D** | `3dMode/score.js` | Add a second `<Text>` node next to score, mirrors 2D badge. |
| **Game Over** | `gameOverScreen.js` | Display `maxCombo: N` alongside final score for a secondary feel-good metric. |

### 5. Edge Cases

| Scenario | Decision |
|----------|----------|
| **Multi-kill same frame** | `comboCount += killCount`. Treats it as a rapid burst. |
| **Exact timeout boundary** | Extend timer if kill is at or before `comboTimer`; ~50ms tolerance recommended. |
| **Combo + doubleBullet stack?** | Independent. Double bullet = more kills = easier to maintain combo. Combo = higher multiplier. |
| **Damage reset combo?** | No. Keep the feature feel-good rather than punitive. |
| **Enemy collision kills player?** | Only player-bullet kills count toward combo. |

## Files to Modify

| # | File | Change |
|---|------|--------|
| 1 | `src/core/seed.js` | Add `comboCount`, `comboTimer`, `maxCombo` to default state |
| 2 | `src/core/config.js` | Add `comboTimeout: 3000` and `comboMultiplierMax: 5` |
| 3 | `src/services/playerManager.js` | Expand `updateScore` to handle combo logic, return combo state |
| 4 | `src/components/score.js` | Render combo badge when `comboCount > 1` |
| 5 | `src/components/3dMode/score.js` | Add 3D combo text display |
| 6 | `src/components/gameOverScreen.js` | Show `maxCombo` on game over |

## Rollout Plan

### Phase 1: Core State & Logic
- [ ] Update `seed.js` and `config.js`
- [ ] Modify `updateScore` in `playerManager.js`
- [ ] Verify combo increments, score multiples, and timer resets correctly

### Phase 2: UI in 2D Mode
- [ ] Add combo badge to `score.js`
- [ ] Style badge with color/icon
- [ ] Optional: add a shrinking timer bar under the badge

### Phase 3: UI in 3D Mode
- [ ] Add combo text node to `3dMode/score.js`
- [ ] Verify positioning and readability in 3D scene

### Phase 4: Game Over Screen & Polish
- [ ] Display `maxCombo` in `gameOverScreen.js`
- [ ] Regression test across both 2D and 3D modes

## Effort
- **Estimated:** 1–2 days
- **Category:** 🟢 Low (reuses existing state, actions, and components)

---

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
