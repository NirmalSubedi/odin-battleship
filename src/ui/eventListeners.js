import { renderBoard, renderCell } from "./render/index.js";
import { moveOrthogonallyOnBoard } from "./index.js";
import { Match } from "../logic/index.js";

const toggleSkipLink = () => {
  const skipLink = document.querySelector(".skip-link");
  skipLink.tabIndex = skipLink.tabIndex === 0 ? -1 : 0;
};
toggleSkipLink();

const preventURLClutter = () => {
  const skipLink = document.querySelector(".skip-link");
  const buttons = document.querySelector(".buttons");

  skipLink.addEventListener("click", (event) => {
    event.preventDefault();
    buttons.focus();
  });
};
preventURLClutter();

const overlay = document.querySelector(".screen-overlay");

const processNames = (match) => {
  const names = [];
  const inputs = overlay.querySelectorAll(".name-selection input");

  inputs.forEach((input) => {
    const name = input.value.trim();
    if (name !== "") names.push(name);
  });

  match.setPlayers(...names);
};

const renderAsideShips = (playerDock = []) => {
  const dockElm = document.body.querySelector("aside .fleet .dock");

  for (let i = 0; i < playerDock.length; ++i) {
    const ship = playerDock[i];
    const shipElm = document.createElement("div");
    for (let j = 0; j < ship.length; ++j) {
      const shipPartElm = document.createElement("div");

      shipPartElm.setAttribute("class", "ship-part");
      shipElm.appendChild(shipPartElm);
    }
    shipElm.setAttribute("class", "ship");
    dockElm.appendChild(shipElm);
  }
};

const renderBoardLabel = (message = "") => {
  const label = document.body.querySelector("main .board .board-label");
  label.textContent = message;
};
const renderAnnouncement = (message = "") => {
  const announcement = document.body.querySelector("header .announce .message");
  announcement.textContent = message;
};

const getModeSelection = (event) => {
  const modeElm = event.target.closest("[class$='-player']");
  if (!modeElm || !event.currentTarget.contains(modeElm)) return;

  const validKeys = ["Enter", "Space"];
  if (event.code && !validKeys.includes(event.code)) return;

  const mode = modeElm.className;
  return mode.slice(0, mode.indexOf("-"));
};

const removeShipFromAside = () => {
  const asideShip = document.body.querySelector("aside .dock .ship");
  if (!asideShip) return;
  asideShip.parentElement.removeChild(asideShip);
};

const renderShipPlacement = (game) => {
  const cellsContainer = document.querySelector("main .cells");
  let shipsPlaced = 0;

  const renderShip = (event) => {
    const cellElm = event.target.closest(".cell");
    if (!cellElm || !event.currentTarget.contains(cellElm)) return;

    const row = Number(cellElm.dataset.y) - 1;
    const col = Number(cellElm.dataset.x) - 1;
    const coordinates = [row, col];

    const isSuccess = game.match.place(coordinates);
    if (!isSuccess) return;

    const ship = game.match.activePlayer.board.fleet.at(-1);
    renderCell(coordinates, "ship", ship.placementDirection, ship.length);
    removeShipFromAside();

    ++shipsPlaced;
    if (shipsPlaced >= game.match.activePlayer.dock.length) {
      cellsContainer.removeEventListener("click", renderShip);
    }
  };
  cellsContainer.addEventListener("click", renderShip);
};

const selectMode = (event, game) => {
  const mode = getModeSelection(event);
  if (mode === undefined) return;
  game.match.setMode(mode);

  switch (mode) {
    case "single": {
      game.match.init();
      const board = game.match.activePlayer.board.peak;
      const { dock } = game.match.activePlayer;

      overlay.dataset.screen = "fleet";
      renderBoard(board);
      renderAsideShips(dock);
      renderBoardLabel("Your Board");
      renderAnnouncement("Place Fleet");
      renderShipPlacement(game);
      toggleSkipLink();
      break;
    }

    case "double": {
      overlay.dataset.screen = "name";
      overlay.querySelector(".name-selection input").focus();
      break;
    }

    default:
      throw new ReferenceError(`(${mode}) is a unknown mode.`);
  }
};

const game = {
  match: new Match(),
  player1Placed: false,
  player2Placed: false,
};

const gameModes = overlay.querySelector(".game-modes");
gameModes.addEventListener("click", (event) => selectMode(event, game));
gameModes.addEventListener("keydown", (event) => selectMode(event, game));

const cellsContainer = overlay.querySelector("main .cells");
cellsContainer.addEventListener("keydown", (event) => {
  const { board } = game.match.activePlayer;
  moveOrthogonallyOnBoard(event, board);
});

const placeShipsRandomly = (match) => {
  // De-render any placed ships
  const player = match.activePlayer;
  const { fleet } = player.board;

  for (let i = 0; i < fleet.length; ++i) {
    const ship = fleet.at(i);
    renderCell(ship.head, "", ship.placementDirection, ship.length);
  }

  // Randomly place ships
  match.randomizeBoard();

  // Render randomly placed ships
  for (let i = 0; i < fleet.length; ++i) {
    const ship = fleet.at(i);
    renderCell(ship.head, "ship", ship.placementDirection, ship.length);
    removeShipFromAside();
  }
};

const randomizeBoardBtn = overlay.querySelector(".buttons .randomize-board");
randomizeBoardBtn.addEventListener("click", () => {
  placeShipsRandomly(game.match);
});

document.addEventListener("keydown", (event) => {
  if (overlay.dataset.screen !== "fleet" || event.code !== "KeyR") return;
  placeShipsRandomly(game.match);
});
