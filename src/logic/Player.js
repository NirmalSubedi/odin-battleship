class Player {
  type;
  board;
  stats = {};
  dock = [];
  #name;

  constructor(type = "computer") {
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

  clearDock() {
    this.dock.length = 0;

    return this;
  }
}

export { Player };
