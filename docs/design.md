# Simple Game — Design

Stable architecture, component contracts, and rationale for Simple Game.

## Table of Contents

- [Overview](#overview)
- [Game Concepts](#game-concepts)
- [Key Files and Responsibilities](#key-files-and-responsibilities)
- [Component Layers](#component-layers)
- [Game Loop Contract](#game-loop-contract)
- [State Mutation Contract](#state-mutation-contract)
- [Renderer Duality Contract](#renderer-duality-contract)
- [Dependency Rules](#dependency-rules)

---

## Overview

Simple Game is a vertical scrolling shooter. The player controls a fighter jet at the bottom of the screen, shoots enemy targets descending from above, dodges return fire, and collects power-ups. The game supports both 2D (CSS/DOM) and 3D (Three.js via React Three Fiber) rendering modes toggled by a URL query parameter.

## Game Concepts

- **Player**: A fighter jet that follows the mouse horizontally. Clicking fires bullets upward.
- **Enemies**: Two types of targets (`shooter`, `firingShooter`) spawn at the top and move down.
- **Bullets**: Fired by both player and enemies. Different types (normal, super) deal different damage.
- **Power-ups**: Collectible items like `doubleBullet` that temporarily increase fire rate.
- **Health & Score**: Player health decreases on enemy hit or over time. Score increases when targets are destroyed.
- **Combo**: Hitting multiple targets in rapid succession multiplies score.
- **2D Mode**: Renders elements as CSS-positioned DOM nodes using percentage/viewport units.
- **3D Mode**: Renders elements in a WebGL canvas using GLTF models, spring animations, and positional audio.

## Key Files and Responsibilities

| Path | Purpose |
|------|---------|
| `src/core/config.js` | All game constants: speeds, sizes, probabilities, images, audio settings |
| `src/core/seed.js` | Initial game state object |
| `src/core/actions.js` | All state-mutation action definitions |
| `src/core/context.js` | Runtime holder of state, config, and actions |
| `src/services/ticker/masterLoop.js` | Ordered list of actions run each game tick |
| `src/services/playerManager.js` | Core gameplay logic: collisions, scoring, health, movement |
| `src/services/bulletManager/index.js` | Player and enemy bullet generation |
| `src/services/targetManager/index.js` | Enemy target spawning logic |
| `src/services/targetMovement.js` | Movement pattern math for targets |
| `src/components/gameScreen.js` | Main screen: handles mouse events, starts ticker, selects renderer mode |
| `src/components/2dMode/2dMode.js` | 2D DOM renderer composition |
| `src/components/3dMode/3dMode.js` | 3D WebGL renderer entry via R3F `<Canvas>` |

## Component Layers

| Layer | Description |
|-------|-------------|
| **Core** | Central configuration, initial game state (seed), and state-mutation action definitions. |
| **Services** | Game engine services: game loop ticker, collision/position math, bullet/target generators, player state manager, and input helpers. |
| **2D Renderer** | DOM-based rendering layer using React components styled with CSS/SCSS. |
| **3D Renderer** | WebGL-based rendering layer using `@react-three/fiber` and `@react-three/drei` with GLTF models and spring animations. |
| **Input / UI** | Mouse tracking, keyboard shortcuts, welcome/game-over screens, health bar, score, audio controls, and help overlay. |
| **Assets** | 3D models, audio clips, images, and fonts served from the public folder. |

## Game Loop Contract

The master loop is a fixed-order array of action names. Every tick interval, each action is called in sequence:

```
decreaseHealth
backGroundMovingAxis
addTargets
generateObjects
generatePowers
updateObjects
updatePowers
resetObjects
moveTargets
moveBullets
processBullets
clearHitBullets
updateScore
removeTargets
generateEnemyBullets
processPowers
```

**Invariant:** Actions earlier in the sequence may observe state from later actions of the *previous* tick, but never from later actions of the *current* tick. This makes ordering deterministic and prevents race conditions.

## State Mutation Contract

- Every action is a pure function: `(context) => partialStatePatch`.
- `context` contains `state`, `config`, and optional `data`.
- Returned patches are shallowly merged into the existing state.
- No action may mutate `context.state` directly; it must return a new object.

## Renderer Duality Contract

- Both 2D and 3D renderers read from the **same** `state` object.
- No renderer may write state during render.
- Renderer-specific concerns (DOM positioning, 3D transforms, camera setup) are isolated to their respective component trees.
- UI overlays (welcome, game over, pause, help) live outside the renderer trees so they work identically in both modes.

## Dependency Rules

- Core may not depend on Services or Components.
- Services may depend on Core, but not on Components.
- Components may depend on Core and Services.
- Renderers (2D and 3D) may not depend on each other.
- `context.js` is the only cross-cutting dependency; it is initialized at app startup and passed down.
