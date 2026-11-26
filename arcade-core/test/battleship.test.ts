import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
	FLEET,
	canPlaceShip,
	createRandomBoard,
	isValidFleet,
	seededRng,
	type Ship
} from '../dist/index.js';

const fleet: Ship[] = FLEET.map(({ name, size }, row) => ({ name, size, x: 0, y: row, horizontal: true }));

describe('createRandomBoard', () => {
	it('places all five ships legally, with no shots', () => {
		for (let seed = 0; seed < 50; seed++) {
			const random = createRandomBoard(seededRng(seed));
			assert.equal(isValidFleet(random.ships), true, `seed ${seed}`);
			assert.deepEqual(random.shots, []);
		}
	});

	it('is repeatable with the same random function', () => {
		assert.deepEqual(createRandomBoard(seededRng(7)), createRandomBoard(seededRng(7)));
		assert.notDeepEqual(createRandomBoard(seededRng(7)), createRandomBoard(seededRng(8)));
	});

	it('gives up instead of looping forever on a broken random function', () => {
		assert.throws(() => createRandomBoard(() => 0), /Could not place/);
	});
});

describe('canPlaceShip and isValidFleet', () => {
	it('rejects ships that leave the board', () => {
		const carrier = { ...fleet[0], x: 6 };
		assert.equal(canPlaceShip(fleet, carrier), false);
		assert.equal(canPlaceShip(fleet, { ...fleet[0], x: 5 }), true);
		assert.equal(canPlaceShip(fleet, { ...fleet[0], y: -1 }), false);
	});

	it('rejects overlaps but lets a ship move over its own old spot', () => {
		assert.equal(canPlaceShip(fleet, { ...fleet[4], y: 0 }), false);
		assert.equal(canPlaceShip(fleet, { ...fleet[4], x: 1 }), true);
	});

	it('accepts exactly the five ships', () => {
		assert.equal(isValidFleet(fleet), true);
		assert.equal(isValidFleet(fleet.slice(1)), false);
		assert.equal(isValidFleet([...fleet.slice(0, 4), { ...fleet[3] }]), false);
		assert.equal(isValidFleet([...fleet.slice(0, 4), { ...fleet[4], size: 3 }]), false);
		assert.equal(isValidFleet([...fleet.slice(0, 4), { ...fleet[4], y: 0 }]), false);
	});
});
