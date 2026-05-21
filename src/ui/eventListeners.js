import {
  renderBoard,
  renderShipPlacement,
  renderAsideShips,
  renderAnnouncement,
  renderBoardLabel,
  renderCell,
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

const fleetController = new AbortController();

const cellsContainer = document.querySelector("main .cells");
cellsContainer.addEventListener("keydown", (event) => {
  const { board } = game.match.activePlayer;
  moveOrthogonallyOnBoard(event, board);
});

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const unRenderAttackTip = () => {
  const attackTipElm = document.body.querySelector(".instructions .message");
  attackTipElm.classList.add("remove");
};

const renderSunkReport = (shipName, render = false) => {
  const reportElm = document.body.querySelector(".report");
  const shipNameElm = reportElm.querySelector(".ship-name");
  shipNameElm.textContent = shipName;
  reportElm.classList.toggle("show", render);
};

const attackCell = (event, match) => {
  const cell = event.target.closest(".cell");
  if (!cell || !event.currentTarget.contains(cell)) return;

  const row = Number(cell.dataset.y) - 1;
  const col = Number(cell.dataset.x) - 1;
  const coordinates = [row, col];

  const status = match.attack(coordinates);

  return status;
};

const waitForAttack = async (match) =>
  new Promise((resolve) => {
    cellsContainer.addEventListener(
      "click",
      (event) => {
        resolve(attackCell(event, match));
      },
      { once: true }
    );
  });

const toggleAnnouncementTheme = () => {
  const announcementElm = document.querySelector("header .announce");
  announcementElm.classList.toggle("alternative");
};

const prepareAttackScreen = async (match) => {
  const player = match.activePlayer;

  if (player.lastPlacedShipIndex < player.dock.length) {
    placeShipsRandomly(match);
    await delay(1000);
  }

  match.switchTurn();
  match.randomizeBoard();
  match.switchTurn();

  overlay.dataset.screen = "attack";
  cellsContainer?.firstElementChild?.focus();
  fleetController.abort();

  while (!match.isGameOver()) {
    renderBoard(match.defender.board.peak);
    renderAnnouncement(`${match.activePlayer.name} Turn`);

    let attackStatus;

    if (match.activePlayer.type === "real") {
      attackStatus = await waitForAttack(match);
    } else if (match.activePlayer.type === "computer") {
      attackStatus = match.defender.board.randomAttack();
    }

    if (attackStatus === null) continue;
    const { hit, ship, sunk, coordinates } = attackStatus;
    if (match.activePlayer.type === "computer") await delay(500);

    unRenderAttackTip();
    renderSunkReport(ship?.name, sunk);

    if (sunk) {
      renderCell(ship.head, "sunk", ship.placementDirection, ship.length);
    } else if (hit) {
      renderCell(coordinates, "hit", [0, 0], 1);
    } else {
      renderCell(coordinates, "miss", [0, 0], 1);
    }

    await delay(500);

    if (hit) continue;
    match.switchTurn();
    toggleAnnouncementTheme();
    renderBoardLabel(`${match.defender.name} Board`);
  }

  let winner = match.activePlayer.name;
  if (match.activePlayer.name === "Your") {
    winner = "You";
  }

  overlay.dataset.screen = "over";
  renderAnnouncement(`${winner} WIN!`);
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
      prepareAttackScreen(match);
    },
    { signal: fleetController.signal }
  );
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
