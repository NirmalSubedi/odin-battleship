import {
  renderShipPlacement,
  renderAttackScreen,
  renderSinglePlayerEndScreen,
  renderAnnouncement,
} from "./render/index.js";
import {
  getModeSelection,
  moveOrthogonallyOnBoard,
  placeShipsRandomly,
  resetShipsPlacements,
  toggleSkipLink,
  prepareSinglePlayer,
  runSinglePlayer,
  toggleAnnouncementTheme,
} from "./actions/index.js";
import { Match } from "../logic/index.js";

const overlay = document.querySelector(".screen-overlay");
const buttons = document.querySelector(".buttons");

const modes = {
  gameLoops: {
    single: runSinglePlayer,
  },
  endScreens: {
    single: renderSinglePlayerEndScreen,
  },
};

let match = new Match();
let fleetController;
let matchController;

const processAttackScreen = async (match) => {
  renderAttackScreen(match, fleetController);
  matchController = new AbortController();

  const gameLoop = modes.gameLoops[match.mode];
  await gameLoop(match, matchController);
  if (matchController.signal.aborted) return;

  const endScreen = modes.endScreens[match.mode];
  endScreen(match);
};

const attachShipPlacementListeners = (match) => {
  fleetController = new AbortController();

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
  let { mode } = match;
  if (match.mode === undefined) mode = getModeSelection(event);
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

const skipLink = document.querySelector(".skip-link");
skipLink.addEventListener("click", (event) => {
  event.preventDefault();
  Array.from(buttons.children)
    .find((child) => child.checkVisibility())
    ?.focus();
});
toggleSkipLink();

const gameModes = overlay.querySelector(".game-modes");
gameModes.addEventListener("click", (event) => {
  selectMode(event, match);
});
gameModes.addEventListener("keydown", (event) => selectMode(event, match));

const cellsContainer = document.querySelector("main .cells");
cellsContainer.addEventListener("keydown", (event) => {
  const { board } = match.activePlayer;
  moveOrthogonallyOnBoard(event, board);
});

const showsStatsBtn = buttons.querySelector(".show-stats");
showsStatsBtn.addEventListener("click", () =>
  overlay.querySelector("dialog.stats").show()
);

const quitBtn = buttons.querySelector(".home-screen");
quitBtn.addEventListener("click", () => {
  overlay.dataset.screen = "mode";
  renderAnnouncement("Select Mode");
  toggleAnnouncementTheme(false);
  match = new Match();
});

const rematchBtn = buttons.querySelector(".rematch");
rematchBtn.addEventListener("click", (event) => {
  match.rematch();
  selectMode(event, match);
});
