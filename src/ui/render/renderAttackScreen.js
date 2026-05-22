import { placeShipsRandomly } from "../actions/index.js";

const renderAttackScreen = (match, fleetController) => {
  const player = match.activePlayer;

  if (player.lastPlacedShipIndex < player.dock.length) {
    placeShipsRandomly(match);
  }

  match.switchTurn();
  match.randomizeBoard();
  match.switchTurn();

  const overlay = document.body.querySelector(".screen-overlay");
  const cellsContainer = overlay.querySelector("main .cells");

  overlay.dataset.screen = "attack";
  cellsContainer?.firstElementChild?.focus();
  fleetController.abort();
};

export { renderAttackScreen };
