import { Cube, StandardMoves, JapaneseColors } from "./cube3";

let myCube = new Cube(StandardMoves); // Add a move set to the cube
myCube.init(JapaneseColors); // Initialize the cube with a specific color scheme

myCube.F(1); // Turn the cube!
