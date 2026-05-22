import { renderBoard } from "./index.js";
import { placeShipsRandomly, delay } from "../actions/index.js";

const renderAttackScreen = async (match, fleetController) => {
  const player = match.activePlayer;

  if (player.lastPlacedShipIndex < player.dock.length) {
    placeShipsRandomly(match);
    await delay(1000);
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
