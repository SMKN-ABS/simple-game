# Simple Game — Implementation Notes

## ToDo (from legacy readme.md)

* Rename the variables.
* Fixed the flight size.
* Generate the id for createCloud and makeBullet by getId.
* Rename rndLength to idLength.
* Disable user select for game component, example in gameScreen scss.
* Remove the eslint statement.
* Setting.
* Trigger fire when mouseDown.
* Target movement.
* Pause button.
* Keyboard shortcuts.

* dev
 * Link config to leva controls.

* 3D
 * Material color for scene.
 * Positional audio.
 * Cloud shadow with directionalLight.
 * Cloud attributes.
 * Flight scale.
 * Find audio clips.
 * Bullet model.
 * healthBar and score.
 * Terrain.

## Issues

* screen resize issues in 3d.

## Legacy Build Notes

This project was bootstrapped with Create React App and later rewired with `react-app-rewired` and `customize-cra`.

```bash
npm start   # development server
npm test    # test runner (watch)
npm run test-dev   # single run
npm run test-ci    # single run with coverage
npm run build # production build
npm run lint  # eslint
```

Coverage threshold is set to 100% on branches, functions, lines, and statements.
