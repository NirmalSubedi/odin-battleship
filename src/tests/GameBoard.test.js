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

describe("clearFleet method", () => {
  it("exists", () => {
    expect(Object.hasOwn(GameBoard.prototype, "clearFleet")).toBe(true);
    expect(typeof GameBoard.prototype.clearFleet).toBe("function");
  });

  it("clears the fleet", () => {
    const board = new GameBoard();
    expect(board.fleet.length).toBeGreaterThan(0);

    board.clearFleet();
    expect(board.fleet.length).toBe(0);
  });

  it("returns the GameBoard instance", () => {
    const board = new GameBoard();
    expect(board.clearFleet()).toBe(board);
  });
});
