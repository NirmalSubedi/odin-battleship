import { Player } from "../index.js";
import { hasMethod } from "./utils/index.js";

describe("Player Constructor", () => {
  it("exists", () => {
    expect(Player).toBeDefined();
    expect(typeof Player).toBe("function");
  });

  let player;
  beforeEach(() => {
    player = new Player();
  });

  it("creates instance", () => {
    expect(player instanceof Player).toBe(true);
  });

  it("contains type property", () => {
    expect(Object.hasOwn(player, "type")).toBe(true);
  });

  it("sets type to computer by default", () => {
    expect(player.type).toBe("computer");
  });

  it("sets type to real", () => {
    player = new Player("real");
    expect(player.type).toBe("real");
  });

  it("contains board property", () => {
    expect(Object.hasOwn(player, "board")).toBe(true);
  });
});

describe("setName method", () => {
  it("exists", () => hasMethod(Player, "setName"));

  let player;
  beforeEach(() => {
    player = new Player();
  });

  it("returns player instance", () => {
    expect(player.setName()).toBe(player);
  });

  it('sets name to "Player" by default', () => {
    player.setName();
    expect(player.name).toBe("Player");
  });

  it("sets name to specified name", () => {
    player.setName("bob");
    expect(player.name).toBe("bob");
  });

  it("sets name consecutively", () => {
    player.setName();
    expect(player.name).toBe("Player");
    player.setName("jane");
    expect(player.name).toBe("jane");
    player.setName("jake");
    expect(player.name).toBe("jake");
  });

  it("throws TypeError for non-string types", () => {
    expect(() => player.setName()).not.toThrow(TypeError);
    expect(() => player.setName(null)).toThrow(TypeError);
    expect(() => player.setName(true)).toThrow(TypeError);
    expect(() => player.setName(1)).toThrow(TypeError);
    expect(() => player.setName(1n)).toThrow(TypeError);
    expect(() => player.setName({})).toThrow(TypeError);
    expect(() => player.setName([])).toThrow(TypeError);
    expect(() => player.setName(() => {})).toThrow(TypeError);
  });
});

describe("name property", () => {
  it("exists", () => {
    const player = new Player();
    expect("name" in player).toBe(true);
  });

  it("throws Error when writing to it", () => {
    const player = new Player();

    expect(() => {
      player.name = "Whoever";
    }).toThrow(Error);
  });
});

describe("clearDock method", () => {
  it("exists", () => hasMethod(Player, "clearDock"));

  it("clears the dock", () => {
    const player = new Player();
    player.dock.push({});
    expect(player.dock.length).toBeGreaterThan(0);

    player.clearDock();
    expect(player.dock.length).toBe(0);
  });

  it("returns the Player instance", () => {
    const player = new Player();
    expect(player.clearDock()).toBe(player);
  });
});
