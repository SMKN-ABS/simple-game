# Simple Game — Decisions

## DEC-001: Dual Rendering Modes (2D DOM + 3D WebGL)

**Context:** The game started as a 2D CSS-based shooter. A 3D renderer was added later to explore WebGL via React Three Fiber.

**Decision:** Maintain both renderers as first-class citizens with a shared game-state layer beneath them. Renderers consume identical state; no renderer-specific state lives in core.

**Consequences:**
- All game logic (physics, scoring, spawning) is renderer-agnostic.
- UI components must be duplicated or abstracted for both 2D and 3D.
- Testing and visual parity cost is higher but both modes remain interchangeable.

---

## DEC-002: Centralized State via `context` Pattern

**Context:** The game needs a single source of truth for all runtime entities.

**Decision:** Use a single `context.js` object that holds state, config, actions, and is passed down through the React tree. State mutations are pure functions dispatched by action name.

**Consequences:**
- All state changes are traceable to named actions.
- The `masterLoop` can be expressed as an ordered array of action names.
- Debugging is simpler because every tick is a predictable sequence of action calls.

---

## DEC-003: 100% Test Coverage Threshold

**Context:** The project uses Jest with `collectCoverageFrom` set to `./src/**/*.js`.

**Decision:** Enforce 100% on branches, functions, lines, and statements.

**Consequences:**
- Every new file and path must be exercised by tests.
- Refactoring requires updating or adding tests.
- Edge cases are surfaced early because coverage gaps are treated as errors.
