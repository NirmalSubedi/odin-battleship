import { Ship } from "./index.js";

const ROWS = 10;
const COLS = 10;
const WATER = 0;

class GameBoard {
  #rows;
  #cols;
  #board;
  #water = WATER;
  #fleet = [];

  constructor(rows = ROWS, cols = COLS) {
    this.#rows = rows;
    this.#cols = cols;
    this.#board = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => WATER)
    );
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

  get water() {
    return this.#water;
  }

  get fleet() {
    return this.#fleet;
  }

  #addShipToFleet(length, name) {
    const ship = { name, vessel: new Ship().setLength(length) };
    this.#fleet.push(ship);

    return ship;
  }

  useDefaultFleet() {
    const defaultFleet = [
      ["carrier", 5],
      ["battleship", 4],
      ["cruiser", 3],
      ["submarine", 3],
      ["destroyer", 2],
    ];
    defaultFleet.forEach(([shipName, shipLength]) => {
      this.#addShipToFleet(shipLength, shipName);
    });

    return this;
  }

  #isOccupiedSquare(row, col) {
    return this.peak[row]?.[col] !== WATER;
  }

  #isDeploymentZoneAvailable(row, col, shipLength, direction) {
    const [dr, dc] = direction;
    let currRow = row;
    let currCol = col;

    for (let i = 0; i < shipLength; ++i) {
      if (this.#isOccupiedSquare(currRow, currCol)) return false;

      currRow += dr;
      currCol += dc;
    }

    return true;
  }

  #getDirectionToDeployShip(row, col, ship) {
    const shipLength = ship.vessel.length;
    const directions = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];
    let positionDirection = null;

    for (const direction of directions) {
      if (this.#isDeploymentZoneAvailable(row, col, shipLength, direction)) {
        positionDirection = direction;
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

        const direction = this.#getDirectionToDeployShip(row, col, ship);
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

  #validateCoordinates(coordinates) {
    if (coordinates == null) throw new ReferenceError("Coordinates missing.");
    if (coordinates.length === 1) throw new ReferenceError("Column missing.");

    const [row, col] = coordinates;
    if (!Number.isInteger(row) || !Number.isInteger(col))
      throw new TypeError(`Coordinates must be integers.`);
    if (row < 0 || col < 0 || row >= this.rows || col >= this.cols)
      throw new RangeError("Coordinates are out of bound.");

    return coordinates;
  }

  #decodeDirection(direction = "") {
    switch (direction) {
      case "R":
        return [0, 1];
      case "L":
        return [0, -1];
      case "U":
        return [-1, 0];
      default:
        return [1, 0];
    }
  }

  placeShip(coordinates, length = 1, direction = "", name = "") {
    const [row, col] = this.#validateCoordinates(coordinates);

    const ship = this.#addShipToFleet(length, name);
    const shipId = this.#fleet.length;
    const placementDirection = this.#decodeDirection(direction);

    let placed = false;

    if (this.#isDeploymentZoneAvailable(row, col, length, placementDirection)) {
      this.#deployShip(row, col, ship, shipId, placementDirection);
      placed = true;
    }

    return placed;
  }

  #getShip(shipId) {
    if (shipId <= 0) return null;

    const shipPosition = shipId - 1;
    return this.#fleet[shipPosition];
  }

  isFleetSunk() {
    return this.fleet.every((ship) => ship.vessel.isSunk());
  }

  #hitShip(row, col, ship = {}) {
    const HIT = -1;

    this.#board[row][col] = HIT;
    ship.vessel.hit();

    const sunk = ship.vessel.isSunk();

    return {
      hit: true,
      sunk,
      ship,
    };
  }

  #missShip(row, col) {
    const MISS = -2;
    this.#board[row][col] = MISS;

    return { hit: false };
  }

  receiveAttack(coordinates) {
    const [row, col] = this.#validateCoordinates(coordinates);

    const shipId = this.peak[row][col];
    const ship = this.#getShip(shipId);

    let result;
    const isDuplicateAttack = shipId < 0;
    if (isDuplicateAttack) {
      result = null;
    } else if (ship) {
      result = this.#hitShip(row, col, ship);
    } else {
      result = this.#missShip(row, col);
    }

    return result;
  }
}

export { GameBoard };
