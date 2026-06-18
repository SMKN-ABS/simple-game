# Promotion

Lifecycle promotion reference for Simple Game.

## Stages

```
backlog -> plan -> context -> [implementation] -> docs
```

## Rules

| Transition | Action | Source Cleanup |
|---|---|---|
| `backlog` → `plan` | Move item; expand into approach-comparison format. | **Destructive** — remove from `backlog.md` entirely. |
| `plan` → `context` | Promote selected approach into executable change set in `context/execution.md`. | **Non-destructive** — retain in `plan.md` until finalization. |
| `context` → `docs` | After closure, promote ADRs to `docs/decisions.md` and user docs to `docs/guide.md`. | Clean `context/execution.md` and mark plan item complete. |

## Preconditions

- **Backlog → Plan:** target `plan.md` must not contain active/in-flight items (clean-target rule).
- **Plan → Context:** the selected approach must be explicitly recorded in `plan.md`. Reject ambiguous promotions.
- Do not skip stages unless explicitly requested.

## Closure Checklist (before promotion to docs)

- [ ] Feature implemented and manually tested in both renderers.
- [ ] Unit tests pass (`npm run test-dev`).
- [ ] Coverage passes (`npm run test-ci`).
- [ ] Lint passes (`npm run lint`).
- [ ] Plan item updated with completion status.
- [ ] Context change set updated with closure status.
- [ ] ADR-worthy decisions recorded in `docs/decisions.md`.
- [ ] User-facing docs updated if behaviour changed (`docs/guide.md`).
