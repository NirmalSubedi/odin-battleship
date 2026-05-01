import { Ship } from "../index.js";
import { isNumeric, hasMethod } from "./utils/index.js";

describe("Ship Constructor", () => {
  it("exists", () => {
    expect(typeof Ship).toBe("function");
  });

  let ship;
  beforeAll(() => {
    ship = new Ship();
  });

  it("creates instance", () => {
    expect(ship instanceof Ship).toBe(true);
  });

  it("ship has length property", () => {
    expect(ship.length).toBeDefined();
  });
  it("length property is numeric", () => {
    expect(isNumeric(ship.length)).toBe(true);
  });
  it("length property is zero by default", () => {
    expect(ship.length).toBe(0);
  });

  it("ship has hits property", () => {
    expect(ship.hits).toBeDefined();
  });
  it("hits property is numeric", () => {
    expect(isNumeric(ship.hits)).toBe(true);
  });
  it("hits property is zero by default", () => {
    expect(ship.hits).toBe(0);
  });
});

describe("setLength method", () => {
  it("exists", () => hasMethod(Ship, "setLength"));

  let ship;
  beforeEach(() => {
    ship = new Ship();
  });

  it("throws TypeError for non-integer type", () => {
    expect(() => ship.setLength()).toThrow(TypeError);
    expect(() => ship.setLength(NaN)).toThrow(TypeError);
    expect(() => ship.setLength(Infinity)).toThrow(TypeError);
    expect(() => ship.setLength(-Infinity)).toThrow(TypeError);
    expect(() => ship.setLength(0.1)).toThrow(TypeError);
    expect(() => ship.setLength("")).toThrow(TypeError);
    expect(() => ship.setLength(null)).toThrow(TypeError);
    expect(() => ship.setLength(false)).toThrow(TypeError);
    expect(() => ship.setLength([])).toThrow(TypeError);
    expect(() => ship.setLength({})).toThrow(TypeError);
    expect(() => ship.setLength(() => {})).toThrow(TypeError);
  });

  it("throws RangeError for negative numbers", () => {
    expect(() => ship.setLength(-1)).toThrow(RangeError);
    expect(() => ship.setLength(-1n)).toThrow(RangeError);
  });

  it("does not throw for integers", () => {
    expect(() => ship.setLength(1)).not.toThrow();
    expect(() => ship.setLength(1n)).not.toThrow();
  });

  it("updates length", () => {
    ship.setLength(1);
    expect(ship.length).toBe(1);

    ship.setLength(2);
    expect(ship.length).toBe(2);
  });

  it("returns instance for chaining", () => {
    expect(ship.setLength(1)).toBe(ship);
  });
});

describe("hit method", () => {
  it("exists", () => hasMethod(Ship, "hit"));

  let ship;
  beforeEach(() => {
    ship = new Ship();
  });

  it("increases number of hits", () => {
    expect(ship.hits).toBe(0);

    ship.hit();
    expect(ship.hits).toBeGreaterThan(0);
  });

  it("increases hits by one", () => {
    expect(ship.hits).toBe(0);

    ship.hit();
    expect(ship.hits).toBe(1);

    ship.hit();
    expect(ship.hits).toBe(2);

    const count = 10;
    for (let i = 0; i < count; ++i) ship.hit();
    expect(ship.hits).toBe(count + 2);
  });

  it("returns instance for chaining", () => {
    expect(ship.hit()).toBe(ship);
  });
});

describe("isSunk method", () => {
  it("exists", () => hasMethod(Ship, "isSunk"));

  let ship;
  beforeEach(() => {
    ship = new Ship();
  });

  it("returns true for ship of length zero", () => {
    expect(ship.length).toBe(0);
    expect(ship.isSunk()).toBe(true);
  });

  it("returns true when hits and length are equal", () => {
    ship.setLength(2).hit().hit();
    expect(ship.isSunk()).toBe(true);
  });

  it("returns false when hits is below length", () => {
    ship.setLength(10).hit().hit().hit().hit().hit();
    expect(ship.isSunk()).toBe(false);
  });
});
