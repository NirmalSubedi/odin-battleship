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
  focusBoardCell,
} from "./index.js";

const setComputerBoard = (match) => {
  match.switchTurn();
  match.randomizeBoard();
  match.switchTurn();
};

const runSinglePlayer = async (match, matchController) => {
  const overlay = document.body.querySelector(".screen-overlay");
  let inputController;
  setComputerBoard(match);

  while (!match.isGameOver()) {
    inputController = new AbortController();
    const attacker = match.activePlayer;

    renderAnnouncement(`${attacker.name} Turn`);
    renderShipCount(match.defender.board);

    let attackStatus;

    if (attacker.type === "real") {
      overlay.dataset.screen = "attack";
      attackStatus = await Promise.race([
        waitForAttack(match, inputController.signal),
        waitForRandomAttack(match, inputController.signal),
        waitForQuit(inputController.signal, matchController),
      ]);
      inputController.abort();
    } else {
      const isSpectator = true;
      overlay.dataset.screen = "spectate";
      renderBoard(match.defender.board.peak, isSpectator);
      await delay(400);
      attackStatus = match.randomAttack();
    }

    if (matchController.signal.aborted) return;
    if (attackStatus === null) continue;

    const { hit, ship, sunk, coordinates } = attackStatus;
    attacker.lastAttackCell = coordinates;
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

    if (matchController.signal.aborted) return;
    if (hit) continue;

    match.switchTurn();
    toggleAnnouncementTheme();
    renderBoard(match.defender.board.peak);
    renderBoardLabel(`${match.defender.name} Board`);
    focusBoardCell(match.activePlayer.lastAttackCell);
  }
};

export { runSinglePlayer };
