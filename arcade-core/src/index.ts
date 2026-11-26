export type Board = number[][];
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Cell = [row: number, col: number];

export interface TileMove {
	from: Cell;
	to: Cell;
	merged: boolean;
}

export interface SlideResult {
	board: Board;
	score: number;
	moves: TileMove[];
	changed: boolean;
}

export function createBoard(size = 4): Board {
	return Array.from({ length: size }, () => Array(size).fill(0));
}

function lineCells(size: number, direction: Direction, line: number): Cell[] {
	return Array.from({ length: size }, (_, step) => {
		const back = size - 1 - step;
		const cells: Record<Direction, Cell> = {
			left: [line, step],
			right: [line, back],
			up: [step, line],
			down: [back, line]
		};
		return cells[direction];
	});
}

export function slide(board: Board, direction: Direction): SlideResult {
	const size = board.length;
	const next = createBoard(size);
	const moves: TileMove[] = [];
	let score = 0;

	for (let i = 0; i < size; i++) {
		const line = lineCells(size, direction, i);
		let free = 0;
		let mergeInto: Cell | null = null;

		for (const from of line) {
			const value = board[from[0]][from[1]];
			if (value === 0) continue;

			if (mergeInto && next[mergeInto[0]][mergeInto[1]] === value) {
				next[mergeInto[0]][mergeInto[1]] = value * 2;
				score += value * 2;
				moves.push({ from, to: mergeInto, merged: true });
				mergeInto = null;
			} else {
				const to = line[free];
				free += 1;
				next[to[0]][to[1]] = value;
				moves.push({ from, to, merged: false });
				mergeInto = to;
			}
		}
	}

	const changed = next.flat().join() !== board.flat().join();
	return { board: next, score, moves, changed };
}

export function move(board: Board, direction: Direction): Board {
	return slide(board, direction).board;
}

export function canMove(board: Board, direction: Direction): boolean {
	return slide(board, direction).changed;
}

export function hasMoves(board: Board): boolean {
	const directions: Direction[] = ['up', 'down', 'left', 'right'];
	return directions.some((direction) => canMove(board, direction));
}

export function spawn(board: Board, rng: () => number = Math.random): Board {
	const next = board.map((row) => [...row]);
	const empty: Cell[] = [];
	board.forEach((row, r) => {
		row.forEach((value, c) => {
			if (value === 0) empty.push([r, c]);
		});
	});
	if (empty.length === 0) return next;

	const [r, c] = empty[Math.floor(rng() * empty.length)];
	next[r][c] = rng() < 0.9 ? 2 : 4;
	return next;
}

export function seededRng(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export * from './battleship.js';
