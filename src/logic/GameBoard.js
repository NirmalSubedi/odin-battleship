import { Ship } from "./index.js";

const ROWS = 10;
const COLS = 10;
const WATER = 0;
const MISS = -1;
const HIT = -2;
const SUNK = -3;

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

  #getShip(shipId) {
    if (shipId === undefined) throw new Error("Ship Id is missing.");
    if (!Number.isInteger(shipId))
      throw new TypeError("Ship Id should be a integer.");

    if (shipId <= 0) return;

    const shipPosition = shipId - 1;

    return this.#fleet[shipPosition];
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

  #validateDirection(direction = []) {
    if (!Array.isArray(direction))
      throw new TypeError("Direction must be an array.");
    if (direction.length < 2)
      throw new ReferenceError("Direction row and column are missing");

    const [dirRow, dirCol] = direction;
    if (!Number.isInteger(dirRow) || !Number.isInteger(dirCol))
      throw new TypeError(`Direction row and column must be integers.`);

    if (!(Math.abs(dirRow) === 1 || dirRow === 0))
      throw new Error("Row direction should be -1, 0, or 1.");
    if (!(Math.abs(dirCol) === 1 || dirCol === 0))
      throw new Error("Column direction should be -1, 0, or 1.");

    return direction;
  }

  #addShipToFleet(length, name) {
    const ship = new Ship().setLength(length).setName(name);
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

  #isWater(row, col) {
    return this.peak[row]?.[col] === this.water;
  }

  #canDraw(coordinates, length, direction) {
    const [dr, dc] = this.#validateDirection(direction);
    let [currRow, currCol] = coordinates;

    for (let i = 0; i < length; ++i) {
      if (!this.#isWater(currRow, currCol)) return false;

      currRow += dr;
      currCol += dc;
    }

    return true;
  }

  #getRandomDirection(coordinates, shipId) {
    const ship = this.#getShip(shipId);
    const directions = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];

    const randomDirections = [];
    directions.forEach(() => {
      const randomIndex = Math.floor(Math.random() * directions.length);
      const randomDirection = directions[randomIndex];

      randomDirections.push(randomDirection);
      directions.splice(randomIndex, 1);
    });

    let positionDirection = null;

    for (const direction of randomDirections) {
      if (this.#canDraw(coordinates, ship.length, direction)) {
        positionDirection = direction;
        break;
      }
    }

    return positionDirection;
  }

  #getRandomCoordinate() {
    const row = Math.floor(Math.random() * this.rows);
    const col = Math.floor(Math.random() * this.cols);

    return [row, col];
  }

  #storePlacement(coordinates, shipId, placementDirection) {
    const ship = this.#getShip(shipId);

    ship.head = coordinates;
    ship.placementDirection = this.#validateDirection(placementDirection);
  }

  #draw(startCoordinates, item, direction, length) {
    if (this.#getShip(item)) {
      this.#storePlacement(startCoordinates, item, direction);
    }

    const [dr, dc] = direction;
    let [cr, cc] = startCoordinates;

    for (let i = 0; i < length; ++i) {
      this.#board[cr][cc] = item;

      cr += dr;
      cc += dc;
    }
  }

  #scoutBoard() {
    const LONGEST_SHIP = 0;
    const longestShipLength = this.#fleet
      .toSorted((shipA, shipB) => shipB.length - shipA.length)
      .at(LONGEST_SHIP).length;

    if (longestShipLength > this.rows || longestShipLength > this.cols)
      throw new RangeError("Board is too small for the longest ship.");

    const boardSpace = this.rows * this.cols;
    const numberOfShips = this.#fleet.length;
    const fleetSpace = longestShipLength * numberOfShips;
    const WATER_RATIO = 1;
    const waterSpace = fleetSpace * WATER_RATIO;

    if (boardSpace < fleetSpace + waterSpace)
      throw new Error(
        "Board does not have more than 50% water space available the fleet."
      );
  }

  placeFleetRandomly() {
    if (this.#fleet.length === 0) throw new ReferenceError("Fleet is empty.");
    this.#scoutBoard();

    this.#fleet.forEach((ship, index) => {
      const shipId = index + 1;
      let shipHasNotBeenPlaced = ship.placementDirection === undefined;

      while (shipHasNotBeenPlaced) {
        const coordinates = this.#getRandomCoordinate();
        const [row, col] = coordinates;

        if (!this.#isWater(row, col)) continue;

        const direction = this.#getRandomDirection(coordinates, shipId);
        const missingDirection = direction === null;

        if (missingDirection) continue;

        this.#draw(coordinates, shipId, direction, ship.length);
        shipHasNotBeenPlaced = false;
      }
    });

    return this;
  }

  clearFleet() {
    this.#fleet.length = 0;

    return this;
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
    this.#validateCoordinates(coordinates);
    this.#addShipToFleet(length, name);

    const shipId = this.#fleet.length;
    const ship = this.#getShip(shipId);
    const placementDirection = this.#decodeDirection(direction);

    let placed = false;

    if (this.#canDraw(coordinates, ship.length, placementDirection)) {
      this.#draw(coordinates, shipId, placementDirection, ship.length);
      placed = true;
    }

    return placed;
  }

  isFleetSunk() {
    return this.fleet.every((ship) => ship.isSunk());
  }

  #hitShip(row, col, shipId) {
    const ship = this.#getShip(shipId);

    ship.hit();
    this.#board[row][col] = HIT;

    const sunk = ship.isSunk();
    if (sunk) this.#sinkAllShipParts(shipId);

    return {
      hit: true,
      sunk,
      ship,
    };
  }

  #sinkAllShipParts(shipId) {
    const ship = this.#getShip(shipId);

    const coordinates = ship.head;
    const direction = ship.placementDirection;

    this.#draw(coordinates, SUNK, direction, ship.length);
  }

  #missShip(row, col) {
    this.#board[row][col] = MISS;

    return { hit: false };
  }

  receiveAttack(coordinates) {
    const [row, col] = this.#validateCoordinates(coordinates);

    const shipId = this.peak[row][col];
    const ship = this.#getShip(shipId);

    let result;
    const ATTACK = true;
    const atPreviousAttack = shipId < 0;
    const onShip = typeof ship !== "undefined";

    switch (ATTACK) {
      case atPreviousAttack:
        result = null;
        break;

      case onShip:
        result = this.#hitShip(row, col, shipId);
        break;

      default:
        result = this.#missShip(row, col);
    }

    return result;
  }

  randomAttack() {
    return this.receiveAttack(this.#getRandomCoordinate());
  }

  rotateShipAt(coordinates, counterClockWise = false) {
    const [row, col] = this.#validateCoordinates(coordinates);

    const shipId = this.#board[row][col];
    const ship = this.#getShip(shipId);

    if (ship === undefined) return false;

    const [dirRow, dirCol] = ship.placementDirection;
    const isShipPlacedHorizontally = Math.abs(dirRow) === 0;
    let rotatedRow;
    let rotatedCol;

    if (counterClockWise) {
      rotatedRow = isShipPlacedHorizontally ? -dirCol : dirCol;
      rotatedCol = dirRow;
    } else {
      rotatedRow = dirCol;
      rotatedCol = isShipPlacedHorizontally ? dirRow : -dirRow;
    }

    const rotatedDirection = [rotatedRow, rotatedCol];
    let [pivotRow, pivotCol] = ship.head;

    pivotRow += rotatedRow;
    pivotCol += rotatedCol;

    const drawLength = ship.length - 1;
    const drawFrom = [pivotRow, pivotCol];
    const drawTowards = ship.placementDirection;

    if (!this.#canDraw(drawFrom, drawLength, drawTowards)) {
      return false;
    }

    this.#draw(ship.head, this.water, drawTowards, ship.length);

    ship.placementDirection = rotatedDirection;
    this.#draw(ship.head, shipId, rotatedDirection, ship.length);

    return true;
  }
}

export { GameBoard };
