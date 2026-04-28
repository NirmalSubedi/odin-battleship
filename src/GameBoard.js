import { Ship } from "./Ship.js";

const ROWS = 10;
const COLS = 10;
const WATER = 0;

class GameBoard {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(WATER));

  fleet = [
    { name: "carrier", vessel: new Ship().setLength(5) },
    { name: "battleship", vessel: new Ship().setLength(4) },
    { name: "cruiser", vessel: new Ship().setLength(3) },
    { name: "submarine", vessel: new Ship().setLength(3) },
    { name: "destroyer", vessel: new Ship().setLength(2) },
  ];

  #isOccupiedSquare(row, col) {
    return this.board[row]?.[col] !== WATER;
  }

  #getDirectionToPositionShip(row, col, ship) {
    const shipLength = ship.vessel.length;
    const directions = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];
    let direction = null;

    for (const [dr, dc] of directions) {
      let shipIsPlacable = true;
      let currRow = row;
      let currCol = col;

      for (let i = 0; i < shipLength; ++i) {
        if (this.#isOccupiedSquare(currRow, currCol)) {
          shipIsPlacable = false;
          break;
        }
        currRow += dr;
        currCol += dc;
      }

      if (shipIsPlacable) {
        direction = [dr, dc];
        break;
      }
    }

    return direction;
  }

  #getRandomCoordinate() {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);

    return [row, col];
  }

  #deployShip(row, col, ship, shipId, direction) {
    const [dirRow, dirCol] = direction;
    const shipLength = ship.vessel.length;

    const token = shipId;
    let currRow = row;
    let currCol = col;

    for (let i = 0; i < shipLength; ++i) {
      this.board[currRow][currCol] = token;

      currRow += dirRow;
      currCol += dirCol;
    }
  }

  deployTheFleet() {
    this.fleet.forEach((ship, index) => {
      const shipId = index + 1;
      let shipHasNotBeenDeployed = true;

      while (shipHasNotBeenDeployed) {
        const coordinates = this.#getRandomCoordinate();
        const [row, col] = coordinates;
        if (this.#isOccupiedSquare(row, col)) continue;

        const direction = this.#getDirectionToPositionShip(row, col, ship);
        const missingDirection = direction === null;
        if (missingDirection) continue;

        this.#deployShip(row, col, ship, shipId, direction);
        shipHasNotBeenDeployed = false;
      }
    });
  }
}

export { GameBoard };
