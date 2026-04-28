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
