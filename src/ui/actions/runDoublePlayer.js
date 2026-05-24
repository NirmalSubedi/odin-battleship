import {
  renderAnnouncement,
  renderShipCount,
  renderBoardLabel,
  renderBoard,
  unRenderAttackTip,
  renderSunkReport,
  renderCell,
} from "../render/index.js";
import {
  toggleAnnouncementTheme,
  waitForAttack,
  waitForRandomAttack,
  waitForQuit,
  waitForContinueButtonPress,
  delay,
} from "./index.js";

const renderPassScreen = () => {
  const overlay = document.body.querySelector(".screen-overlay");
  overlay.dataset.screen = "pass";
  renderAnnouncement("Pass Device");
  const continueBtn = overlay.querySelector(".buttons .continue");
  continueBtn.focus();
};

const renderAttackScreenV2 = (match, showShips = false) => {
  const overlay = document.body.querySelector(".screen-overlay");
  const cellsContainer = overlay.querySelector("main .cells");

  overlay.dataset.screen = "attack";
  renderBoard(match.defender.board.peak, showShips);
  cellsContainer?.firstElementChild?.focus();
};

const runDoublePlayer = async (match, matchController) => {
  let attackControls;

  while (!match.isGameOver()) {
    attackControls = new AbortController();

    renderAnnouncement(`${match.activePlayer.name} Turn`);
    renderShipCount(match.defender.board);

    const attackStatus = match.randomAttack();
    await Promise.race([
      waitForAttack(match, attackControls.signal),
      waitForRandomAttack(match, attackControls.signal),
      waitForQuit(attackControls.signal, matchController),
    ]);
    attackControls.abort();
    if (matchController.signal.aborted) return;
    if (attackStatus === null) continue;

    const { hit, sunk, ship, coordinates } = attackStatus;
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
    renderPassScreen();
    await waitForContinueButtonPress(match);
    renderAttackScreenV2(match);

    match.switchTurn();
    toggleAnnouncementTheme();
    renderBoard(match.defender.board.peak);
    renderBoardLabel(`${match.defender.name} Board`);
  }
};

export { runDoublePlayer };
