import {
  renderAttackScreen,
  renderSinglePlayerEndScreen,
  renderAnnouncement,
  renderBoard,
  renderFleetScreen,
} from "./render/index.js";
import {
  getModeSelection,
  moveOrthogonallyOnBoard,
  attachFleetControls,
  toggleSkipLink,
  prepareSinglePlayer,
  runSinglePlayer,
  toggleAnnouncementTheme,
  waitForNameInputs,
  waitForContinueButtonPress,
  focusBoardCell,
} from "./actions/index.js";
import { Match } from "../logic/index.js";

const overlay = document.body.querySelector(".screen-overlay");
const buttons = document.body.querySelector(".buttons");

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

const attachSinglePlayerControls = (match) => {
  fleetController = new AbortController();

  attachFleetControls(match, fleetController);

  const continueBtn = buttons.querySelector(".continue");
  continueBtn.addEventListener(
    "click",
    () => {
      processAttackScreen(match);
    },
    { signal: fleetController.signal }
  );
};

const renderAttackScreenV2 = (match, showShips = false) => {
  const overlay = document.body.querySelector(".screen-overlay");
  const cellsContainer = overlay.querySelector("main .cells");

  overlay.dataset.screen = "attack";
  renderBoard(match.defender.board.peak, showShips);
  cellsContainer?.firstElementChild?.focus();
};

const prepareDoublePlayer = async (match, mode) => {
  overlay.dataset.screen = "name";
  overlay.querySelector(".name-selection input").focus();

  await waitForNameInputs(match);
  match.setMode(mode).init();

  for (let i = 0; i < 2; ++i) {
    fleetController = new AbortController();

    toggleSkipLink(true);
    renderFleetScreen(match);
    attachFleetControls(match, fleetController);
    focusBoardCell([0, 0]);

    await waitForContinueButtonPress(match);

    toggleAnnouncementTheme();
    match.switchTurn();
    fleetController.abort();
  }

  renderAttackScreenV2(match);
};

const selectMode = (event, match) => {
  let { mode } = match;
  if (match.mode === undefined) mode = getModeSelection(event);
  if (mode === undefined) return;

  switch (mode) {
    case "single":
      prepareSinglePlayer(match, mode, attachSinglePlayerControls);
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
