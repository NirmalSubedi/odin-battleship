import { renderShipPlacement } from "../render/index.js";
import { placeShipsRandomly, resetShipsPlacements } from "./index.js";

const attachFleetControls = (match, fleetController) => {
  const overlay = document.body.querySelector(".screen-overlay");
  const buttons = document.body.querySelector(".buttons");

  const cellsContainer = document.body.querySelector("main .cells");
  cellsContainer.addEventListener(
    "click",
    (event) => {
      renderShipPlacement(event, match);
    },
    { signal: fleetController.signal }
  );

  const randomizeBoardBtn = buttons.querySelector(".randomize-board");
  randomizeBoardBtn.addEventListener(
    "click",
    () => {
      placeShipsRandomly(match);
    },
    { signal: fleetController.signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (overlay.dataset.screen !== "fleet" || event.code !== "KeyS") return;
      placeShipsRandomly(match);
    },
    { signal: fleetController.signal }
  );

  const resetBoardBtn = buttons.querySelector(".reset-board");
  resetBoardBtn.addEventListener(
    "click",
    () => {
      resetShipsPlacements(match);
    },
    { signal: fleetController.signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (overlay.dataset.screen !== "fleet" || event.code !== "KeyR") return;
      resetShipsPlacements(match);
    },
    { signal: fleetController.signal }
  );
};

export { attachFleetControls };
