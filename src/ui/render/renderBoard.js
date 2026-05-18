const CELL_ELEMENT = "button";

const renderBoard = (board) => {
  const cellsContainer = document.body.querySelector("main .board .cells");

  const rows = board.length;
  const cols = board[0].length;

  for (let r = 1; r <= rows; ++r) {
    for (let c = 1; c <= cols; ++c) {
      const cell = document.createElement(CELL_ELEMENT);

      cell.setAttribute("class", "cell");
      cell.setAttribute("data-x", c);
      cell.setAttribute("data-y", r);

      cellsContainer.appendChild(cell);
    }
  }
};

export { renderBoard };
