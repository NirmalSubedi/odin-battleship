import { placeShipsRandomly } from "./index.js";

const waitForContinueButtonPress = (match) =>
  new Promise((resolve) => {
    const continueBtn = document.body.querySelector(".buttons .continue");

    continueBtn.addEventListener(
      "click",
      () => {
        const player = match.activePlayer;

        if (player.lastPlacedShipIndex < player.dock.length) {
          placeShipsRandomly(match);
        }
        resolve();
      },
      { once: true }
    );
  });

export { waitForContinueButtonPress };
