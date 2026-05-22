import {
  renderAnnouncement,
  renderShipCount,
  renderBoard,
  renderSunkReport,
  unRenderAttackTip,
  renderCell,
  renderBoardLabel,
} from "../render/index.js";
import { delay, waitForAttack, toggleAnnouncementTheme } from "./index.js";

const runSinglePlayer = async (match) => {
  const overlay = document.body.querySelector(".screen-overlay");
  const cellsContainer = document.body.querySelector("main .cells");
  renderBoard(match.defender.board.peak);

  while (!match.isGameOver()) {
    renderAnnouncement(`${match.activePlayer.name} Turn`);
    renderShipCount(match.defender.board);
    renderBoard(match.defender.board.peak);

    let attackStatus;
    let isSpectator = false;

    if (match.activePlayer.type === "real") {
      overlay.dataset.screen = "attack";
      attackStatus = await waitForAttack(match, cellsContainer);
      renderBoard(match.defender.board.peak, isSpectator);
    } else {
      overlay.dataset.screen = "spectate";
      isSpectator = true;
      renderBoard(match.defender.board.peak, isSpectator);
      await delay(500);
      attackStatus = match.randomAttack();
    }

    if (attackStatus === null) continue;

    const { hit, ship, sunk, coordinates } = attackStatus;

    unRenderAttackTip();
    renderSunkReport(ship?.name, sunk);

    if (sunk) {
      renderCell(ship.head, "sunk", ship.placementDirection, ship.length);
    } else if (hit) {
      renderCell(coordinates, "hit", [0, 0], 1);
    } else {
      renderCell(coordinates, "miss", [0, 0], 1);
    }
    renderShipCount(match.defender.board);
    await delay(800);

    if (hit) continue;

    match.switchTurn();
    toggleAnnouncementTheme();
    renderBoardLabel(`${match.defender.name} Board`);
  }
};

export { runSinglePlayer };
