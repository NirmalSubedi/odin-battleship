import { GameBoard, Player } from "../index.js";

describe("Player Constructor", () => {
  it("exists", () => {
    expect(Player).toBeDefined();
    expect(typeof Player).toBe("function");
  });

  it("creates instance", () => {
    const player = new Player();
    expect(player instanceof Player).toBe(true);
  });

  it("contains type property", () => {
    const player = new Player();
    expect(player.type).toBeDefined();
  });

  it("sets type to computer by default", () => {
    const player = new Player();
    expect(player.type).toBe("computer");
  });

  it("sets type to real", () => {
    const player1 = new Player({ type: "real" });
    expect(player1.type).toBe("real");
  });

  it("contains board property", () => {
    const player = new Player();
    expect(player.board).toBeDefined();
  });

  it("creates GameBoard instance", () => {
    const player = new Player();
    expect(player.board instanceof GameBoard).toBe(true);
  });

  it("creates unique GameBoard instance", () => {
    const player1 = new Player();
    const player2 = new Player();
    const isSameInstance = player1.board === player2.board;

    expect(isSameInstance).toBe(false);
  });

  it("creates specified board size", () => {
    const player = new Player({ row: 3, col: 3 });

    expect(player.board.peak).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });
});
