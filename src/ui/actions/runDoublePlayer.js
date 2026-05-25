import {
  renderAnnouncement,
  renderShipCount,
  renderBoardLabel,
  renderBoard,
  unRenderAttackTip,
  renderSunkReport,
  renderAttackScreen,
  renderCell,
} from "../render/index.js";
import {
  toggleAnnouncementTheme,
  waitForAttack,
  waitForRandomAttack,
  waitForQuit,
  waitForContinueButtonPress,
  delay,
  focusBoardCell,
} from "./index.js";

const renderPassScreen = () => {
  const overlay = document.body.querySelector(".screen-overlay");
  overlay.dataset.screen = "pass";
  renderAnnouncement("Pass Device");
  const continueBtn = overlay.querySelector(".buttons .continue");
  continueBtn.focus();
};

const runDoublePlayer = async (match, matchController) => {
  let attackControls;

  while (!match.isGameOver()) {
    const attacker = match.activePlayer;
    attackControls = new AbortController();

    renderAnnouncement(`${attacker.name} Turn`);
    renderShipCount(match.defender.board);

    const attackStatus = await Promise.race([
      waitForAttack(match, attackControls.signal),
      waitForRandomAttack(match, attackControls.signal),
      waitForQuit(attackControls.signal, matchController),
    ]);
    attackControls.abort();

    if (matchController.signal.aborted) return;
    if (attackStatus === null) continue;

    const { hit, sunk, ship, coordinates } = attackStatus;
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
    await delay(500);

    if (matchController.signal.aborted) return;
    if (hit) continue;

    renderPassScreen();
    await waitForContinueButtonPress(match);
    renderAttackScreen(match);

    match.switchTurn();
    toggleAnnouncementTheme();
    renderBoard(match.defender.board.peak);
    renderBoardLabel(`${match.defender.name} Board`);
    focusBoardCell(match.activePlayer.lastAttackCell);
  }
};

export { runDoublePlayer };
