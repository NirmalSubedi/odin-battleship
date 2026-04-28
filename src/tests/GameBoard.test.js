import { GameBoard } from "../GameBoard.js";

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
  it("exists", () => {
    expect(Object.hasOwn(GameBoard.prototype, "useDefaultFleet")).toBe(true);
    expect(typeof GameBoard.prototype.useDefaultFleet).toBe("function");
  });

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
  it("exists", () => {
    expect(Object.hasOwn(GameBoard.prototype, "clearFleet")).toBe(true);
    expect(typeof GameBoard.prototype.clearFleet).toBe("function");
  });

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
