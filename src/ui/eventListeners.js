import {
  renderShipPlacement,
  renderAttackScreen,
  renderSinglePlayerEndScreen,
} from "./render/index.js";
import {
  getModeSelection,
  moveOrthogonallyOnBoard,
  placeShipsRandomly,
  resetShipsPlacements,
  toggleSkipLink,
  prepareSinglePlayer,
  runSinglePlayer,
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
  buttons?.firstElementChild?.focus();
});

const fleetController = new AbortController();

const cellsContainer = document.querySelector("main .cells");
cellsContainer.addEventListener("keydown", (event) => {
  const { board } = game.match.activePlayer;
  moveOrthogonallyOnBoard(event, board);
});

const modes = {
  gameLoops: {
    single: runSinglePlayer,
  },
  endScreens: {
    single: renderSinglePlayerEndScreen,
  },
};

const processAttackScreen = async (match) => {
  await renderAttackScreen(match, fleetController);

  const gameLoop = modes.gameLoops[match.mode];
  await gameLoop(match);

  const endScreen = modes.endScreens[match.mode];
  endScreen(match);
};

const attachShipPlacementListeners = (match) => {
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

  const continueBtn = buttons.querySelector(".continue");
  continueBtn.addEventListener(
    "click",
    () => {
      processAttackScreen(match);
    },
    { signal: fleetController.signal }
  );
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
      prepareSinglePlayer(match, mode, attachShipPlacementListeners);
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
