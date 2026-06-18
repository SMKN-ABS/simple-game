# Simple Game — Player Guide

## Overview

Simple Game is a vertical scrolling shooter built with React. You control a fighter jet, shoot enemy targets, dodge return fire, and collect power-ups. The game supports 2D (CSS/DOM) and 3D (Three.js via React Three Fiber) rendering modes.

## How to Play

### Starting the Game

- Press **Enter** or click the **Start** button on the Welcome screen.
- Press **H** to open the Help overlay at any time.

### Controls

| Key / Action | What It Does |
|---|---|
| `Enter` | Start the game |
| `P` | Pause or unpause |
| `H` | Show or hide the help screen |
| `M` | Turn sound on or off |
| Move mouse | Steer the plane horizontally |
| Click | Fire bullets (press and hold for continuous fire) |

### Gameplay

- **Fly the Plane** — Move your mouse to steer left and right.
- **Shoot** — Click to fire bullets upward.
- **Enemies Shoot Back** — Targets fire bullets at you.
- **Health Bar** — Your health decreases when hit. When it reaches zero, the game is over.
- **Score** — Earn points for destroying targets. Consecutive kills increase your combo multiplier.
- **Power-ups** — Destroying some targets drops power-ups like double bullets.

### Screens

- **Welcome Screen** — Start and Help buttons.
- **Game Over Screen** — Shows final score, max combo, and a restart option.
- **Help Screen** — Overlay list of all keyboard controls.
- **Pause** — Press `P` to freeze the game at any time.

## Switching Render Mode

Add `?mode=3d` to the URL to play in 3D mode. Default is `?mode=2d`.
