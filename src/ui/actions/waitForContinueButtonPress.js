import { placeShipsRandomly } from "./index.js";

const waitForContinueButtonPress = (match) =>
  new Promise((resolve) => {
    const continueBtn = document.body.querySelector(".buttons .continue");

    continueBtn.addEventListener(
      "click",
      () => {
        const player = match.activePlayer;

        if (player.dock.length > 0) {
          placeShipsRandomly(match);
        }
        resolve();
      },
      { once: true }
    );
  });

export { waitForContinueButtonPress };
