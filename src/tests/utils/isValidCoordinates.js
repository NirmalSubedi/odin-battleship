const isValidCoordinates = (board = {}, method = "") => {
  it("throws ReferenceError for no coordinates", () => {
    expect(() => board[method]()).toThrow(ReferenceError);
  });

  it("throws TypeError for non-integer coordinates", () => {
    expect(() => board[method]([1, 1])).not.toThrow(TypeError);
    expect(() => board[method]([1, undefined])).toThrow(TypeError);
    expect(() => board[method]([1n, 1])).toThrow(TypeError);
    expect(() => board[method]([0.1, 1])).toThrow(TypeError);
    expect(() => board[method]([1, NaN])).toThrow(TypeError);
    expect(() => board[method]([Infinity, 1])).toThrow(TypeError);
    expect(() => board[method]([1, -Infinity])).toThrow(TypeError);
    expect(() => board[method](["1", 1])).toThrow(TypeError);
    expect(() => board[method]([false, 1])).toThrow(TypeError);
    expect(() => board[method]([1, ""])).toThrow(TypeError);
    expect(() => board[method]([[], 1])).toThrow(TypeError);
    expect(() => board[method]([1, {}])).toThrow(TypeError);
    expect(() => board[method]([1, () => {}])).toThrow(TypeError);
  });

  it("throws ReferenceError for half of coordinates", () => {
    expect(() => board[method]([1])).toThrow(ReferenceError);
  });

  it("throws RangeError for out of bound coordinates", () => {
    expect(() => board[method]([-1, 1])).toThrow(RangeError);
    expect(() => board[method]([1, -1])).toThrow(RangeError);
    expect(() => board[method]([-1, -1])).toThrow(RangeError);
    expect(() => board[method]([1, board.cols])).toThrow(RangeError);
    expect(() => board[method]([board.rows, 1])).toThrow(RangeError);
    expect(() => board[method]([board.rows, board.cols])).toThrow(RangeError);
  });
};

export { isValidCoordinates };
