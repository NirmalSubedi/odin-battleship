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
  focusTopOfPage,
} from "./actions/index.js";
import { Match } from "../logic/index.js";

const overlay = document.body.querySelector(".screen-overlay");
const buttons = document.body.querySelector(".buttons");

let match = new Match();
let fleetController;
let matchController;

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
    toggleSkipLink(false);
    await waitForNameInputs(match);
    toggleSkipLink(true);
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
  focusTopOfPage();
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

document.addEventListener("DOMContentLoaded", () => toggleSkipLink(false), {
  once: true,
});

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
const handleShowStatsKey = (event) => {
  if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey) return;
  if (!event.code || event.code !== "KeyS") return;

  const isVisible = showsStatsBtn.checkVisibility();
  if (!isVisible) return;

  event.preventDefault();
  showsStatsBtn.click();
};
document.addEventListener("keydown", handleShowStatsKey);

const quitBtn = buttons.querySelector(".home-screen");
quitBtn.addEventListener("click", () => {
  overlay.dataset.screen = "mode";
  renderAnnouncement("Select Mode");
  toggleAnnouncementTheme(false);
  toggleSkipLink(false);

  matchController.abort();
  match = new Match();
});

const rematchBtn = buttons.querySelector(".rematch");
rematchBtn.addEventListener("click", (event) => {
  match.rematch();
  selectMode(event, match);
});
const handleRematchKey = (event) => {
  if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey) return;
  if (!event.code || event.code !== "KeyR") return;

  const isVisible = rematchBtn.checkVisibility();
  if (!isVisible) return;

  event.preventDefault();
  rematchBtn.click();
};
document.addEventListener("keydown", handleRematchKey);
