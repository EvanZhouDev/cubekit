# CubeKit

A Simple Next-Gen Rubik's Cube Simulator

## Why?

As a speedcubing enthusiast and programmer, I realized that I could give the programming community a Javascript-based Rubik's Cube simulator that could do the basic things simply and the complex things too.

## Installation

Installation is very simple. Simply `cd` into your chosen directory and run this command:

```bash
npm install cubekit
```

Because of the way NPM is structured, cubekit uses CJS module declarations.

As simple as that! Cubekit is ready to use!

## Usage

Cubekit is centralized on simplicity and modularity. You can import everything you need and not bother with everythign else. There are two main classes: `Cube` and `Parser`

### Cube

This is where the main magic happens. Simply declare a new cube, initialize, and you're all set up.

```javascript
let { Cube, StandardMoves, WesternColors } = require("cubekit");
let myCube = new Cube(StandardMoves);
myCube.init(WesternColors);
```

Let's break down the things that are going on here:

#### Color Schemes

Because the Rubik's cube doesn't necessarily have a "definite" color scheme (even though most manufacturers use the Western Color scheme), Cubekit supports custom color scheme support.
The predefined colors are:

- `WesternColors`
- `JapaneseColors`
  You can also define your own colors:

```javascript
const MyAmazingColors = {
	x: ["R", "B"], // Negative x, positive x
	y: ["W", "Y"], // Negative y, positive y
	z: ["L", "M"], // Negative z, positive z
};
```

In theory, what you put in each individual string doesn't matter. I recommend a single letter that represents something.

The positive x axis is pointing towards you. The positive z axis is pointing towards your right. The positive y axis is pointing upwards.

#### Importing Moves

You may notice that we are also using something called `StandardMoves`. Beacuse of the modular structure, you only import what you need. Cubekit currently supports

- `StandardMoves` (R, L, U, D, F, B, and all of their double and inverse moves)
- `WideMoves` (Rw, Lw, Uw, Dw, Fw, Bw, and all of their double and inverse moves)
- `WideMovesUNSAFE` (r, l, u, d, f, b, and all of their double and inverse moves)
  - We do not recommend this one, as the lowercase letters may be confusing