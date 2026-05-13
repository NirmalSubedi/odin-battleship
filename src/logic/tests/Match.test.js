import { Match } from "../index.js";
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

  it("throws ReferenceError for invalid modes", () => {
    expect(() => match.setMode("triple")).toThrow(ReferenceError);

    expect(() => match.setMode()).toThrow(ReferenceError);
    expect(() => match.setMode("")).toThrow(ReferenceError);
    expect(() => match.setMode(null)).toThrow(ReferenceError);
    expect(() => match.setMode(true)).toThrow(ReferenceError);
    expect(() => match.setMode(1)).toThrow(ReferenceError);
    expect(() => match.setMode(1n)).toThrow(ReferenceError);
    expect(() => match.setMode({})).toThrow(ReferenceError);
    expect(() => match.setMode([])).toThrow(ReferenceError);
    expect(() => match.setMode(() => {})).toThrow(ReferenceError);
  });
});

describe("switchTurn method", () => {
  it("exists", () => hasMethod(Match, "switchTurn"));

  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("sets activePlayer as 1st player when activePlayer is undefined", () => {
    expect(match.activePlayer).toBeUndefined();

    match.setPlayers("John", "Hill");
    match.switchTurn();
    expect(match.activePlayer).toBe("John");
  });

  it("switches turn to 2nd player", () => {
    match.setPlayers("John", "Hill");

    match.switchTurn();
    match.switchTurn();
    expect(match.activePlayer).toBe("Hill");
  });

  it("switches turn back 1st Player", () => {
    match.setPlayers("John", "Hill");

    match.switchTurn();
    match.switchTurn();
    match.switchTurn();
    expect(match.activePlayer).toBe("John");
  });

  it("switches turn multiple times", () => {
    const players = ["John", "Hill"];

    match.setPlayers(players[0], players[1]);
    for (let i = 0; i < 100; ++i) {
      match.switchTurn();
      expect(match.activePlayer).toBe(players[i % players.length]);
    }
  });

  it("switches turn with player objects by reference", () => {
    const player1 = {};
    const player2 = {};
    match.setPlayers(player1, player2);

    match.switchTurn();
    expect(match.activePlayer).toBe(player1);
    expect(match.activePlayer).not.toBe(player2);

    match.switchTurn();
    expect(match.activePlayer).toBe(player2);
    expect(match.activePlayer).not.toBe(player1);
  });

  it("returns match instance", () => {
    match.setMode("double").setPlayers("", "");

    expect(match.switchTurn()).toBe(match);
  });
});

describe("setPlayers method", () => {
  it("exists", () => hasMethod(Match, "setPlayers"));

  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("sets players", () => {
    match.setPlayers("john", "jill");

    match.switchTurn();
    expect(match.activePlayer).toBe("john");
    match.switchTurn();
    expect(match.activePlayer).toBe("jill");
  });

  it("sets players by object reference", () => {
    const john1 = { name: "john" };
    const john2 = { name: "john" };
    match.setPlayers(john1, john2);

    match.switchTurn();
    expect(match.activePlayer).toBe(john1);
    expect(match.activePlayer).not.toBe(john2);

    match.switchTurn();
    expect(match.activePlayer).toBe(john2);
    expect(match.activePlayer).not.toBe(john1);
  });

  it("sets with only one player", () => {
    match.setPlayers("John");

    match.switchTurn();
    expect(match.activePlayer).toBe("John");
  });

  it("returns match instance", () => {
    expect(match.setMode("single").setPlayers("", "")).toBe(match);
  });
});
