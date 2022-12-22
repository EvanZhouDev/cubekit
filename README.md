# CubeKit

A Simple Next-Gen Rubik's Cube Simulator

## Why?

As a speedcubing enthusiast and programmer, I realized that I could give the programming community a Javascript-based Rubik's Cube simulator that could do whatever I wanted it to quickly and easily.

## Installation

Installation is very simple. Simply `cd` into your chosen directory and run this command:

```bash
npm install cubekit
```

Because of the way NPM is structured, cubekit uses CJS module declarations.

As simple as that! Cubekit is ready to use!

## Usage

Cubekit is centralized on simplicity and modularity. You can import everything you need and not bother with everything else. There are two main classes: `Cube` and `Parser`

## Structure

Cubekit is built on a vector and rotation-matrix model of a Rubik's Cube. This idea is originally from [user156217 on Stack Exchange](https://softwareengineering.stackexchange.com/a/262847https:/).

Here's how it works.
	
### The position vector
  The Cube class is composed of different pieces, each with a position vector. In theory, it would be ideal to represent the position $\vec{l}$ as a column matrix, as follows:
	
```math
\vec{l} = \begin{bmatrix}
x\\
y\\
z
\end{bmatrix}
```
However, because expressing column matricies in code is tedious (To access, say, y in `let l = [[x],[y],[z]]`, you need to write `l[1][0]`), I actually represent our vector as a row matrix. We transpose the matrix into a column, do operations, and transpose back to a row when I need to operate on the "column."

### The rotation matricies
By multiplying each vector by a [rotation matrix](https://en.wikipedia.org/wiki/Rotation_matrix), we are able to "turn" the piece. The 3D rotation matricies used are as follows:
	
```math
R_x(\theta) = \begin{bmatrix}
1 & 0 & 0\\
0 & \cos(\theta) & -\sin(\theta)\\
0 & \sin(\theta) & \cos(\theta)
\end{bmatrix}
```

```math
R_y(\theta) = \begin{bmatrix}
\cos(\theta) & 0 & \sin(\theta)\\
0 & 1 & 0\\
-\sin(\theta) & 0 & \cos(\theta)
\end{bmatrix}
```

```math
R_z(\theta) = \begin{bmatrix}
\cos(\theta) & -\sin(\theta) & 0\\
\sin(\theta) & \cos(\theta) & 0\\
0 & 0 & 1
\end{bmatrix}
```
By multiplying these matricies onto our position vector, we are able "turn" our piece!
	
```math
(R_x(\theta)\cdot\vec{l}^\intercal)^\intercal = (\begin{bmatrix}
1 & 0 & 0\\
0 & \cos(\theta) & -\sin(\theta)\\
0 & \sin(\theta) & \cos(\theta)
\end{bmatrix}\cdot\begin{bmatrix}
x & y & z
\end{bmatrix}^\intercal)^\intercal
```

### Moving the "stickers"
Other than just the actual position of the piece, the "stickers" also move. We can simply keep track of all the colors using a simply array. We can let the first index be the x colors, second index the y colors, and the third index the z colors. It would look something like this: `this.colors=[cx, cy, cz]`. In order to turn it properly, the following things have to occur:
- When turning the x axis by 90°, swap the y and z colors
- When turning the y axis by 90°, swap the x and z colors
- When turning the z axis by 90°, swap the x and y colors
<br/>
And there we have it! All our pieces now have their own "turning" logic built in!

### Performing a layer turn
Currently, all our pieces have their own rotation logic. However, what if we want to perform an actual turn? Well, its really quite simple. For example, if we want to perform an "R" turn, all we have to do is select all of the pieces with an x equal to 1, and rotate those pieces along the x axis by 90°. On the inside, each one of the `cube.R()` function calls look like this:
	
```javascript
Cube.turn(
	(x) => x === 1,
	(y) => y !== undefined,
	(z) => z !== undefined,
	"x",
	Math.PI/2
)
```
The first three parameters look at the conditions of what each one of the x, y, and z parameters need to be to do this turn. The 4th parameter tells the function what axis to turn it on, and the last one is simply the angle to turn it, in radians. You can actually use the ```Cube.turn()``` function, as it is public!

### Conclusion
While this algorithm is very programatically simple, there is a good bit of math behind it. However, one of the cons is that searching for a particular piece may be slower than usual. Nonetheless, it is a very elegant approach!
	
## Cube

This is where the main magic happens. Simply declare a new cube, initialize, and you're all set up.

```javascript
let { Cube, StandardMoves, WesternColors } = require("cubekit");
let myCube = new Cube(StandardMoves);
myCube.init(WesternColors);
```

Let's break down the things that are going on here:

### Color Schemes

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

### Importing Moves

You may notice that we are also using something called `StandardMoves`. Beacuse of the modular structure, you only import what you need. Cubekit currently supports

- `StandardMoves` (R, L, U, D, F, B, and all of their double and inverse moves)
- `WideMoves` (Rw, Lw, Uw, Dw, Fw, Bw, and all of their double and inverse moves)
- `WideMovesUNSAFE` (r, l, u, d, f, b, and all of their double and inverse moves)
  - We do not recommend this one, as the lowercase letters may be confusing
