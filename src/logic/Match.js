class Match {
  #mode = "single";
  #attacker;
  #player1;
  #player2;

  get mode() {
    return this.#mode;
  }

  get attacker() {
    return this.#attacker;
  }

  get player1() {
    return this.#player1;
  }

  get player2() {
    return this.#player2;
  }

  setMode(mode = "") {
    this.#mode = mode;

    return this;
  }

  setPlayers(player1, player2) {
    this.#player1 = player1;
    this.#player1 = player2;

    return this;
  }

  setAttacker(player) {
    this.#attacker = player;

    return this;
  }

  switchTurn(player1 = {}, player2 = {}) {
    this.#attacker = this.attacker === player1 ? player2 : player1;

    return this;
  }
}

export { Match };
