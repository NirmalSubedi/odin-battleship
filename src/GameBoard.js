import { Ship } from "./Ship.js";

const ROWS = 10;
const COLS = 10;
const WATER = 0;

class GameBoard {
  #rows;
  #cols;
  #board;
  #fleet = [];

  constructor(rows = ROWS, cols = COLS) {
    this.#rows = rows;
    this.#cols = cols;
    this.#board = Array.from({ length: rows }, () => Array(cols).fill(WATER));
  }

  get rows() {
    return this.#rows;
  }

  get cols() {
    return this.#cols;
  }

  get peak() {
    return this.#board;
  }

  get fleet() {
    return this.#fleet;
  }

  useDefaultFleet() {
    this.#fleet = [
      { name: "carrier", vessel: new Ship().setLength(5) },
      { name: "battleship", vessel: new Ship().setLength(4) },
      { name: "cruiser", vessel: new Ship().setLength(3) },
      { name: "submarine", vessel: new Ship().setLength(3) },
      { name: "destroyer", vessel: new Ship().setLength(2) },
    ];
  }

  #isOccupiedSquare(row, col) {
    return this.peak[row]?.[col] !== WATER;
  }

  #getDirectionToPositionShip(row, col, ship) {
    const shipLength = ship.vessel.length;
    const directions = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];
    let positionDirection = null;

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
        positionDirection = [dr, dc];
        break;
      }
    }

    return positionDirection;
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
      this.peak[currRow][currCol] = token;

      currRow += dirRow;
      currCol += dirCol;
    }
  }

  #scoutBoard() {
    const LONGEST_SHIP = 0;
    const longestShipLength = this.#fleet
      .toSorted((shipA, shipB) => shipB.vessel.length - shipA.vessel.length)
      .at(LONGEST_SHIP).length;
    if (longestShipLength > this.rows || longestShipLength > this.cols)
      throw new Error("Board is too small for the longest ship.");

    const boardSpace = this.rows * this.cols;
    const numberOfShips = this.#fleet.length;
    const fleetSpace = longestShipLength * numberOfShips;
    const WATER_RATIO = 1;
    const waterSpace = fleetSpace * WATER_RATIO;
    if (boardSpace < fleetSpace + waterSpace)
      throw new Error("Board is too small for the fleet.");
  }

  deployTheFleet() {
    if (this.#fleet.length === 0) throw new Error("Fleet is empty.");
    this.#scoutBoard();

    this.#fleet.forEach((ship, index) => {
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

  clearFleet() {
    this.#fleet.length = 0;
    return this;
  }
}

export { GameBoard };
