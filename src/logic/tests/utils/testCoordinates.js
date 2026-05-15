const testWithNoCoordinates = (board, method) => {
  expect(() => board[method]()).toThrow(ReferenceError);
};

const testWithHalfCoordinates = (board, method) => {
  expect(() => board[method]([1])).toThrow(ReferenceError);
};

const testWithOutOfBoundCoordinates = (board, method) => {
  expect(() => board[method]([-1, 1])).toThrow(RangeError);
  expect(() => board[method]([1, -1])).toThrow(RangeError);
  expect(() => board[method]([-1, -1])).toThrow(RangeError);
  expect(() => board[method]([1, board.cols])).toThrow(RangeError);
  expect(() => board[method]([board.rows, 1])).toThrow(RangeError);
  expect(() => board[method]([board.rows, board.cols])).toThrow(RangeError);
};

const testWithNonIntegerCoordinates = (board, method) => {
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
};

const testCoordinates = (board, method) => {
  testWithNoCoordinates(board, method);
  testWithHalfCoordinates(board, method);
  testWithOutOfBoundCoordinates(board, method);
  testWithNonIntegerCoordinates(board, method);
};

export { testCoordinates };
