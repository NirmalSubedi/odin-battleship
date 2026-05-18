const renderCell = (startCoordinates, state, direction, length) => {
  let [currRow, currCol] = startCoordinates;
  const [dr, dc] = direction;
  const cellsContainer = document.body.querySelector("main .cells");

  for (let i = 0; i < length; ++i) {
    const cellElm = cellsContainer.querySelector(
      `[data-y="${currRow + 1}"][data-x="${currCol + 1}"]`
    );

    cellElm.dataset.state = state;
    currRow += dr;
    currCol += dc;
  }
};

export { renderCell };
