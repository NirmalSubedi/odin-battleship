import { Player, GameBoard, Ship } from "./index.js";

const config = {
  player1Name: "Player 1",
  player2Name: "Player 2",
  defaultDock: [
    ["carrier", 5],
    ["battleship", 4],
    ["cruiser", 3],
    ["submarine", 3],
    ["destroyer", 2],
  ],
  stats: [
    ["hits", 0],
    ["shots", 0],
    ["shipsSunk", 0],
  ],
};

function setupPlayerBoards(players) {
  players.forEach((player) => {
    player.board = new GameBoard();
  });
}

function addShipToPlayerFleet(player, length, name) {
  const ship = new Ship().setLength(length).setName(name);
  player.dock.push(ship);

  return ship;
}

function setupPlayersDock(players) {
  players.forEach((player) => {
    config.defaultDock.forEach(([shipName, shipLength]) => {
      addShipToPlayerFleet(player, shipLength, shipName);
    });
  });
}

function setupPlayerStats(players) {
  players.forEach((player) => {
    config.stats.forEach(([stat, statValue]) => {
      player.stats[stat] = statValue;
    });
  });
}

function setupSinglePlayer(...names) {
  const [player1Name, player2Name] = names;
  const player1 = new Player("real").setName(player1Name ?? config.player1Name);
  const player2 = new Player().setName(player2Name ?? config.player2Name);

  this.setPlayers(player1, player2);
}

function setupDoublePlayers(...names) {
  const [player1Name, player2Name] = names;
  const player1 = new Player("real").setName(player1Name ?? config.player1Name);
  const player2 = new Player("real").setName(player2Name ?? config.player2Name);

  this.setPlayers(player1, player2);
}

function setupRandomPlayers(...names) {
  const [player1Name, player2Name] = names;
  const player1 = new Player().setName(player1Name ?? config.player1Name);
  const player2 = new Player().setName(player2Name ?? config.player2Name);

  this.setPlayers(player1, player2);
}

const knownModes = new Set(["random", "single", "double"]);

const playerSetups = {
  random: setupRandomPlayers,
  single: setupSinglePlayer,
  double: setupDoublePlayers,
};

class Match {
  #mode;
  #players = [];
  #activePlayer;
  #activePlayerIndex;

  get mode() {
    return this.#mode;
  }

  get activePlayer() {
    return this.#activePlayer;
  }

  #isValidMode(mode) {
    return knownModes.has(mode);
  }

  #validateMode(mode) {
    if (!this.#isValidMode(mode))
      throw new ReferenceError(`${mode} <- Mode is an invalid mode.`);

    return mode;
  }

  setMode(modeName = "") {
    this.#mode = this.#validateMode(modeName);

    return this;
  }

  setPlayers(...players) {
    this.#players = players;

    return this;
  }

  #chooseActivePlayer() {
    this.#activePlayerIndex = 0;
    this.#activePlayer = this.#players[this.#activePlayerIndex];
  }

  #changeActivePlayer() {
    this.#activePlayerIndex = ++this.#activePlayerIndex % this.#players.length;
    this.#activePlayer = this.#players[this.#activePlayerIndex];
  }

  switchTurn() {
    const NO_ACTIVE_PLAYER = undefined;

    switch (this.#activePlayer) {
      case NO_ACTIVE_PLAYER:
        this.#chooseActivePlayer();
        break;

      default:
        this.#changeActivePlayer();
    }

    return this;
  }

  init() {
    this.#validateMode(this.#mode);

    const playerSetup = playerSetups[this.#mode];
    const customNames = this.#players;

    if (playerSetup === undefined)
      throw new ReferenceError(`No setup created for ${this.#mode}  mode.`);

    playerSetup.call(this, ...customNames);
    setupPlayerBoards(this.#players);
    setupPlayersDock(this.#players);
    setupPlayerStats(this.#players);

    this.#chooseActivePlayer();

    return this;
  }

  getPlayerStats() {
    return this.#activePlayer.stats;
  }

  #updatePlayerStats(statusObject) {
    if (statusObject === null) return null;

    const { hit, sunk } = statusObject;
    const { stats } = this.#activePlayer;

    ++stats.shots;
    if (hit) ++stats.hits;
    if (sunk) ++stats.shipsSunk;
  }

  #getDefender() {
    return this.#players.find((player) => player !== this.#activePlayer);
  }

  attack(coordinates) {
    const defender = this.#getDefender();

    if (defender === undefined)
      throw new ReferenceError("Players are not set.");

    const status = defender.board.receiveAttack(coordinates);

    this.#updatePlayerStats(status);

    return status;
  }

  place(coordinates) {
    if (this.#activePlayer === undefined)
      throw new ReferenceError("Players are not set.");

    const player = this.#activePlayer;

    player.lastPlacedIndex ??= 0;
    const { lastPlacedIndex } = this.#activePlayer;
    const ship = player.dock.at(lastPlacedIndex);

    if (ship === undefined)
      throw new RangeError("No more ships to place on player's board.");

    ++player.lastPlacedIndex;
    return player.board.placeShip(coordinates, ship.length, "", ship.name);
  }

  isGameOver() {
    const defender = this.#getDefender();
    if (defender === undefined)
      throw new ReferenceError("Players are not set.");

    return defender.board.isFleetSunk();
  }

  rematch() {
    const playerNames = this.#players.reduce((names, player) => {
      names.push(player.name);
      return names;
    }, []);

    this.#players.length = 0;
    this.setPlayers(...playerNames).init();
    this.switchTurn();

    return this;
  }
}

export { Match };
