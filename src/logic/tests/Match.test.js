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

  it("sets up players' dock with default dock", () => {
    match.setMode("single").init();

    expect(match.activePlayer.dock.length).toBeGreaterThan(0);
    expect(match.activePlayer.dock.length).toBe(5);

    match.switchTurn();

    expect(match.activePlayer.dock.length).toBeGreaterThan(0);
    expect(match.activePlayer.dock.length).toBe(5);
  });

  it("sets up players' stats", () => {
    match.setMode("single").init();

    expect(match.activePlayer.stats).toEqual({
      hits: 0,
      shots: 0,
      shipsSunk: 0,
    });
    match.switchTurn();
    expect(match.activePlayer.stats).toEqual({
      hits: 0,
      shots: 0,
      shipsSunk: 0,
    });
  });

  it("returns match instance", () => {
    match.setMode("single");

    expect(match.init()).toBe(match);
  });
});

describe("getPlayerStats", () => {
  it("exists", () => hasMethod(Match, "getPlayerStats"));

  it("return active player's stats", () => {
    const match = new Match().setMode("single").init();

    expect(match.getPlayerStats()).toEqual({
      hits: 0,
      shots: 0,
      shipsSunk: 0,
    });
  });
});

describe("attack method", () => {
  it("exists", () => hasMethod(Match, "attack"));

  let match;
  beforeEach(() => {
    match = new Match().setMode("single").init();
  });

  it("calls receiveAttack on correct player's board", () => {
    const player1Board = match.activePlayer.board;
    match.switchTurn();
    const player2Board = match.activePlayer.board;

    const player1AttackReceiver = jest.spyOn(player1Board, "receiveAttack");
    const player2AttackReceiver = jest.spyOn(player2Board, "receiveAttack");

    match.attack([0, 0]);
    expect(player1AttackReceiver).toHaveBeenCalledWith([0, 0]);
    expect(player2AttackReceiver).not.toHaveBeenCalled();
  });

  it("throws ReferenceError when players are not set", () => {
    match = new Match();

    expect(() => match.attack()).toThrow(ReferenceError);
  });

  it("updates correct player's stats", () => {
    const player1Stats = match.getPlayerStats();
    match.switchTurn();
    const player2Stats = match.getPlayerStats();

    expect(player1Stats).toEqual({
      hits: 0,
      shots: 0,
      shipsSunk: 0,
    });
    expect(player2Stats).toEqual({
      hits: 0,
      shots: 0,
      shipsSunk: 0,
    });

    match.attack([0, 0]);

    expect(player1Stats).toEqual({
      hits: 0,
      shots: 0,
      shipsSunk: 0,
    });
    expect(player2Stats).toEqual({
      hits: 0,
      shots: 1,
      shipsSunk: 0,
    });
  });

  it("updates player's stats correctly", () => {
    match.place([0, 0]);
    match.switchTurn();
    const stats = match.getPlayerStats();

    match.attack([0, 0]);
    expect(stats).toEqual({
      hits: 1,
      shots: 1,
      shipsSunk: 0,
    });

    match.attack([1, 0]);
    match.attack([2, 0]);
    match.attack([3, 0]);
    match.attack([4, 0]);

    expect(stats).toEqual({
      hits: 5,
      shots: 5,
      shipsSunk: 1,
    });
  });

  it("returns object to report attack status", () => {
    expect(typeof match.attack([0, 0])).toBe("object");
  });
});

describe("place method", () => {
  it("exists", () => hasMethod(Match, "place"));

  let match;
  beforeEach(() => {
    match = new Match().setMode("single").init();
  });

  it("calls placeShip on correct player's board", () => {
    const player1Board = match.activePlayer.board;
    match.switchTurn();
    const player2Board = match.activePlayer.board;

    const player1Placer = jest.spyOn(player1Board, "placeShip");
    const player2Placer = jest.spyOn(player2Board, "placeShip");

    match.place([0, 0]);
    expect(player1Placer).not.toHaveBeenCalled();
    expect(player2Placer).toHaveBeenCalled();
  });

  it("places ship from player's dock on player's board", () => {
    const { board } = match.activePlayer;

    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);

    match.place([0, 0]);
    expect(board.peak).toEqual([
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it("places multiple ships", () => {
    const { board } = match.activePlayer;

    expect(board.peak).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);

    match.place([0, 0]);
    match.place([0, 1]);
    match.place([0, 2]);
    expect(board.peak).toEqual([
      [1, 2, 3, 0, 0, 0, 0, 0, 0, 0],
      [1, 2, 3, 0, 0, 0, 0, 0, 0, 0],
      [1, 2, 3, 0, 0, 0, 0, 0, 0, 0],
      [1, 2, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it("throws RangeError when placing more ships than player's dock", () => {
    const { dock } = match.activePlayer;
    let i = 0;
    for (; i < dock.length; ++i) {
      match.place([0, i]);
    }

    expect(() => match.place([0, i + 1])).toThrow(RangeError);
  });

  it("throws ReferenceError when players are not set", () => {
    match = new Match();

    expect(() => match.place()).toThrow(ReferenceError);
  });

  it("return true if placed", () => {
    expect(match.place([0, 0])).toBe(true);
  });

  it("return false if not placed", () => {
    match.place([0, 0]);
    expect(match.place([0, 0])).toBe(false);
  });
});

describe("isGameOver", () => {
  it("exists", () => hasMethod(Match, "isGameOver"));

  let match;
  beforeEach(() => {
    match = new Match();
    match.setMode("single").init();
  });

  it("calls the correct player's board isFleetSunk method", () => {
    const player1Board = match.activePlayer.board;
    const player1Method = jest.spyOn(player1Board, "isFleetSunk");

    match.switchTurn();
    const player2Board = match.activePlayer.board;
    const player2Method = jest.spyOn(player2Board, "isFleetSunk");

    expect(player1Method).not.toHaveBeenCalled();
    expect(player2Method).not.toHaveBeenCalled();

    match.isGameOver();
    expect(player1Method).toHaveBeenCalled();
    expect(player2Method).not.toHaveBeenCalled();
  });

  it("throws ReferenceError for no players set", () => {
    match = new Match();
    expect(() => match.isGameOver()).toThrow(ReferenceError);
  });

  it("returns true for game over", () => {
    expect(match.isGameOver()).toBe(true);
  });

  it("returns false not game over", () => {
    match.place([0, 0]);
    match.switchTurn();
    match.place([0, 0]);

    expect(match.isGameOver()).toBe(false);
  });
});
