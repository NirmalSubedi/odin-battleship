class Player {
  type;
  board;

  constructor({ type = "computer" } = {}) {
    this.type = type;
  }
}

export { Player };
