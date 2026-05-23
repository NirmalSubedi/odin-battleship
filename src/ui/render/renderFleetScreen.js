import {
  renderBoard,
  renderAsideShips,
  renderBoardLabel,
  renderAnnouncement,
  renderSunkReport,
} from "./index.js";

const renderFleetScreen = (match) => {
  const overlay = document.body.querySelector(".screen-overlay");
  overlay.dataset.screen = "fleet";

  const board = match.activePlayer.board.peak;
  const { dock } = match.activePlayer;

  renderBoard(board);
  renderAsideShips(dock);
  renderBoardLabel(`${match.activePlayer.name} Board`);
  renderAnnouncement("Place Fleet");
  renderSunkReport("");
};

export { renderFleetScreen };
