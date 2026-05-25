import {
  renderEndScreen,
  renderAttackScreen,
  renderFleetScreen,
  renderAnnouncement,
} from "./render/index.js";
import {
  getModeSelection,
  moveOrthogonallyOnBoard,
  attachFleetControls,
  toggleSkipLink,
  runSinglePlayer,
  toggleAnnouncementTheme,
  waitForNameInputs,
  waitForContinueButtonPress,
  runDoublePlayer,
  delay,
} from "./actions/index.js";
import { Match } from "../logic/index.js";

const overlay = document.body.querySelector(".screen-overlay");
const buttons = document.body.querySelector(".buttons");

let match = new Match();
let fleetController;
let matchController;

const focusTopOfPage = () => {
  const announceElm = overlay.querySelector(".announce");
  announceElm.tabIndex = "-1";
  announceElm.focus();
};

const playSinglePlayer = async (match, mode) => {
  match.setMode(mode).init();
  renderFleetScreen(match);

  fleetController = new AbortController();
  attachFleetControls(match, fleetController);
  toggleSkipLink(true);
  focusTopOfPage();

  await waitForContinueButtonPress(match);
  fleetController.abort();

  renderAttackScreen(match);
  matchController = new AbortController();

  await runSinglePlayer(match, matchController);
  if (matchController.signal.aborted) return;

  renderEndScreen(match);
};

const playDoublePlayer = async (match, mode) => {
  overlay.dataset.screen = "name";
  overlay.querySelector(".name-selection input").focus();

  if (match.activePlayer?.name === undefined) {
    await waitForNameInputs(match);
  }
  match.setMode(mode).init();
  toggleSkipLink(true);

  for (let i = 0; i < 2; ++i) {
    fleetController = new AbortController();

    renderFleetScreen(match);
    attachFleetControls(match, fleetController);

    focusTopOfPage();
    await waitForContinueButtonPress(match);

    toggleAnnouncementTheme();
    match.switchTurn();
    fleetController.abort();
  }

  renderAttackScreen(match);
  matchController = new AbortController();
  await runDoublePlayer(match, matchController);
  if (matchController.signal.aborted) return;

  renderEndScreen(match);
};

const selectMode = (event, match) => {
  let { mode } = match;
  if (match.mode === undefined) mode = getModeSelection(event);
  if (mode === undefined) return;

  switch (mode) {
    case "single":
      playSinglePlayer(match, mode);
      break;

    case "double":
      playDoublePlayer(match, mode);
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
  toggleAnnouncementTheme(false);
  matchController.abort();
  match = new Match();
  renderAnnouncement("Select Mode");
});

const rematchBtn = buttons.querySelector(".rematch");
rematchBtn.addEventListener("click", (event) => {
  match.rematch();
  selectMode(event, match);
});
