import { HIT, MISS, SUNK, WATER } from "../../logic/index.js";

const CELL_ELEMENT = "button";

const setCellState = (r, c, cell, board, isSpectator) => {
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
    case WATER:
      state = "";
      break;
    default:
      if (isSpectator) state = "ship";
      else state = "";
      break;
  }
  cell.setAttribute("data-state", state);
};

const updateBoard = (board, isSpectator, cellsContainer) => {
  let cell = cellsContainer.firstElementChild;

  const rows = board.length;
  const cols = board[0].length;

  for (let r = 1; r <= rows; ++r) {
    for (let c = 1; c <= cols; ++c) {
      setCellState(r, c, cell, board, isSpectator);
      cell = cell?.nextElementSibling;
    }
  }
};

const renderBoard = (board = [], isSpectator = false) => {
  const cellsContainer = document.body.querySelector("main .board .cells");

  if (cellsContainer.firstElementChild) {
    updateBoard(board, isSpectator, cellsContainer);
    return;
  }
  cellsContainer.textContent = "";

  const rows = board.length;
  const cols = board[0].length;

  for (let r = 1; r <= rows; ++r) {
    for (let c = 1; c <= cols; ++c) {
      const cell = document.createElement(CELL_ELEMENT);

      cell.setAttribute("class", "cell");
      cell.setAttribute("data-x", c);
      cell.setAttribute("data-y", r);
      setCellState(r, c, cell, board, isSpectator);

      cellsContainer.appendChild(cell);
    }
  }
};

export { renderBoard };
