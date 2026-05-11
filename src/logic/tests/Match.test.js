import { Match } from "../index.js";
import { isInheritedProperty, hasMethod } from "./utils/index.js";

describe("Match constructor", () => {
  it("exists", () => {
    expect(Match).toBeDefined();
    expect(typeof Match).toBe("function");
  });

  let match;
  beforeAll(() => {
    match = new Match();
  });

  it("creates instance", () => {
    expect(match instanceof Match).toBe(true);
  });

  it("assigns mode property to instance", () =>
    isInheritedProperty(match, "mode"));
  it("sets mode property to a sting", () => {
    expect(typeof match.mode).toBe("string");
  });
  it("sets mode property to 'single' by default", () => {
    expect(match.mode).toBe("single");
  });

  it("assigns attacker property to instance", () =>
    isInheritedProperty(match, "attacker"));

  it("assigns player1 property to instance", () =>
    isInheritedProperty(match, "player1"));

  it("assigns player2 property to instance", () =>
    isInheritedProperty(match, "player2"));
});

describe("setMode method", () => {
  it("exists", () => hasMethod(Match, "setMode"));

  it("returns match instance", () => {
    const match = new Match();
    expect(match.setMode()).toBe(match);
  });

  it("sets mode", () => {
    const match = new Match();
    match.setMode("double");
    expect(match.mode).toBe("double");
  });
});

describe("setPlayers method", () => {
  it("exists", () => hasMethod(Match, "setPlayers"));

  it("returns match instance", () => {
    const match = new Match();
    expect(match.setPlayers()).toBe(match);
  });

  it.todo("main logic");
});

describe("setAttacker method", () => {
  it("exists", () => hasMethod(Match, "setAttacker"));

  it("returns match instance", () => {
    const match = new Match();
    expect(match.setAttacker()).toBe(match);
  });

  it.todo("main logic");
});

describe("switchTurn method", () => {
  it("exists", () => hasMethod(Match, "switchTurn"));

  it("returns match instance", () => {
    const match = new Match();
    expect(match.switchTurn()).toBe(match);
  });

  it.todo("main logic");
});
