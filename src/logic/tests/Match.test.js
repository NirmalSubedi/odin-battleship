import { Match, Player, GameBoard } from "../index.js";
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

describe("init method", () => {
  it("exists", () => hasMethod(Match, "init"));

  let match;
  beforeEach(() => {
    match = new Match();
  });

  it("throws ReferenceError when no game mode is set", () => {
    expect(match.mode).toBeUndefined();

    expect(() => match.init()).toThrow(ReferenceError);
  });

  it("sets activePlayer property as an instance of Player constructor", () => {
    match.setMode("single");

    match.init();
    expect(match.activePlayer).toBeInstanceOf(Player);
  });

  it("sets up player types correctly for single player mode", () => {
    match.setMode("single").init();

    expect(match.activePlayer.type).toBe("real");
    match.switchTurn();
    expect(match.activePlayer.type).toBe("computer");
  });

  it("sets up player types correctly for double player mode", () => {
    match.setMode("double").init();

    expect(match.activePlayer.type).toBe("real");
    match.switchTurn();
    expect(match.activePlayer.type).toBe("real");
  });

  it("sets up player types correctly for random mode", () => {
    match.setMode("random").init();

    expect(match.activePlayer.type).toBe("computer");
    match.switchTurn();
    expect(match.activePlayer.type).toBe("computer");
  });

  it("sets up player with default names for single mode", () => {
    match.setMode("single").init();

    expect(match.activePlayer.name).toBe("Player 1");
    match.switchTurn();
    expect(match.activePlayer.name).toBe("Player 2");
  });

  it("sets up player with default names for double mode", () => {
    match.setMode("double").init();

    expect(match.activePlayer.name).toBe("Player 1");
    match.switchTurn();
    expect(match.activePlayer.name).toBe("Player 2");
  });

  it("sets up player with custom name for single mode", () => {
    match.setMode("single").setPlayers("Bob").init();

    expect(match.activePlayer.name).toBe("Bob");
  });

  it("sets up players with custom name for double mode", () => {
    match.setMode("double").setPlayers("Bill", "John").init();

    expect(match.activePlayer.name).toBe("Bill");
    match.switchTurn();
    expect(match.activePlayer.name).toBe("John");
  });

  it("sets up players with boards from GameBoard constructor", () => {
    match.setMode("single").init();

    expect(match.activePlayer.board).toBeInstanceOf(GameBoard);
    match.switchTurn();
    expect(match.activePlayer.board).toBeInstanceOf(GameBoard);
  });

  it("sets up players with unique board instances", () => {
    match.setMode("single").init();

    const board1 = match.activePlayer.board;
    match.switchTurn();
    const board2 = match.activePlayer.board;

    expect(board1).not.toBe(board2);
  });

  it("sets up players' board as 10x10", () => {
    match.setMode("single").init();

    const board1Rows = match.activePlayer.board.rows;
    const board1Cols = match.activePlayer.board.cols;
    expect(board1Rows).toBe(10);
    expect(board1Cols).toBe(10);

    match.switchTurn();

    const board2Rows = match.activePlayer.board.rows;
    const board2Cols = match.activePlayer.board.cols;
    expect(board2Rows).toBe(10);
    expect(board2Cols).toBe(10);
  });

  it("sets up players' board with default fleet", () => {
    match.setMode("single").init();

    expect(match.activePlayer.board.fleet.length).toBeGreaterThan(0);
    expect(match.activePlayer.board.fleet.length).toBe(5);

    match.switchTurn();

    expect(match.activePlayer.board.fleet.length).toBeGreaterThan(0);
    expect(match.activePlayer.board.fleet.length).toBe(5);
  });

  it("returns match instance", () => {
    match.setMode("single");

    expect(match.init()).toBe(match);
  });
});
