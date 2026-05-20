import {
  renderBoard,
  renderShip,
  renderAsideShips,
  renderAnnouncement,
  renderBoardLabel,
} from "./render/index.js";
import {
  getModeSelection,
  moveOrthogonallyOnBoard,
  placeShipsRandomly,
  resetShipsPlacements,
  toggleSkipLink,
} from "./actions/index.js";
import { Match } from "../logic/index.js";

const game = {
  match: new Match(),
  player1Placed: false,
  player2Placed: false,
};

toggleSkipLink();

const overlay = document.querySelector(".screen-overlay");
const skipLink = document.querySelector(".skip-link");
const buttons = document.querySelector(".buttons");

skipLink.addEventListener("click", (event) => {
  event.preventDefault();
  buttons.firstElementChild?.focus();
});

const attachShipPlacementListeners = (match) => {
  const cellsContainer = document.querySelector("main .cells");

  cellsContainer.addEventListener("click", (event) => {
    renderShip(event, match);
  });

  cellsContainer.addEventListener("keydown", (event) => {
    const { board } = game.match.activePlayer;
    moveOrthogonallyOnBoard(event, board);
  });

  const randomizeBoardBtn = buttons.querySelector(".randomize-board");
  randomizeBoardBtn.addEventListener("click", () => {
    placeShipsRandomly(game.match);
  });

  document.addEventListener("keydown", (event) => {
    if (overlay.dataset.screen !== "fleet" || event.code !== "KeyS") return;
    placeShipsRandomly(game.match);
  });

  const resetBoardBtn = buttons.querySelector(".reset-board");
  resetBoardBtn.addEventListener("click", () => {
    resetShipsPlacements(game.match);
  });

  document.addEventListener("keydown", (event) => {
    if (overlay.dataset.screen !== "fleet" || event.code !== "KeyR") return;
    resetShipsPlacements(game.match);
  });
};

const prepareSinglePlayer = (match, mode) => {
  match.setMode(mode).init();
  overlay.dataset.screen = "fleet";

  const board = match.activePlayer.board.peak;
  const { dock } = match.activePlayer;

  renderBoard(board);
  renderAsideShips(dock);
  renderBoardLabel("Your Board");
  renderAnnouncement("Place Fleet");

  attachShipPlacementListeners(match);
  toggleSkipLink();
};

const prepareDoublePlayer = (match, mode) => {
  match.setMode(mode).init();

  overlay.dataset.screen = "name";
  overlay.querySelector(".name-selection input").focus();
};

const selectMode = (event, match) => {
  const mode = getModeSelection(event);
  if (mode === undefined) return;

  switch (mode) {
    case "single":
      prepareSinglePlayer(match, mode);
      break;

    case "double":
      prepareDoublePlayer(match, mode);
      break;

    default:
      throw new ReferenceError(`(${mode}) is a unknown mode.`);
  }
};

const gameModes = overlay.querySelector(".game-modes");
gameModes.addEventListener("click", (event) => selectMode(event, game.match));
gameModes.addEventListener("keydown", (event) => selectMode(event, game.match));
