import { Player } from "../index.js";

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
    expect(Object.hasOwn(player, "type")).toBe(true);
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
    expect(Object.hasOwn(player, "board")).toBe(true);
  });
});
