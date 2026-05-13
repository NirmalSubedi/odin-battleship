import { Match, Player } from "../index.js";
import { isInheritedProperty, hasMethod } from "./utils/index.js";

describe("Match constructor", () => {
  it("exists", () => {
    expect(Match).toBeDefined();
    expect(typeof Match).toBe("function");
  });

  it("creates instance", () => {
    const match = new Match();
    expect(match instanceof Match).toBe(true);
  });
});

describe("mode property", () => {
  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("exists", () => isInheritedProperty(match, "mode"));

  it("starts as undefined", () => {
    expect(match.activePlayer).toBeUndefined();
  });
});

describe("activePlayer property", () => {
  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("exists", () => isInheritedProperty(match, "activePlayer"));

  it("starts as undefined", () => {
    expect(match.activePlayer).toBeUndefined();
  });
});

describe("player1 property", () => {
  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("exists", () => isInheritedProperty(match, "player1"));

  it("starts as undefined", () => {
    expect(match.player1).toBeUndefined();
  });
});

describe("player2 property", () => {
  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("exists", () => isInheritedProperty(match, "player2"));

  it("starts as undefined", () => {
    expect(match.player2).toBeUndefined();
  });
});

describe("setMode method", () => {
  it("exists", () => hasMethod(Match, "setMode"));

  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("returns match instance", () => {
    expect(match.setMode("single")).toBe(match);
  });

  it("sets mode", () => {
    match.setMode("double");
    expect(match.mode).toBe("double");
  });

  it("throws TypeError for non-string mode", () => {
    expect(() => match.setMode()).toThrow(TypeError);
    expect(() => match.setMode(null)).toThrow(TypeError);
    expect(() => match.setMode(true)).toThrow(TypeError);
    expect(() => match.setMode(1)).toThrow(TypeError);
    expect(() => match.setMode(1n)).toThrow(TypeError);
    expect(() => match.setMode({})).toThrow(TypeError);
    expect(() => match.setMode([])).toThrow(TypeError);
    expect(() => match.setMode(() => {})).toThrow(TypeError);
  });

  it("throws ReferenceError for invalid modes", () => {
    expect(() => match.setMode("triple")).toThrow(ReferenceError);
  });
});

describe("setPlayers method", () => {
  it("exists", () => hasMethod(Match, "setPlayers"));

  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("throws ReferenceError when mode is undefined", () => {
    expect(match.mode).toBeUndefined();

    expect(() => match.setPlayers("", "")).toThrow(ReferenceError);
  });

  it("throws TypeError when passing in non strings names", () => {
    match.setMode("single");
    expect(() => match.setPlayers()).toThrow(TypeError);
    expect(() => match.setPlayers(null)).toThrow(TypeError);
    expect(() => match.setPlayers(true)).toThrow(TypeError);
    expect(() => match.setPlayers(1)).toThrow(TypeError);
    expect(() => match.setPlayers(1n)).toThrow(TypeError);
    expect(() => match.setPlayers({})).toThrow(TypeError);
    expect(() => match.setPlayers([])).toThrow(TypeError);
    expect(() => match.setPlayers(() => {})).toThrow(TypeError);

    match.setMode("double");
    expect(() => match.setPlayers("")).toThrow(TypeError);
    expect(() => match.setPlayers("", null)).toThrow(TypeError);
    expect(() => match.setPlayers("", true)).toThrow(TypeError);
    expect(() => match.setPlayers("", 1)).toThrow(TypeError);
    expect(() => match.setPlayers("", 1n)).toThrow(TypeError);
    expect(() => match.setPlayers("", {})).toThrow(TypeError);
    expect(() => match.setPlayers("", [])).toThrow(TypeError);
    expect(() => match.setPlayers("", () => {})).toThrow(TypeError);
  });

  it("creates players from Player constructor", () => {
    match.setMode("single").setPlayers("", "");

    expect(match.player1).toBeInstanceOf(Player);
    expect(match.player2).toBeInstanceOf(Player);
  });

  it("sets single player type to real and other to computer", () => {
    match.setMode("single").setPlayers("bob");

    expect(match.player1.type).toBe("real");
    expect(match.player2.type).toBe("computer");
  });

  it("sets both players' type to real", () => {
    match.setMode("double").setPlayers("bill", "joe");

    expect(match.player1.type).toBe("real");
    expect(match.player2.type).toBe("real");
  });

  it("sets players with correct names for single", () => {
    match.setMode("single").setPlayers("zoe");

    expect(match.player1.name).toBe("zoe");
    expect(match.player2.name).toBe("Opponent");
  });

  it("sets players with correct names for double", () => {
    match.setMode("double").setPlayers("joe", "jane");

    expect(match.player1.name).toBe("joe");
    expect(match.player2.name).toBe("jane");
  });

  it("does not set players to same object reference for single", () => {
    match.setMode("single").setPlayers("", "");

    expect(match.player1).not.toBe(match.player2);
  });

  it("does not set players to same object reference for double", () => {
    match.setMode("double").setPlayers("", "");

    expect(match.player1).not.toBe(match.player2);
  });

  it("returns match instance", () => {
    expect(match.setMode("single").setPlayers("", "")).toBe(match);
  });
});

describe("switchTurn method", () => {
  it("exists", () => hasMethod(Match, "switchTurn"));

  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("throws ReferenceError when mode is not set", () => {
    expect(match.mode).toBeUndefined();

    expect(() => match.switchTurn()).toThrow(ReferenceError);
  });

  it("throws ReferenceError when players are not set", () => {
    expect(match.player1).toBeUndefined();
    expect(match.player2).toBeUndefined();

    expect(() => match.switchTurn()).toThrow(ReferenceError);
  });

  it("chooses activePlayer as player1 when activePlayer is undefined", () => {
    expect(match.activePlayer).toBeUndefined();

    match.setMode("single").setPlayers("").switchTurn();
    expect(match.activePlayer).toBe(match.player1);
  });

  it("switches turn to player2", () => {
    match.setMode("single").setPlayers("");

    match.switchTurn();
    expect(match.activePlayer).toBe(match.player1);

    match.switchTurn();
    expect(match.activePlayer).toBe(match.player2);
  });

  it("switches turn back to player1", () => {
    match.setMode("double").setPlayers("", "");

    match.switchTurn();
    expect(match.activePlayer).toBe(match.player1);

    match.switchTurn();
    expect(match.activePlayer).toBe(match.player2);

    match.switchTurn();
    expect(match.activePlayer).toBe(match.player1);
  });

  it("switches turn multiple times", () => {
    match.setMode("double").setPlayers("", "");

    for (let i = 0; i < 100; ++i) {
      match.switchTurn();
      expect(match.activePlayer).toBe(match[`player${(i % 2) + 1}`]);
    }
  });

  it("returns match instance", () => {
    match.setMode("double").setPlayers("", "");

    expect(match.switchTurn()).toBe(match);
  });
});
