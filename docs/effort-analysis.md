# Feature Effort Analysis

A breakdown of all 20 features from `docs/FEATURES.md` ranked by implementation difficulty and estimated time. Use this to plan sprints and prioritize work.

---

## Legend

| Effort | Time | Description |
|--------|------|-------------|
| ✅ Already Done | — | Already built or partially built. |
| 🟢 Low | 1–3 days | Touches 1–2 layers. Reuses existing state/actions. Little or no new assets. |
| 🟡 Medium | 3–7 days | Spans multiple layers (state + config + service + UI) or needs new components in both 2D and 3D modes. |
| 🔴 Hard | 1–3 weeks | Introduces entirely new game systems, major asset creation, or deep renderer/input changes. |

---

## ✅ Already Done

| # | Feature | Category | Status | Notes | What It Means (Simple) |
|---|---------|----------|--------|-------|------------------------|
| 2 | **Moving Targets** | Gameplay | ✅ Complete | Static, linear, sine, and zigzag patterns wired into target spawn & tick loop. | Targets fly around instead of staying still, making them harder to hit. |
| 4 | **Power-ups** | Gameplay | ✅ Partial | `doubleBullet` already drops and works. Extra health / shield could be added easily. | Collectible items that give you temporary boosts like double bullets or extra health. |
| 6 | **Extra Lives** | Gameplay | ✅ Partial | Lives are not a separate concept yet; when health hits zero the game ends. Adding a `lives` counter would be low effort. | Gives you multiple chances before the game is truly over, instead of ending on one mistake. |

---

## 🟢 Low Effort (1–3 days each)

These features touch only one or two layers, reuse existing state/actions, and need little or no new assets.

| # | Feature | Category | Why It's Easy | Key Files | What It Means (Simple) |
|---|---------|----------|---------------|-----------|------------------------|
| 14 | **Combo Bonus** | Gameplay | Add a `combo` / `comboTimer` counter to `seed.js`. Increment on hit, reset after a timeout. Multiply score in `PlayerManager.updateScore()`. | `seed.js`, `PlayerManager.js`, `score.js` | Earn extra points for hitting several targets in a row without missing. |
| 3 | **Gets Harder Over Time** | Gameplay | Scale `maxTargets`, `spawn` probability, and `movementTypes[].speed` by `score` or elapsed time in `targetManager.addTargets()`. Pure config math. | `targetManager/index.js`, `config.js` | The longer you play, the faster enemies appear and move. |
| 1 | **Hold to Shoot** | Gameplay | Swap `onClick` for `onMouseDown` / `onMouseUp` + `setInterval` in `gameScreen.js`. Add `isShooting` flag to state. | `gameScreen.js`, `actions.js` | Keep the mouse button pressed down to fire continuously instead of clicking each time. |
| 7 | **High Score List** | Gameplay | `localStorage` already stores `score`. Extend to an array, add sort/cap. New UI overlay only. | `gameService.js`, `gameOverScreen.js` | A leaderboard that remembers your best scores across sessions. |
| 10 | **Explosion Effects** | Looks | 2D: use CSS keyframes triggered on `isHit`. 3D: R3F sprite or `useFrame` particle burst. Hit detection already runs before rendering. | `target.js`, `3dMode/model/target/model.js`, CSS | Targets burst into flames or particles when destroyed for visual feedback. |
| 16 | **Fill the Screen** | Menu | One `document.documentElement.requestFullscreen()` call bound to a key or button. No game logic changes. | New shortcut + `gameScreen.js` | A button or key to make the game take up your entire monitor. |

---

## 🟡 Medium Effort (3–7 days each)

These span multiple layers (state + config + service + UI) or require new components that must work in both 2D and 3D modes.

| # | Feature | Category | Why It's Medium | Key Files | What It Means (Simple) |
|---|---------|----------|-----------------|-----------|------------------------|
| 9 | **Settings Menu** | Menu | New React component overlay, game-state pause logic, persisting settings to `localStorage`, and wiring into existing audio/config. Must block or dim game while open. | New `settingsMenu.js`, `config.js`, `gameScreen.js`, `audioControl.js` | A pause screen where you can change volume, graphics, and controls. |
| 18 | **Save and Continue Later** | Gameplay | Serialize entire state to `localStorage` on exit, hydrate from seed on return. Need to handle timestamp drift for powers/durations. | `seed.js`, `context.js`, `gameService.js` | Close the game and come back another day without losing progress. |
| 19 | **Different Enemy Types** | Gameplay | Add more target configs in `config.js` (fast scout, heavy tank). May need new images/GLTF models. Spawn logic already supports random types. | `config.js`, `targetManager/index.js`, `3dMode/model/target/` | New target designs with unique speed, size, or behavior. |
| 20 | **Radar / Mini Map** | Menu | New overlay component that reads `state.targets` and `state.flight` positions and projects them onto a small canvas/svg. Needs to work above both 2D and 3D scenes. | New `radar.js`, `gameScreen.js`, `3dMode.js` | A small corner map showing where all enemies are so you can plan ahead. |
| 15 | **Badges** | Gameplay | Define badge conditions (e.g., score ≥ 1000, survive 60s). Hook into existing events (`updateScore`, `removeTargets`). Build badge inventory state + overlay UI. | `seed.js`, `PlayerManager.js`, `gameOverScreen.js` | Unlockable achievements for reaching milestones like high scores or survival time. |
| 13 | **Better Weapons** | Gameplay | Spread shot or double-bullet already partially wired. Add a weapon level config: fire rate, spread angle, pass-through bullets. UI for weapon indicator. | `bulletManager.js`, `config.js`, `PlayerManager.js` | Upgradable guns with faster fire, spread shots, or stronger bullets. |

---

## 🔴 Hard Effort (1–3 weeks each)

These introduce entirely new game systems, require major asset creation, or demand deep changes to the renderer or input stack.

| # | Feature | Category | Why It's Hard | Key Files | What It Means (Simple) |
|---|---------|----------|---------------|-----------|------------------------|
| 5 | **Boss Enemy** | Gameplay | New entity class with phased behavior, multi-stage health, special attack patterns, unique 3D model + animation, dedicated spawn logic. Needs its own movement/collision system or heavy reuse with large conditionals. | New `bossManager.js`, `targetManager.js`, `3dMode/model/boss/`, `PlayerManager.js` | A giant, powerful target with special attacks that appears after clearing waves. |
| 8 | **Levels** | Gameplay | New game-state dimension (`level`). Level-up triggers, per-level configs (background, enemies, speed, max targets), level transition screens, save/restore level progress. Replaces current infinite loop with a progression system. | `seed.js`, `config.js`, `masterLoop.js`, `targetManager.js`, `gameScreen.js` | Clear stages with unique backgrounds and enemy sets instead of one endless run. |
| 12 | **Ground or Ocean Below** | Looks | Requires new 3D terrain mesh or infinite-scrolling 2D tile layer. Needs texturing, fog, shaders, and performance tuning in both renderers. | `3dMode/`, new `terrain.js`, `2dMode.css` | A scenic landscape scrolls underneath the action for immersion. |
| 17 | **Phone and Tablet Support** | Controls | Full input layer rewrite (`touchstart` / `touchmove` / `touchend`), responsive layout, pinch-to-zoom prevention, virtual joystick or tap zones, performance testing on mobile GPUs. | `gameScreen.js`, `flight.js`, CSS, device testing | Play the game on mobile devices with touch controls and resized layout. |
| 11 | **3D Positional Sound** | Sound | Swap simple `Audio` for Web Audio API with `PannerNode` or integrate `@react-three/drei` positional audio. Map 2D/3D coordinates to panner positions per bullet/explosion event. Requires audio engine abstraction. | New `audioEngine.js`, `bulletManager.js`, `3dMode/audioClip.js`, `2dMode/` | Sounds come from the direction of the action, like explosions on the left or right. |

---

## Priority Roadmap

Ranked by impact-per-effort. Build in this order.

### Quick Wins
1. **Moving Targets** ⭐ — Already done; just tune probabilities.
2. **Combo Bonus** — Very little code. Adds instant dopamine feedback.
3. **Gets Harder Over Time** — Pure config math. Keeps the game interesting.
4. **Hold to Shoot** — Small UI change, big feel improvement.
5. **Explosion Effects** — CSS / short sprite burst. Makes every hit satisfying.

### Next Priority
6. **Settings Menu** — Unlocks accessibility and player retention.
7. **High Score List** — Leverages existing save logic; competitive hook.
8. **Save and Continue Later** — Session persistence improves retention.
9. **Better Weapons** — Build on existing `doubleBullet` system.
10. **Badges** — Long-term goals when combined with combos and high scores.

### Major Milestones
11. **Boss Enemy** — Most impactful single feature; requires a dedicated sprint.
12. **Levels** — Best done after boss is ready.
13. **Phone and Tablet Support** — Biggest audience expansion; needs real-device testing.
14. **Ground or Ocean Below** — Big visual upgrade; good polish milestone before release.
15. **3D Positional Sound** — Nice polish, but lowest impact relative to effort.
