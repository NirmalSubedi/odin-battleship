import { GameBoard } from "../GameBoard.js";
import { hasMethod } from "./utils/testUtils.js";

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

describe("useDefaultFleet method", () => {
  it("exists", () => hasMethod(GameBoard, "useDefaultFleet"));

  it("adds ships to fleet", () => {
    const board = new GameBoard(1, 1);
    expect(board.fleet.length).toBe(0);

    board.useDefaultFleet();
    expect(board.fleet.length).toBeGreaterThan(0);
  });

  it("returns the GameBoard instance", () => {
    const board = new GameBoard(1, 1);
    expect(board.useDefaultFleet()).toBe(board);
  });
});

describe("clearFleet method", () => {
  it("exists", () => hasMethod(GameBoard, "clearFleet"));

  it("clears the fleet", () => {
    const board = new GameBoard(1, 1);
    board.useDefaultFleet();
    expect(board.fleet.length).toBeGreaterThan(0);

    board.clearFleet();
    expect(board.fleet.length).toBe(0);
  });

  it("returns the GameBoard instance", () => {
    const board = new GameBoard(1, 1);
    expect(board.clearFleet()).toBe(board);
  });
});

describe("placeShip method", () => {
  it("exists", () => hasMethod(GameBoard, "placeShip"));

  let board;
  beforeEach(() => {
    board = new GameBoard(3, 3);
  });

  it("throws ReferenceError for no coordinates", () => {
    expect(() => board.placeShip()).toThrow(ReferenceError);
  });

  it("throws TypeError for non-integer coordinates", () => {
    expect(() => board.placeShip([1, 1])).not.toThrow(TypeError);
    expect(() => board.placeShip([1, undefined])).toThrow(TypeError);
    expect(() => board.placeShip([1n, 1])).toThrow(TypeError);
    expect(() => board.placeShip([0.1, 1])).toThrow(TypeError);
    expect(() => board.placeShip([1, NaN])).toThrow(TypeError);
    expect(() => board.placeShip([Infinity, 1])).toThrow(TypeError);
    expect(() => board.placeShip([1, -Infinity])).toThrow(TypeError);
    expect(() => board.placeShip(["1", 1])).toThrow(TypeError);
    expect(() => board.placeShip([false, 1])).toThrow(TypeError);
    expect(() => board.placeShip([1, ""])).toThrow(TypeError);
    expect(() => board.placeShip([[], 1])).toThrow(TypeError);
    expect(() => board.placeShip([1, {}])).toThrow(TypeError);
    expect(() => board.placeShip([1, () => {}])).toThrow(TypeError);
  });

  it("throws ReferenceError for half of coordinates", () => {
    expect(() => board.placeShip([1])).toThrow(ReferenceError);
  });

  it("throws RangeError for out of bound coordinates", () => {
    expect(() => board.placeShip([-1, 1])).toThrow(RangeError);
    expect(() => board.placeShip([1, -1])).toThrow(RangeError);
    expect(() => board.placeShip([-1, -1])).toThrow(RangeError);
    expect(() => board.placeShip([1, board.cols])).toThrow(RangeError);
    expect(() => board.placeShip([board.rows, 1])).toThrow(RangeError);
    expect(() => board.placeShip([board.rows, board.cols])).toThrow(RangeError);
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
    const recentShipLength = ship.vessel.length;
    expect(recentShipLength).toBe(1);
  });

  it("creates specified length ship", () => {
    const createdShipLength = 2;
    board.placeShip([0, 0], createdShipLength);

    const RECENT_SHIP = -1;
    const ship = board.fleet.at(RECENT_SHIP);
    const recentShipLength = ship.vessel.length;
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

  it("places multiple ships", () => {
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

  it("returns true if ship is placed", () => {
    expect(board.placeShip([0, 0])).toBe(true);
  });

  it("returns false if ship is not placed", () => {
    board.placeShip([1, 1]);
    expect(board.placeShip([1, 1])).toBe(false);
  });
});
