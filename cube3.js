// Simple function to perform matrix multiplication
let mMult = (A, B) =>
	A.map((row, i) =>
		B[0].map((_, j) => row.reduce((acc, _, n) => acc + A[i][n] * B[n][j], 0))
	);

// Simple function to perform matrix transposition
let mTrans = (m) => m[0].map((x, i) => m.map((x) => x[i]));

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
		[this.c[1], this.c[2]] = [this.c[2], this.c[1]]; // switch correct colors
		this.p = mTrans(mMult(rx(a), mTrans([this.p])))[0].map((x) =>
			Math.round(x)
		); // multiply position by rotation matrix

		// this.p = [Math.round(mx[0][0]), Math.round(mx[1][0]), Math.round(mx[2][0])];
	};

	ty = (a) => {
		[this.c[0], this.c[2]] = [this.c[2], this.c[0]];
		this.p = mTrans(mMult(ry(a), mTrans([this.p])))[0].map((x) =>
			Math.round(x)
		);
	};

	tz = (a) => {
		[this.c[0], this.c[1]] = [this.c[1], this.c[0]];
		this.p = mTrans(mMult(rz(a), mTrans([this.p])))[0].map((x) =>
			Math.round(x)
		);
	};
}

let pieces = []; // unordered list of all the pieces

// Color Scheme
let cs = {
	x: ["O", "R"], // Negative x, positive x
	y: ["Y", "W"], // Negative y, positive y
	z: ["B", "G"], // Negative z, positive z
};

class Cube {
	constructor() {
		this.pieces = [];
		this.init();
	}

	init = () => {
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

	// positive 'a' is clockwise multiplicity of a quarter turn
	// negative 'a' is counterclockwise multiplicity of a quarter turn
	F = (a) => {
		this.turn(
			(x) => x !== undefined,
			(y) => y !== undefined,
			(z) => z === 1,
			"z",
			(-Math.PI / 2) * a
		);
	};

	B = (a) => {
		this.turn(
			(x) => x !== undefined,
			(y) => y !== undefined,
			(z) => z === -1,
			"z",
			(-Math.PI / 2) * a
		);
	};

	U = (a) => {
		this.turn(
			(x) => x !== undefined,
			(y) => y !== 1,
			(z) => z !== undefined,
			"y",
			(-Math.PI / 2) * a
		);
	};

	D = (a) => {
		this.turn(
			(x) => x !== undefined,
			(y) => y !== -1,
			(z) => z !== undefined,
			"y",
			(-Math.PI / 2) * a
		);
	};

	L = (a) => {
		this.turn(
			(x) => x !== 1,
			(y) => y !== undefined,
			(z) => z !== undefined,
			"x",
			(-Math.PI / 2) * a
		);
	};

	R = (a) => {
		this.turn(
			(x) => x !== -1,
			(y) => y !== undefined,
			(z) => z !== undefined,
			"x",
			(-Math.PI / 2) * a
		);
	};

	Fw = (a) => {
		this.turn(
			(x) => x !== undefined,
			(y) => y !== undefined,
			(z) => z >= 0,
			"z",
			(-Math.PI / 2) * a
		);
	};

	Bw = (a) => {
		this.turn(
			(x) => x !== undefined,
			(y) => y !== undefined,
			(z) => z <= 0,
			"z",
			(-Math.PI / 2) * a
		);
	};

	Uw = (a) => {
		this.turn(
			(x) => x !== undefined,
			(y) => y >= 0,
			(z) => z !== undefined,
			"y",
			(-Math.PI / 2) * a
		);
	};

	Dw = (a) => {
		this.turn(
			(x) => x !== undefined,
			(y) => y <= 0,
			(z) => z !== undefined,
			"y",
			(-Math.PI / 2) * a
		);
	};

	Lw = (a) => {
		this.turn(
			(x) => x <= 0,
			(y) => y !== undefined,
			(z) => z !== undefined,
			"x",
			(-Math.PI / 2) * a
		);
	};

	Rw = (a) => {
		this.turn(
			(x) => x >= 0,
			(y) => y !== undefined,
			(z) => z !== undefined,
			"x",
			(-Math.PI / 2) * a
		);
	};
}

// Apply a transformation to pieces that fall under the given conditions

let c = new Cube();
console.log(c.flatten());
c.Fw(-1);
console.log(c.flatten());
