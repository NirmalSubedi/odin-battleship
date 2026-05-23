import { processNames } from "./index.js";

const waitForNameInputs = (match) =>
  new Promise((resolve) => {
    const continueBtn = document.body.querySelector(".buttons .continue");

    continueBtn.addEventListener(
      "click",
      () => {
        resolve(processNames(match));
      },
      { once: true }
    );
  });

export { waitForNameInputs };
