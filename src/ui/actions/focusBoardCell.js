const focusBoardCell = (coordinates = [0, 0]) => {
  const [row, col] = coordinates;
  const cell = document.body.querySelector(
    `main .cells .cell[data-x='${col + 1}'][data-y='${row + 1}']`
  );
  cell?.focus();
};

export { focusBoardCell };
