// ! need to add cube rotations!

// Simple function to perform matrix multiplication
let mMult = (A, B) =>
	A.map((row, i) =>
		B[0].map((_, j) => row.reduce((acc, _, n) => acc + A[i][n] * B[n][j], 0))
	);

// Simple function to perform matrix transposition
let mTrans = (m) => m[0].map((_x, i) => m.map((x) => x[i]));

let newSquare2d = (n) => Array.from(Array(n), () => new Array(n));

// Rotation matrix along the x axis for angle 'a'
let rx = (a) => [
	[1, 0, 0],
	[0, Math.cos(a), -Math.sin(a)],
	[0, Math.sin(a), Math.cos(a)],
];

// Rotation matrix along the y axis for angle 'a'
let ry = (a) => [
	[Math.cos(a), 0, Math.sin(a)],
	[0, 1, 0],
	[-Math.sin(a), 0, Math.cos(a)],
];

// Rotation matrix along the z axis for angle 'a'
let rz = (a) => [
	[Math.cos(a), -Math.sin(a), 0],
	[Math.sin(a), Math.cos(a), 0],
	[0, 0, 1],
];

// Each independent piece on the cube; center, corner, and edge
class Piece {
	constructor(p = [0, 0, 0], c = [0, 0, 0]) {
		this.p = p; // position of the piece as a vector
		this.c = c; // colors on the piece as array
	}

	tx = (a) => {
		for (let i = 0; i < Math.abs((a / Math.PI) * 2) % 2; i++) {
			[this.c[1], this.c[2]] = [this.c[2], this.c[1]]; // switch correct colors
		}
		this.p = mTrans(mMult(rx(a), mTrans([this.p])))[0].map((x) =>
			Math.round(x)
		); // multiply position by rotation matrix

		// this.p = [Math.round(mx[0][0]), Math.round(mx[1][0]), Math.round(mx[2][0])];
	};

	ty = (a) => {
		for (let i = 0; (i < Math.abs((a / Math.PI) * 2)) % 2; i++) {
			[this.c[0], this.c[2]] = [this.c[2], this.c[0]];
		}
		this.p = mTrans(mMult(ry(a), mTrans([this.p])))[0].map((x) =>
			Math.round(x)
		);
	};

	tz = (a) => {
		for (let i = 0; i < Math.abs((a / Math.PI) * 2) % 2; i++) {
			[this.c[0], this.c[1]] = [this.c[1], this.c[0]];
		}
		this.p = mTrans(mMult(rz(a), mTrans([this.p])))[0].map((x) =>
			Math.round(x)
		);
	};
}

const WideMoves = {
	Fw: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y !== undefined,
		zCond: (z) => z >= 0,
		axis: "z",
	},
	Bw: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y !== undefined,
		zCond: (z) => z <= 0,
		axis: "z",
	},
	Uw: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y >= 0,
		zCond: (z) => z !== undefined,
		axis: "y",
	},
	Dw: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y <= 0,
		zCond: (z) => z !== undefined,
		axis: "y",
	},
	Lw: {
		xCond: (x) => x <= 0,
		yCond: (y) => y !== undefined,
		zCond: (z) => z !== undefined,
		axis: "x",
	},
	Rw: {
		xCond: (x) => x >= 0,
		yCond: (y) => y !== undefined,
		zCond: (z) => z !== undefined,
		axis: "x",
	},
};

const WideMovesUNSAFE = {
	f: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y !== undefined,
		zCond: (z) => z >= 0,
		axis: "z",
	},
	b: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y !== undefined,
		zCond: (z) => z <= 0,
		axis: "z",
	},
	u: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y >= 0,
		zCond: (z) => z !== undefined,
		axis: "y",
	},
	d: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y <= 0,
		zCond: (z) => z !== undefined,
		axis: "y",
	},
	l: {
		xCond: (x) => x <= 0,
		yCond: (y) => y !== undefined,
		zCond: (z) => z !== undefined,
		axis: "x",
	},
	r: {
		xCond: (x) => x >= 0,
		yCond: (y) => y !== undefined,
		zCond: (z) => z !== undefined,
		axis: "x",
	},
};

const StandardMoves = {
	F: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y !== undefined,
		zCond: (z) => z === 1,
		axis: "z",
	},
	B: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y !== undefined,
		zCond: (z) => z === -1,
		axis: "z",
	},
	U: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y === 1,
		zCond: (z) => z !== undefined,
		axis: "y",
	},
	D: {
		xCond: (x) => x !== undefined,
		yCond: (y) => y === -1,
		zCond: (z) => z !== undefined,
		axis: "y",
	},
	L: {
		xCond: (x) => x === -1,
		yCond: (y) => y !== undefined,
		zCond: (z) => z !== undefined,
		axis: "x",
	},
	R: {
		xCond: (x) => x === 1,
		yCond: (y) => y !== undefined,
		zCond: (z) => z !== undefined,
		axis: "x",
	},
};

const WesternColors = {
	x: ["O", "R"], // Negative x, positive x
	y: ["Y", "W"], // Negative y, positive y
	z: ["B", "G"], // Negative z, positive z
};

const JapaneseColors = {
	x: ["O", "R"], // Negative x, positive x
	y: ["B", "W"], // Negative y, positive y
	z: ["Y", "G"], // Negative z, positive z
};

class Cube {
	#initialized = false;
	constructor(...moveSet) {
		this.pieces = [];
		if (moveSet.length == 0) {
			console.info(
				"No moves have been added to your current cube. Add moves after setup by using 'Cube.registerMoveset()'"
			);
		}
		this.registerMoveset(...moveSet);
		// Color Scheme
		this.cs;
	}

	registerMoveset(...moveSet) {
		for (let j = 0; j < moveSet.length; j++) {
			let moves = moveSet[j];
			for (let i = 0; i < Object.keys(moves).length; i++) {
				let mn = Object.keys(moves)[i];
				let mi = moves[mn];
				this[mn] = (a) => {
					this.turn(mi.xCond, mi.yCond, mi.zCond, mi.axis, (-Math.PI / 2) * a);
				};
			}
		}
	}

	init = (cs = WesternColors) => {
		if (!this.#initialized) {
			this.cs = cs;
			// initialize all of the necessary things to simulate a cube
			for (let x = -1; x <= 1; x++) {
				// loop through all the possible locations on a 3x3
				for (let y = -1; y <= 1; y++) {
					for (let z = -1; z <= 1; z++) {
						let cx = x == -1 ? cs.x[0] : x == 1 ? cs.x[1] : undefined,
							cy = y == -1 ? cs.y[0] : y == 1 ? cs.y[1] : undefined,
							cz = z == -1 ? cs.z[0] : z == 1 ? cs.z[1] : undefined;
						if (!(x == 0 && y == 0 && z == 0)) {
							this.pieces.push(new Piece([x, y, z], [cx, cy, cz]));
						}
					}
				}
			}
			this.#initialized = true;
		} else {
			console.error("Cannot initialize the same Rubik's Cube twice.");
		}
	};

	flatten = () => {
		let returnVal = {
			// ew bad code fix me D:
			F: newSquare2d(3),
			B: newSquare2d(3),
			L: newSquare2d(3),
			R: newSquare2d(3),
			U: newSquare2d(3),
			D: newSquare2d(3),
		};
		for (let i = 0; i < this.pieces.length; i++) {
			let cPiece = this.pieces[i]; // current piece
			let p = cPiece.p;
			if (cPiece.p[0] == 1) {
				returnVal.R[2 - (p[1] + 1)][2 - (p[2] + 1)] = cPiece.c[0];
			} else if (cPiece.p[0] == -1) {
				returnVal.L[2 - (p[1] + 1)][p[2] + 1] = cPiece.c[0];
			}
			if (cPiece.p[1] == 1) {
				returnVal.U[p[2] + 1][p[0] + 1] = cPiece.c[1];
			} else if (cPiece.p[1] == -1) {
				returnVal.D[2 - (p[2] + 1)][p[0] + 1] = cPiece.c[1];
			}
			if (cPiece.p[2] == 1) {
				returnVal.F[2 - (p[1] + 1)][p[0] + 1] = cPiece.c[2];
			} else if (cPiece.p[2] == -1) {
				returnVal.B[p[1] + 1][2 - (p[0] + 1)] = cPiece.c[2];
			}
		}
		return returnVal;
	};

	// Base net
	//     WWW
	//     W^W
	//     WWW
	// OOO GGG RRR BBB
	// O^O G^G R^R B^B
	// OOO GGG RRR BBB
	//     YYY
	//     Y^Y
	//     YYY
	// All side 2D arrays are read from the direction of the arrows above for the flatten function
	turn = (
		xCond = (x) => x !== undefined,
		yCond = (y) => y !== undefined,
		zCond = (z) => z !== undefined,
		axis = "y",
		angle = Math.PI / 2
	) => {
		// Loop through the pieces
		for (let i = 0; i < this.pieces.length; i++) {
			let cPiece = this.pieces[i]; // current piece
			if (xCond(cPiece.p[0]) && yCond(cPiece.p[1]) && zCond(cPiece.p[2])) {
				// Given that all conditions are met turn on the correct axis
				axis == "x"
					? cPiece.tx(angle)
					: axis == "y"
					? cPiece.ty(angle)
					: axis == "z"
					? cPiece.tz(angle)
					: 0;
			}
		}
	};

	isSolved = () => {
		let flattened = this.flatten();
		for (let i = 0; i < Object.keys(flattened).length; i++) {
			let face = Object.keys(flattened)[i];
			for (let y = 0; y < flattened[face].length; y++) {
				for (let x = 0; x < flattened[face][y].length; x++) {
					if (flattened[face][y][x] !== flattened[face][0][0]) {
						return false;
					}
				}
			}
		}
		return true;
	};
}

const Sledgehammer = [
	{
		name: "sledgehammer",
		algorithm: "R' F R F'",
	},
	{
		name: "inverseSledgehammer",
		algorithm: "R F' R' F",
	},
];

class Parser {
	constructor(cube, ...algSets) {
		this.cube = cube;
		this.defAlgs = {};
		this.register(...algSets);
	}

	run(algorithm) {
		if (algorithm[0] !== "$") {
			let algArr = algorithm.split(" ");
			let allowedMoves = [
				"R",
				"L",
				"U",
				"D",
				"B",
				"F",
				"r",
				"l",
				"u",
				"d",
				"b",
				"f",
				"x",
				"y",
				"z",
			];
			for (let i = 0; i < algArr.length; i++) {
				let currentNotation = algArr[i];
				let multiplier = currentNotation.includes("'") ? -1 : 1;
				currentNotation = currentNotation.replace("'", "");
				let wWide = currentNotation[1] == "w";
				let lowerWide = false;
				currentNotation = currentNotation.replace("w", "");
				if (allowedMoves.includes(currentNotation[0])) {
					// normal move
					if (currentNotation[0] === currentNotation[0].toLowerCase()) {
						lowerWide = true;
						currentNotation =
							currentNotation[0].toUpperCase() +
							currentNotation.substr(1, currentNotation.length - 1);
					}
					let moveType = currentNotation[0];
					if (lowerWide) {
						currentNotation = currentNotation.slice(lowerWide);
					} else {
						currentNotation = currentNotation.slice(wWide + 1);
					}
					let parsedNum = Number.parseInt(currentNotation);
					let turnMult = isNaN(parsedNum) ? 1 : parsedNum;
					this.cube[moveType + (wWide || lowerWide ? "w" : "")](
						multiplier * turnMult
					);
				} else {
					console.error("Cannot parse move " + currentNotation);
				}
			}
		} else {
			this.run(this.defAlgs[algorithm.substring(1, algorithm.length)]);
		}
	}

	registerSet(...algSets) {
		// console.log(algSets);
		for (let i = 0; i < algSets.length; i++) {
			let thisAlgset = algSets[i];
			for (let j = 0; j < thisAlgset.length; j++) {
				let thisAlg = thisAlgset[j];
				if (this.defAlgs[thisAlg] !== undefined) {
					console.info(thisAlg.name + " has already been registered.");
				} else {
					this.defAlgs[thisAlg.name] = thisAlg.algorithm;
				}
			}
		}
	}
	register(...algList) {
		// console.log(algSets);
		for (let j = 0; j < algList.length; j++) {
			let thisAlg = algList[j];
			if (this.defAlgs[thisAlg] !== undefined) {
				console.info(thisAlg.name + " has already been registered.");
			} else {
				this.defAlgs[thisAlg.name] = thisAlg.algorithm;
			}
		}
	}
}

module.exports = {
	WesternColors: WesternColors,
	JapaneseColors: JapaneseColors,
	Sledgehammer: Sledgehammer,
	Cube: Cube,
	Parser: Parser,
	StandardMoves: StandardMoves,
	WideMoves: WideMoves,
	WideMovesUNSAFE: WideMovesUNSAFE,
};
