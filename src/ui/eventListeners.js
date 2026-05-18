import { renderBoard } from "./render/index.js";
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

const game = {
  match: new Match(),
  player1Placed: false,
  player2Placed: false,
};

const overlay = document.querySelector(".screen-overlay");

const processNames = () => {
  const names = [];
  const inputs = overlay.querySelectorAll(".name-selection input");

  inputs.forEach((input) => {
    const name = input.value.trim();
    if (name !== "") names.push(name);
  });

  game.match.setPlayers(...names);
};

const selectMode = (event) => {
  const modeElm = event.target.closest("[class$='-player']");
  if (!modeElm || !event.currentTarget.contains(modeElm)) return;

  if (event.type !== "click" && event.type !== "keydown") return;
  const keyCodes = ["Enter", "Space"];
  if (event.code && !keyCodes.includes(event.code)) return;

  const mode = modeElm.className;
  const selectedMode = mode.slice(0, mode.indexOf("-"));
  game.match.setMode(selectedMode);

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
  const changeBoardLabel = (message = "") => {
    const label = document.body.querySelector("main .board .board-label");
    label.textContent = message;
  };
  const changeAnnouncement = (message = "") => {
    const announcement = document.body.querySelector(
      "header .announce .message"
    );
    announcement.textContent = message;
  };

  switch (selectedMode) {
    case "single": {
      overlay.dataset.screen = "fleet";
      game.match.init();

      const board = game.match.activePlayer.board.peak;
      const { dock } = game.match.activePlayer;
      renderBoard(board);
      renderAsideShips(dock);
      changeBoardLabel("Your Board");
      changeAnnouncement("Place Fleet");
      toggleSkipLink();
      break;
    }

    default:
      overlay.dataset.screen = "name";
      overlay.querySelector(".name-selection input").focus();
      break;
  }
};

const gameModes = document.body.querySelector(".game-modes");
gameModes.addEventListener("click", selectMode);
gameModes.addEventListener("keydown", selectMode);
