// import {
// 	Cube,
// 	Parser,
// 	StandardMoves,
// 	JapaneseColors,
// 	Sledgehammer,
// } from "./cube3";

let {
	Cube,
	StandardMoves,
	JapaneseColors,
	Parser,
	Sledgehammer,
} = require("./cube3");

let myCube = new Cube(StandardMoves); // Add a move set to the cube
myCube.init(JapaneseColors); // Initialize the cube with a specific color scheme

// Turn the cube with the moves that you have defined...
myCube.R(1); // Normal R move

// Make sure your cube has changed...
console.log(myCube.flatten());

myCube.R(-1); // Inverse R move (R')

// That's cool, but what if we want to parse it from a string?
// No problem.
let parser = new Parser(myCube); // Give your parser the cube object

parser.run("R U R' U'"); // Just do this!
parser.run("U R U' R'"); // Or this...(inverse of above)

console.log(myCube.flatten()); // Should be solved...:)

// But what if we want to define something to use later? No problem.
parser.register({
	name: "checker",
	algorithm: "R2 L2 U2 D2 F2 B2",
});

// Execute with the same run function. Just put a "$" in front of the name!
parser.run("$checker");

parser.run("$checker"); // and undo that...

// In order to register a set of algorithms, use the registerSet function.
// You can use a pre-defined set of algorithms like the Sledgehammer!
parser.registerSet(Sledgehammer);

parser.run("$sledgehammer");
console.log(myCube.flatten()); // Check it out!
