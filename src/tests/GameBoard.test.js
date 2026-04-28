import { GameBoard } from "../GameBoard.js";

describe("GameBoard constructor", () => {
  it("exists", () => {
    expect(GameBoard).toBeDefined();
    expect(typeof GameBoard).toBe("function");
  });

  it("creates instance", () => {
    const board = new GameBoard();
    expect(board instanceof GameBoard).toBe(true);
  });
});

describe("useDefaultFleet method", () => {
  it("exists", () => {
    expect(Object.hasOwn(GameBoard.prototype, "useDefaultFleet")).toBe(true);
    expect(typeof GameBoard.prototype.useDefaultFleet).toBe("function");
  });

  it("adds ships to fleet", () => {
    const board = new GameBoard();
    expect(board.fleet.length).toBe(0);

    board.useDefaultFleet();
    expect(board.fleet.length).toBeGreaterThan(0);
  });
});

describe("clearFleet method", () => {
  it("exists", () => {
    expect(Object.hasOwn(GameBoard.prototype, "clearFleet")).toBe(true);
    expect(typeof GameBoard.prototype.clearFleet).toBe("function");
  });

  it("clears the fleet", () => {
    const board = new GameBoard();
    board.useDefaultFleet();
    expect(board.fleet.length).toBeGreaterThan(0);

    board.clearFleet();
    expect(board.fleet.length).toBe(0);
  });

  it("returns the GameBoard instance", () => {
    const board = new GameBoard();
    expect(board.clearFleet()).toBe(board);
  });
});
