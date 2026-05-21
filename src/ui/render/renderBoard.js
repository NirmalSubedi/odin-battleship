import { HIT, MISS, SUNK } from "../../logic/index.js";

const CELL_ELEMENT = "button";

const renderBoard = (board = []) => {
  const cellsContainer = document.body.querySelector("main .board .cells");
  cellsContainer.textContent = "";

  const rows = board.length;
  const cols = board[0].length;

  for (let r = 1; r <= rows; ++r) {
    for (let c = 1; c <= cols; ++c) {
      const cell = document.createElement(CELL_ELEMENT);

      cell.setAttribute("class", "cell");
      cell.setAttribute("data-x", c);
      cell.setAttribute("data-y", r);

      let state;
      const mark = board[r - 1][c - 1];
      switch (mark) {
        case HIT:
          state = "hit";
          break;
        case MISS:
          state = "miss";
          break;
        case SUNK:
          state = "sunk";
          break;
        default:
          state = "";
          break;
      }
      cell.setAttribute("data-state", state);

      cellsContainer.appendChild(cell);
    }
  }
};

export { renderBoard };
