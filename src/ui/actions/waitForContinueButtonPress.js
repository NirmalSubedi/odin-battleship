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

    const handleKey = (event) => {
      if (!event.code || event.code !== "KeyC") return;
      if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey)
        return;
      event.preventDefault();

      continueBtn.click();
      document.removeEventListener("keydown", handleKey);
    };
    document.addEventListener("keydown", handleKey);
  });

export { waitForContinueButtonPress };
