class Match {
  #mode;
  #activePlayer;
  #players = new Map();

  get mode() {
    return this.#mode;
  }

  get activePlayer() {
    return this.#activePlayer;
  }

  #validateMode(mode) {
    const isValidMode = mode === "single" || mode === "double";
    if (!isValidMode)
      throw new ReferenceError(`${mode} <- Mode is an invalid mode.`);

    return mode;
  }

  setMode(modeName) {
    this.#mode = this.#validateMode(modeName);

    return this;
  }

  setPlayers(player1, player2) {
    this.#players.set("player1", player1);
    this.#players.set("player2", player2);

    return this;
  }

  switchTurn() {
    const NO_ACTIVE_PLAYER = undefined;

    switch (this.#activePlayer) {
      case NO_ACTIVE_PLAYER:
        this.#activePlayer = this.#players.get("player1");
        break;

      case this.#players.get("player2"):
        this.#activePlayer = this.#players.get("player1");
        break;

      case this.#players.get("player1"):
        this.#activePlayer = this.#players.get("player2");
        break;

      default:
        throw new ReferenceError("Unknown Player.");
    }

    return this;
  }
}

export { Match };
