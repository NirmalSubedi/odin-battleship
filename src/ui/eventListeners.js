import { GameBoard, Player, Ship } from "../index.js";

const skipLink = document.querySelector(".skip-link");
const buttons = document.querySelector(".buttons");
skipLink.addEventListener("click", (event) => {
  event.preventDefault();
  buttons.focus();
});
