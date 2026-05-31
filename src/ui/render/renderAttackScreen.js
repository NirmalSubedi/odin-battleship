import { renderBoard } from "./index.js";
import { focusTopOfPage } from "../actions/focusTopOfPage.js";

const renderAttackScreen = (match, showShips = false) => {
  const overlay = document.body.querySelector(".screen-overlay");

  overlay.dataset.screen = "attack";
  renderBoard(match.defender.board.peak, showShips);

  if (match.activePlayer.lastFocusedElement) {
    match.activePlayer.lastFocusedElement.focus();
  } else {
    focusTopOfPage();
  }
};

export { renderAttackScreen };
