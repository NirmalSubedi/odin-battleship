import { attackCell } from "./index.js";

const waitForAttack = async (match, cellsContainer, signal) =>
  new Promise((resolve) => {
    cellsContainer.addEventListener(
      "click",
      (event) => {
        resolve(attackCell(event, match));
      },
      { once: true, signal }
    );
  });

export { waitForAttack };
