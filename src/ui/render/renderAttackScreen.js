import { renderBoard } from "./index.js";

const renderAttackScreen = (match, showShips = false) => {
  const overlay = document.body.querySelector(".screen-overlay");
  const cellsContainer = overlay.querySelector("main .cells");

  overlay.dataset.screen = "attack";
  renderBoard(match.defender.board.peak, showShips);
  cellsContainer?.firstElementChild?.focus();
};

export { renderAttackScreen };
