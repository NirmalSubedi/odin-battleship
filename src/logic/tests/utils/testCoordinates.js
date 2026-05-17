const testWithNoCoordinates = (board, method, ...fillerCoordinates) => {
  expect(() => board[method](...fillerCoordinates)).toThrow(ReferenceError);
};

const testWithHalfCoordinates = (board, method, ...fillerCoordinates) => {
  expect(() => board[method](...fillerCoordinates, [1])).toThrow(
    ReferenceError
  );
};

const testWithOutOfBoundCoordinates = (board, method, ...fillerCoordinates) => {
  expect(() => board[method](...fillerCoordinates, [-1, 1])).toThrow(
    RangeError
  );
  expect(() => board[method](...fillerCoordinates, [1, -1])).toThrow(
    RangeError
  );
  expect(() => board[method](...fillerCoordinates, [-1, -1])).toThrow(
    RangeError
  );
  expect(() => board[method](...fillerCoordinates, [1, board.cols])).toThrow(
    RangeError
  );
  expect(() => board[method](...fillerCoordinates, [board.rows, 1])).toThrow(
    RangeError
  );
  expect(() =>
    board[method](...fillerCoordinates, [board.rows, board.cols])
  ).toThrow(RangeError);
};

const testWithNonIntegerCoordinates = (board, method, ...fillerCoordinates) => {
  expect(() => board[method](...fillerCoordinates, [1, 1])).not.toThrow(
    TypeError
  );
  expect(() => board[method](...fillerCoordinates, [1, undefined])).toThrow(
    TypeError
  );
  expect(() => board[method](...fillerCoordinates, [1n, 1])).toThrow(TypeError);
  expect(() => board[method](...fillerCoordinates, [0.1, 1])).toThrow(
    TypeError
  );
  expect(() => board[method](...fillerCoordinates, [1, NaN])).toThrow(
    TypeError
  );
  expect(() => board[method](...fillerCoordinates, [Infinity, 1])).toThrow(
    TypeError
  );
  expect(() => board[method](...fillerCoordinates, [1, -Infinity])).toThrow(
    TypeError
  );
  expect(() => board[method](...fillerCoordinates, ["1", 1])).toThrow(
    TypeError
  );
  expect(() => board[method](...fillerCoordinates, [false, 1])).toThrow(
    TypeError
  );
  expect(() => board[method](...fillerCoordinates, [1, ""])).toThrow(TypeError);
  expect(() => board[method](...fillerCoordinates, [[], 1])).toThrow(TypeError);
  expect(() => board[method](...fillerCoordinates, [1, {}])).toThrow(TypeError);
  expect(() => board[method](...fillerCoordinates, [1, () => {}])).toThrow(
    TypeError
  );
};

const testCoordinates = (board, method, ...fillerCoordinates) => {
  testWithNoCoordinates(board, method, ...fillerCoordinates);
  testWithHalfCoordinates(board, method, ...fillerCoordinates);
  testWithOutOfBoundCoordinates(board, method, ...fillerCoordinates);
  testWithNonIntegerCoordinates(board, method, ...fillerCoordinates);
};

export { testCoordinates };
