import {
  renderAnnouncement,
  renderShipCount,
  renderBoard,
  renderSunkReport,
  unRenderAttackTip,
  renderCell,
  renderBoardLabel,
} from "../render/index.js";
import {
  delay,
  waitForAttack,
  waitForRandomAttack,
  waitForQuit,
  toggleAnnouncementTheme,
} from "./index.js";

const runSinglePlayer = async (match, matchController) => {
  const overlay = document.body.querySelector(".screen-overlay");
  renderBoard(match.defender.board.peak);
  let inputController;

  while (!match.isGameOver()) {
    if (matchController.signal.aborted) return;
    inputController = new AbortController();

    renderAnnouncement(`${match.activePlayer.name} Turn`);
    renderShipCount(match.defender.board);
    renderBoard(match.defender.board.peak);

    let attackStatus;
    let isSpectator = false;

    if (match.activePlayer.type === "real") {
      overlay.dataset.screen = "attack";
      attackStatus = await Promise.race([
        waitForAttack(match, inputController.signal),
        waitForRandomAttack(match, inputController.signal),
        waitForQuit(inputController.signal, matchController),
      ]);
      inputController.abort();
      renderBoard(match.defender.board.peak, isSpectator);
    } else {
      overlay.dataset.screen = "spectate";
      isSpectator = true;
      renderBoard(match.defender.board.peak, isSpectator);
      await delay(400);
      attackStatus = match.randomAttack();
    }

    if (matchController.signal.aborted) return;
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
    await delay(400);

    if (hit) continue;

    match.switchTurn();
    toggleAnnouncementTheme();
    renderBoardLabel(`${match.defender.name} Board`);
  }
};

export { runSinglePlayer };
