# Changelog

All notable changes to this package. Versions follow [semantic versioning](https://semver.org/).

## 1.1.0

### Added

- `slide(board, direction)` returns the new board along with the points earned and where every tile moved. The arcade uses it to keep score and to animate tiles, without the package knowing anything about either.
- `seededRng(seed)` creates a repeatable random function for `spawn`, so a game can be replayed from its seed.

### Changed

- `move` is now a thin wrapper around `slide`. Its results are identical to 1.0.0.

## 1.0.0

First release.

- `move(board, direction)` slides and merges tiles.
- `spawn(board, rng?)` adds a 2 or 4 to a random empty cell.
- `hasMoves(board)` reports whether the game can continue.
- `canMove(board, direction)` reports whether a single direction is a legal move. This replaces the `score` function from the original assignment brief.
- `createBoard(size)` helper, plus TypeScript types.
