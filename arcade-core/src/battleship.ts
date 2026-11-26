export const BOARD_SIZE = 10;

export type ShipName = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

export const FLEET: readonly { name: ShipName; size: number }[] = [
	{ name: 'carrier', size: 5 },
	{ name: 'battleship', size: 4 },
	{ name: 'cruiser', size: 3 },
	{ name: 'submarine', size: 3 },
	{ name: 'destroyer', size: 2 }
];

export interface Ship {
	name: ShipName;
	size: number;
	x: number;
	y: number;
	horizontal: boolean;
}

export interface Shot {
	x: number;
	y: number;
	hit: boolean;
}

export interface BattleshipBoard {
	ships: Ship[];
	shots: Shot[];
}

function inBounds(x: number, y: number): boolean {
	return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

export function shipCells(ship: Ship): [number, number][] {
	return Array.from({ length: ship.size }, (_, i): [number, number] =>
		ship.horizontal ? [ship.x + i, ship.y] : [ship.x, ship.y + i]
	);
}

export function canPlaceShip(ships: Ship[], ship: Ship): boolean {
	const cells = shipCells(ship);
	if (!cells.every(([x, y]) => inBounds(x, y))) return false;

	const taken = new Set(
		ships
			.filter((other) => other.name !== ship.name)
			.flatMap(shipCells)
			.map(([x, y]) => `${x},${y}`)
	);
	return cells.every(([x, y]) => !taken.has(`${x},${y}`));
}

export function isValidFleet(ships: Ship[]): boolean {
	if (!Array.isArray(ships) || ships.length !== FLEET.length) return false;

	return FLEET.every(({ name, size }) => {
		const matches = ships.filter((ship) => ship.name === name);
		return matches.length === 1 && matches[0].size === size && canPlaceShip(ships, matches[0]);
	});
}

export function createRandomBoard(random: () => number = Math.random): BattleshipBoard {
	const ships: Ship[] = [];

	for (const { name, size } of FLEET) {
		for (let attempt = 0; ; attempt++) {
			if (attempt === 1000) throw new Error('Could not place the fleet; is `random` returning varied numbers?');

			const horizontal = random() < 0.5;
			const ship: Ship = {
				name,
				size,
				horizontal,
				x: Math.floor(random() * (horizontal ? BOARD_SIZE - size + 1 : BOARD_SIZE)),
				y: Math.floor(random() * (horizontal ? BOARD_SIZE : BOARD_SIZE - size + 1))
			};
			if (canPlaceShip(ships, ship)) {
				ships.push(ship);
				break;
			}
		}
	}

	return { ships, shots: [] };
}
