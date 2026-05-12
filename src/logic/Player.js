class Player {
  type;
  board;
  #name;

  constructor({ type = "computer" } = {}) {
    this.type = type;
  }

  get name() {
    return this.#name;
  }

  setName(name = "Player") {
    if (typeof name !== "string")
      throw new TypeError(`(${name}) <- Name must be a string.`);
    this.#name = name;

    return this;
  }
}

export { Player };
