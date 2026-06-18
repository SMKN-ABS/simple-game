# Development Approach

How Simple Game is built, tested, and refactored.

## Tech Stack

- React 17 (class components and function components mixed)
- Create React App + `react-app-rewired` + `customize-cra`
- SCSS for 2D styling
- Three.js + `@react-three/fiber` + `@react-three/drei` for 3D
- `@react-spring/three` for animations
- `leva` for developer controls (intended)
- `@laufire/utils` and `@laufire/resist` for utilities

## Testing

- Jest with React Testing Library
- 100% coverage enforced on branches, functions, lines, statements
- Every source file has a parallel `.test.js`
- `npm run test-dev` for single run; `npm run test-ci` for coverage

## Code Style

- ESLint with `react-app` preset
- Some files disable `max-len`, `complexity`, and `max-lines-per-function` rules inline (see ToDo to remove)

## State Management Conventions

- All state changes are pure functions in `actions.js`.
- Actions receive `context` (state + config + data) and return partial state patches.
- No side effects inside actions; side effects (intervals, audio) live in components or services.

## Refactoring Priorities

1. Remove inline `eslint-disable` statements by simplifying functions.
2. Rename cryptic variables (`rndLength` → `idLength`, etc.).
3. Extract ID generation to a shared `getId` helper.
4. Link `config.js` to `leva` controls for live tuning.
