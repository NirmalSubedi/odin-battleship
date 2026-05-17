import { GameBoard } from "../index.js";
import { hasMethod, testCoordinates } from "./utils/index.js";

describe("GameBoard constructor", () => {
  it("exists", () => {
    expect(GameBoard).toBeDefined();
    expect(typeof GameBoard).toBe("function");
  });

  it("creates instance", () => {
    const board = new GameBoard(1, 1);
    expect(board instanceof GameBoard).toBe(true);
  });

  it("represents water as 0", () => {
    const board = new GameBoard(1, 1);
    expect(board.water).toBe(0);
    expect(board.peak[0][0]).toBe(0);
  });

  it("creates 10 x 10 board by default", () => {
    const board = new GameBoard();
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it("creates 1 x 1 board", () => {
    const board = new GameBoard(1, 1);
    expect(board.peak).toEqual([[0]]);
  });

  it("creates 2 x 1 board", () => {
    const board = new GameBoard(2, 1);
    expect(board.peak).toEqual([[0], [0]]);
  });

  it("creates 1 x 2 board", () => {
    const board = new GameBoard(1, 2);
    expect(board.peak).toEqual([[0, 0]]);
  });

  it("creates 2 x 2 board", () => {
    const board = new GameBoard(2, 2);
    expect(board.peak).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it("creates empty board", () => {
    const board = new GameBoard(0, 0);
    expect(board.peak).toEqual([]);
  });

  it("creates empty board for negative values", () => {
    const board = new GameBoard(-5, -4);
    expect(board.peak).toEqual([]);
  });

  it("floors float dimensions and creates board from them", () => {
    const board = new GameBoard(1.2, 2.9);
    expect(board.peak).toEqual([[0, 0]]);
  });
});

describe("placeShip method", () => {
  it("exists", () => hasMethod(GameBoard, "placeShip"));

  let board;
  beforeEach(() => {
    board = new GameBoard(3, 3);
  });

  it("validates passed in  coordinates", () => {
    testCoordinates(board, "placeShip");
  });

  it("adds ship to the fleet", () => {
    expect(board.fleet.length).toBe(0);
    board.placeShip([0, 0]);
    expect(board.fleet.length).toBe(1);
  });

  it("creates length 1 ship by default", () => {
    board.placeShip([0, 0]);

    const RECENT_SHIP = -1;
    const ship = board.fleet.at(RECENT_SHIP);
    const recentShipLength = ship.length;
    expect(recentShipLength).toBe(1);
  });

  it("creates specified length ship", () => {
    const createdShipLength = 2;
    board.placeShip([0, 0], createdShipLength);

    const RECENT_SHIP = -1;
    const ship = board.fleet.at(RECENT_SHIP);
    const recentShipLength = ship.length;
    expect(recentShipLength).toBe(createdShipLength);
  });

  it("places ship at the coordinate", () => {
    board.placeShip([1, 1]);
    expect(board.peak).toEqual([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
  });

  it("places ship downward by default", () => {
    board.placeShip([1, 1], 2);
    expect(board.peak).toEqual([
      [0, 0, 0],
      [0, 1, 0],
      [0, 1, 0],
    ]);
  });

  it("places ship downward", () => {
    board.placeShip([1, 1], 2, "D");
    expect(board.peak).toEqual([
      [0, 0, 0],
      [0, 1, 0],
      [0, 1, 0],
    ]);
  });

  it("places ship upward", () => {
    board.placeShip([1, 1], 2, "U");
    expect(board.peak).toEqual([
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
  });

  it("places ship rightward", () => {
    board.placeShip([1, 1], 2, "R");
    expect(board.peak).toEqual([
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 0],
    ]);
  });

  it("places ship leftward", () => {
    board.placeShip([1, 1], 2, "L");
    expect(board.peak).toEqual([
      [0, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]);
  });

  it("places consecutive ships", () => {
    board.placeShip([1, 1]);
    board.placeShip([0, 0], 2);
    expect(board.peak).toEqual([
      [2, 0, 0],
      [2, 1, 0],
      [0, 0, 0],
    ]);
  });

  it("does not place ship on occupied space", () => {
    board.placeShip([0, 0]);
    board.placeShip([0, 0], 2);
    expect(board.peak).toEqual([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("does not place ship bigger than the board", () => {
    board.placeShip([0, 0], 4);
    expect(board.peak).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("returns true if ship is placed", () => {
    expect(board.placeShip([0, 0])).toBe(true);
  });

  it("returns false if ship is not placed", () => {
    board.placeShip([1, 1]);
    expect(board.placeShip([1, 1])).toBe(false);
  });
});

describe("receiveAttack method", () => {
  it("exists", () => hasMethod(GameBoard, "receiveAttack"));

  let board;
  beforeEach(() => {
    board = new GameBoard(3, 3);
  });

  it("validates passed in coordinates", () => {
    testCoordinates(board, "receiveAttack");
  });

  it("call hit method on ship", () => {
    board.placeShip([1, 1]);

    const SHIP_POSITION = 0;
    const ship = board.fleet.at(SHIP_POSITION);
    const hitMethod = jest.spyOn(ship, "hit");

    board.receiveAttack([1, 1]);
    expect(hitMethod).toHaveBeenCalled();
  });

  it("calls hit method on correct ship", () => {
    board.placeShip([1, 1]);
    board.placeShip([0, 0]);

    const FIRST_SHIP_POSITION = 0;
    const SECOND_SHIP_POSITION = 1;
    const firstShip = board.fleet.at(FIRST_SHIP_POSITION);
    const secondShip = board.fleet.at(SECOND_SHIP_POSITION);

    const firstShipHitMethod = jest.spyOn(firstShip, "hit");
    const secondShipHitMethod = jest.spyOn(secondShip, "hit");

    board.receiveAttack([0, 0]);
    expect(firstShipHitMethod).not.toHaveBeenCalled();
    expect(secondShipHitMethod).toHaveBeenCalled();
  });

  it("updates coordinates of miss with '-1'", () => {
    board.placeShip([0, 0]);
    board.receiveAttack([2, 2]);

    expect(board.peak[2][2]).toBe(-1);
  });

  it("updates coordinates of hit with '-2'", () => {
    board.placeShip([0, 0], 2);
    board.receiveAttack([0, 0]);

    expect(board.peak[0][0]).toBe(-2);
  });

  it("updates coordinates of sunk ship with -3", () => {
    board.placeShip([0, 0]);
    board.receiveAttack([0, 0]);

    expect(board.peak[0][0]).toBe(-3);
  });

  it("updates all coordinates of sunk ship with -3", () => {
    board.placeShip([0, 0], 2);
    board.receiveAttack([0, 0]);
    board.receiveAttack([1, 0]);

    expect(board.peak).toEqual([
      [-3, 0, 0],
      [-3, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("returns correct object for shot that hits and sinks ship", () => {
    board.placeShip([0, 0]);
    const SHIP_POSITION = 0;
    const ship = board.fleet.at(SHIP_POSITION);

    expect(board.receiveAttack([0, 0])).toEqual({
      hit: true,
      sunk: true,
      ship,
    });
  });

  it("returns correct object for shot that only hits ship", () => {
    board.placeShip([0, 0], 2);
    const SHIP_POSITION = 0;
    const ship = board.fleet.at(SHIP_POSITION);

    expect(board.receiveAttack([0, 0])).toEqual({
      hit: true,
      sunk: false,
      ship,
    });
  });

  it("returns correct object for missed shot", () => {
    board.placeShip([0, 0]);

    expect(board.receiveAttack([1, 1])).toEqual({ hit: false });
  });

  it("returns null for duplicate shot", () => {
    board.placeShip([0, 0]);

    board.receiveAttack([0, 0]);
    expect(board.receiveAttack([0, 0])).toBeNull();
  });
});

describe("isFleetSunk method", () => {
  it("exists", () => hasMethod(GameBoard, "isFleetSunk"));

  let board;
  beforeEach(() => {
    board = new GameBoard(3, 3);
  });

  it("return true for no fleet", () => {
    expect(board.isFleetSunk()).toBe(true);
  });

  it("returns false for alive fleet", () => {
    board.placeShip([0, 0]);
    expect(board.isFleetSunk()).toBe(false);
  });

  it("returns true when all ships are sunk", () => {
    board.placeShip([0, 0]);
    board.receiveAttack([0, 0]);

    expect(board.isFleetSunk()).toBe(true);
  });

  it("switches return value to false when ship is added", () => {
    board.placeShip([0, 0]);
    board.receiveAttack([0, 0]);
    expect(board.isFleetSunk()).toBe(true);

    board.placeShip([1, 1]);
    expect(board.isFleetSunk()).toBe(false);
  });
});

describe("randomPlace method", () => {
  it("exists", () => hasMethod(GameBoard, "randomPlace"));

  let board;
  beforeEach(() => {
    board = new GameBoard();
  });

  it("returns board instance", () => {
    const shipLength = 2;
    const shipName = "";

    expect(board.randomPlace(shipLength, shipName)).toBe(board);
  });

  it("places ships", () => {
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);

    const shipLength = 2;
    const shipName = "";

    board.randomPlace(shipLength, shipName);

    expect(board.peak).not.toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it("throws Error for board with less than 50% water space", () => {
    board = new GameBoard(2, 2);
    board.placeShip([0, 0], 2);

    const shipLength = 1;
    const shipName = "";
    expect(() => board.randomPlace(shipLength, shipName)).toThrow(Error);
  });

  it("throws RangeError for board smaller than ship", () => {
    board = new GameBoard(1, 1);

    const shipLength = 2;
    const shipName = "";

    expect(() => board.randomPlace(shipLength, shipName)).toThrow(RangeError);
  });
});

describe("randomAttack method", () => {
  it("exists", () => hasMethod(GameBoard, "randomAttack"));

  let board;
  beforeEach(() => {
    board = new GameBoard(1, 1);
  });

  it("calls receiveAttack method with coordinates", () => {
    const spy = jest.spyOn(board, "receiveAttack");

    expect(spy).not.toHaveBeenCalled();
    board.randomAttack();
    expect(spy).toHaveBeenCalledWith([0, 0]);
  });
});

describe("randomAttack method (integration)", () => {
  it("attacks a square on board", () => {
    const board = new GameBoard();
    const isBoardAttacked = (board) =>
      board.peak.some((row) => row.some((col) => col !== board.water));

    expect(isBoardAttacked(board)).toBe(false);

    board.randomAttack();
    expect(isBoardAttacked(board)).toBe(true);
  });

  let board;
  beforeEach(() => {
    board = new GameBoard(1, 1);
  });

  it("attacks the lone square", () => {
    const MISS = -1;

    expect(board.peak).toEqual([[0]]);

    board.randomAttack();
    expect(board.peak).toEqual([[MISS]]);
  });

  it("sinks placed ship on lone square", () => {
    const SUNK = -3;
    board.placeShip([0, 0]);

    expect(board.peak).toEqual([[1]]);

    board.randomAttack();
    expect(board.peak).toEqual([[SUNK]]);
  });

  it("returns null for no more or duplicate shot", () => {
    board.randomAttack();

    expect(board.randomAttack()).toBeNull();
  });

  it("returns same object as receiveAttack for sunk ship", () => {
    board.placeShip([0, 0]);

    const SHIP_POSITION = 0;
    const ship = board.fleet.at(SHIP_POSITION);

    expect(board.randomAttack()).toEqual({
      hit: true,
      sunk: true,
      ship,
    });
  });

  it("returns same object as receiveAttack for hit ship", () => {
    board = new GameBoard(2, 1);
    board.placeShip([0, 0], 2);

    const SHIP_POSITION = 0;
    const ship = board.fleet.at(SHIP_POSITION);

    expect(board.randomAttack()).toEqual({
      hit: true,
      sunk: false,
      ship,
    });
  });

  it("returns same object as receiveAttack for miss", () => {
    board = new GameBoard(2, 1);
    jest.spyOn(global.Math, "random").mockReturnValue(0.5);

    expect(board.peak).toEqual([[0], [0]]);

    expect(board.randomAttack()).toEqual({ hit: false });
    expect(board.peak).toEqual([[0], [-1]]);
  });
});

describe("rotateShipAt method", () => {
  it("exists", () => hasMethod(GameBoard, "rotateShipAt"));

  it("validates passed in coordinates", () => {
    const board = new GameBoard(1, 1);

    testCoordinates(board, "rotateShipAt");
  });

  let board;
  beforeEach(() => {
    board = new GameBoard(5, 5);
    board.placeShip([2, 2], 3);
  });

  it("keeps head coordinates the same after rotation", () => {
    const shipPosition = 0;
    const ship = board.fleet.at(shipPosition);

    expect(ship.head).toEqual([2, 2]);

    board.rotateShipAt([2, 2]);
    expect(ship.head).toEqual([2, 2]);
  });

  it("rotates ship 90 degree clockwise", () => {
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ]);

    board.rotateShipAt([2, 2]);
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it("rotates ship 180 degree clockwise", () => {
    board.rotateShipAt([2, 2]);
    board.rotateShipAt([2, 2]);
    expect(board.peak).toEqual([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it("rotates ship 270 degree clockwise", () => {
    board.rotateShipAt([2, 2]);
    board.rotateShipAt([2, 2]);
    board.rotateShipAt([2, 2]);
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it("rotates ship 360 degree clockwise", () => {
    board.rotateShipAt([2, 2]);
    board.rotateShipAt([2, 2]);
    board.rotateShipAt([2, 2]);
    board.rotateShipAt([2, 2]);
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ]);
  });

  it("rotates ship 90 degree counterclockwise", () => {
    board.rotateShipAt([2, 2], true);
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it("rotates ship 180 degree counterclockwise", () => {
    board.rotateShipAt([2, 2], true);
    board.rotateShipAt([2, 2], true);
    expect(board.peak).toEqual([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it("rotates ship 270 degree counterclockwise", () => {
    board.rotateShipAt([2, 2], true);
    board.rotateShipAt([2, 2], true);
    board.rotateShipAt([2, 2], true);
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it("rotates ship 360 degree counterclockwise", () => {
    board.rotateShipAt([2, 2], true);
    board.rotateShipAt([2, 2], true);
    board.rotateShipAt([2, 2], true);
    board.rotateShipAt([2, 2], true);
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ]);
  });

  it("updates placement directions after clockwise rotation", () => {
    const shipPosition = 0;
    const ship = board.fleet.at(shipPosition);

    const down = [1, 0];
    expect(ship.placementDirection).toEqual(down);

    board.rotateShipAt([2, 2]);
    const left = [0, -1];
    expect(ship.placementDirection).toEqual(left);

    board.rotateShipAt([2, 2]);
    const up = [-1, 0];
    expect(ship.placementDirection).toEqual(up);

    board.rotateShipAt([2, 2]);
    const right = [0, 1];
    expect(ship.placementDirection).toEqual(right);

    board.rotateShipAt([2, 2]);
    expect(ship.placementDirection).toEqual(down);
  });

  it("updates placement directions after counterclockwise rotation", () => {
    const shipPosition = 0;
    const ship = board.fleet.at(shipPosition);

    const down = [1, 0];
    expect(ship.placementDirection).toEqual(down);

    board.rotateShipAt([2, 2], true);
    const right = [0, 1];
    expect(ship.placementDirection).toEqual(right);

    board.rotateShipAt([2, 2], true);
    const up = [-1, 0];
    expect(ship.placementDirection).toEqual(up);

    board.rotateShipAt([2, 2], true);
    const left = [0, -1];
    expect(ship.placementDirection).toEqual(left);

    board.rotateShipAt([2, 2], true);
    expect(ship.placementDirection).toEqual(down);
  });

  it("returns true if ship was rotated", () => {
    expect(board.rotateShipAt([2, 2])).toBe(true);
  });

  it("returns false if there is no ship at the coordinates", () => {
    expect(board.rotateShipAt([0, 0])).toBe(false);
  });

  it("returns false if ship could not be rotated", () => {
    board = new GameBoard(3, 1);
    board.placeShip([0, 0], 3);

    expect(board.rotateShipAt([0, 0])).toBe(false);
  });

  it("returns false if another ship is blocking rotation", () => {
    board.placeShip([2, 1]);

    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 2, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ]);

    expect(board.rotateShipAt([2, 2])).toBe(false);
    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 2, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ]);
  });
});

describe("resetBoard method", () => {
  it("exists", () => hasMethod(GameBoard, "resetBoard"));

  let board;
  beforeEach(() => {
    board = new GameBoard(2, 2);
  });

  it("removes ship from board", () => {
    expect(board.peak).toEqual([
      [0, 0],
      [0, 0],
    ]);
    board.placeShip([0, 0], 2);
    expect(board.peak).toEqual([
      [1, 0],
      [1, 0],
    ]);

    board.resetBoard();
    expect(board.peak).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it("removes ships from board", () => {
    expect(board.peak).toEqual([
      [0, 0],
      [0, 0],
    ]);
    board.placeShip([0, 0], 2);
    board.placeShip([0, 1], 2);
    expect(board.peak).toEqual([
      [1, 2],
      [1, 2],
    ]);

    board.resetBoard();
    expect(board.peak).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it("return instance", () => {
    expect(board.resetBoard()).toBe(board);
  });
});

describe("countAliveShips", () => {
  it("exists", () => hasMethod(GameBoard, "countAliveShips"));

  let board;
  beforeEach(() => {
    board = new GameBoard(2, 2);
  });

  it("returns ship count", () => {
    expect(board.countAliveShips()).toBe(0);
    board.placeShip([0, 0]);
    expect(board.countAliveShips()).toBe(1);
    board.placeShip([0, 1]);
    expect(board.countAliveShips()).toBe(2);
    board.placeShip([1, 1]);
    expect(board.countAliveShips()).toBe(3);
    board.placeShip([1, 0]);
    expect(board.countAliveShips()).toBe(4);
  });

  it("return count of alive ship", () => {
    board.placeShip([0, 0], 2);
    board.placeShip([0, 1]);
    expect(board.countAliveShips()).toBe(2);

    board.receiveAttack([0, 1]);
    expect(board.countAliveShips()).toBe(1);

    board.receiveAttack([0, 0]);
    expect(board.countAliveShips()).toBe(1);

    board.receiveAttack([1, 0]);
    expect(board.countAliveShips()).toBe(0);
  });
});

describe("moveShip method", () => {
  it("exists", () => hasMethod(GameBoard, "moveShip"));

  let board;
  beforeEach(() => {
    board = new GameBoard(3, 3);
  });

  it("moves ship", () => {
    board.placeShip([0, 0]);

    expect(board.peak).toEqual([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);

    board.moveShip([0, 0], [2, 2]);
    expect(board.peak).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ]);
  });

  it("does not move ship to occupied space", () => {
    board.placeShip([0, 0]);
    board.placeShip([2, 2]);

    expect(board.peak).toEqual([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 2],
    ]);

    board.moveShip([0, 0], [2, 2]);
    expect(board.peak).toEqual([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 2],
    ]);
  });

  it("updates ship's head position", () => {
    board.placeShip([0, 0]);
    const ship = board.fleet.at(0);

    expect(ship.head).toEqual([0, 0]);

    board.moveShip([0, 0], [0, 1]);

    expect(ship.head).toEqual([0, 1]);
  });

  it("validates from coordinates", () => {
    testCoordinates(board, "moveShip");
  });

  it("validates to coordinates", () => {
    testCoordinates(board, "moveShip", [0, 0]);
  });

  it("returns true if moved", () => {
    board.placeShip([0, 0]);

    expect(board.moveShip([0, 0], [0, 1])).toBe(true);
  });

  it("returns false if movement was blocked by another ship", () => {
    board.placeShip([0, 0]);
    board.placeShip([0, 1]);

    expect(board.moveShip([0, 0], [0, 1])).toBe(false);
  });

  it("return false if no ship found at coordinates", () => {
    expect(board.moveShip([0, 0], [1, 1])).toBe(false);
  });
});
