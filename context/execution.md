# Execution Context

Active change set, validation expectations, and closure status for the current implementation cycle.

## Selected Plan Reference

Derived from `plan.md` — no single feature is currently selected for active development.
Initial cycle focus is **scaffolding deliberate-dev structures** (see context/readme.md Active Change Set #1).

---

## Active Change Set

| # | Change | Status | Files |
|---|--------|--------|-------|
| 1 | Initialize deliberate-dev lifecycle artefacts from existing project docs/code | Complete | `backlog.md`, `plan.md`, `context/`, `docs/` |
| 2 | Create `context/execution.md` for execution-state tracking | In progress | `context/execution.md` (this file) |

---

## Next Up (pending promotion from plan)

When a plan item is promoted into active execution, move its detail here and update closure checks below.

### Candidate: Hold to Shoot
- Add `isShooting` to state
- Wire `onMouseDown`/`onMouseUp` in `gameScreen.js`
- Generate bullets while holding

### Candidate: Gets Harder Over Time
- Scale `maxTargets` and movement speed by score
- Add difficulty constants to `config.js`

### Candidate: Explosion Effects
- Add `explosions` state array
- Render in 2D and 3D modes
- Auto-remove after duration

---

## Validation Expectations

- All new/modified files must pass `npm run lint`.
- Coverage threshold must remain at 100% branches/functions/lines/statements.
- Any behavioural change must include corresponding `.test.js` updates.
- Both 2D and 3D renderers must remain functional after changes.

---

## Closure Checklist

- [ ] Feature implemented and manually tested in both renderers.
- [ ] Unit tests pass (`npm run test-dev`).
- [ ] Coverage passes (`npm run test-ci`).
- [ ] Lint passes (`npm run lint`).
- [ ] Plan item updated with completion status.
- [ ] Context change set updated with closure status.
- [ ] Any ADR-worthy decisions recorded in `docs/decisions.md`.
- [ ] User-facing docs updated if behaviour changed (`docs/guide.md`).
