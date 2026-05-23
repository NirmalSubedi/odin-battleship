import { attackCell } from "./index.js";

const waitForAttack = async (match, inputSignal) =>
  new Promise((resolve) => {
    const cellsContainer = document.body.querySelector("main .cells");
    cellsContainer.addEventListener(
      "click",
      (event) => {
        resolve(attackCell(event, match));
      },
      { once: true, signal: inputSignal }
    );
  });

export { waitForAttack };
