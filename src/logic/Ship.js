class Ship {
  #length = 0;
  #hits = 0;

  get hits() {
    return this.#hits;
  }

  get length() {
    return this.#length;
  }

  setLength(n) {
    if (!Number.isInteger(n) && typeof n !== "bigint")
      throw new TypeError("Expected length to be an integer.");
    if (n < 0) throw new RangeError("Length must be non-negative.");

    this.#length = n;
    return this;
  }

  hit() {
    ++this.#hits;
    return this;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}

export { Ship };
