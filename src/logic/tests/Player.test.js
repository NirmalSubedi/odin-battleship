import { Player } from "../index.js";
import { hasMethod } from "./utils/index.js";

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

describe("setName method", () => {
  it("exists", () => hasMethod(Player, "setName"));

  it("returns player instance", () => {
    const player = new Player();

    expect(player.setName()).toBe(player);
  });

  it('sets name to "Player" by default', () => {
    const player = new Player().setName();
    expect(player.name).toBe("Player");
  });

  it("sets name to specified name", () => {
    const player = new Player().setName("bob");
    expect(player.name).toBe("bob");
  });

  it("sets name consecutively", () => {
    const player = new Player().setName();
    expect(player.name).toBe("Player");
    player.setName("jane");
    expect(player.name).toBe("jane");
    player.setName("jake");
    expect(player.name).toBe("jake");
  });

  it("throws TypeError for non-string types", () => {
    const player = new Player();

    expect(() => player.setName(null)).toThrow(TypeError);
    expect(() => player.setName(1)).toThrow(TypeError);
    expect(() => player.setName(1n)).toThrow(TypeError);
    expect(() => player.setName(() => {})).toThrow(TypeError);
    expect(() => player.setName([])).toThrow(TypeError);
    expect(() => player.setName({})).toThrow(TypeError);
    expect(() => player.setName(true)).toThrow(TypeError);
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
