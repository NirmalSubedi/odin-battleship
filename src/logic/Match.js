import { Player } from "./index.js";

class Match {
  #mode;
  #activePlayer;
  #player1;
  #player2;

  get mode() {
    return this.#mode;
  }

  get activePlayer() {
    return this.#activePlayer;
  }

  get player1() {
    return this.#player1;
  }

  get player2() {
    return this.#player2;
  }

  #validateMode(mode) {
    if (typeof mode !== "string")
      throw new TypeError(`${typeof mode} <- Mode must be a string.`);

    const isValidMode = mode === "single" || mode === "double";
    if (!isValidMode)
      throw new ReferenceError(`${mode} <- Mode is an invalid mode.`);
  }

  #validatePlayerNames(...names) {
    names.forEach((name, index) => {
      if (typeof name !== "string")
        throw new TypeError(
          `(${typeof name}) <- Player${index + 1} name must be a string.`
        );
    });
  }

  #validatePlayerObjects() {
    if (this.#player1 === undefined || this.#player2 === undefined)
      throw new ReferenceError(
        "Players not found. Call the setPlayers() method first."
      );
  }

  setMode(modeName) {
    this.#validateMode(modeName);

    this.#mode = modeName;

    return this;
  }

  setPlayers(player1Name, player2Name) {
    if (this.#mode === undefined)
      throw new ReferenceError(
        "Mode not found. Set mode first by calling setMode() method."
      );

    if (this.#mode === "single") {
      this.#validatePlayerNames(player1Name);

      this.#player1 = new Player("real").setName(player1Name);
      this.#player2 = new Player().setName("Opponent");
    } else if (this.#mode === "double") {
      this.#validatePlayerNames(player1Name, player2Name);

      this.#player1 = new Player("real").setName(player1Name);
      this.#player2 = new Player("real").setName(player2Name);
    }

    return this;
  }

  switchTurn() {
    this.#validatePlayerObjects();

    const NO_ACTIVE_PLAYER = undefined;

    switch (this.#activePlayer) {
      case NO_ACTIVE_PLAYER:
        this.#activePlayer = this.#player1;
        break;

      case this.#player2:
        this.#activePlayer = this.#player1;
        break;

      case this.#player1:
        this.#activePlayer = this.#player2;
        break;

      default:
        throw new ReferenceError("Unknown Player.");
    }

    return this;
  }
}

export { Match };
