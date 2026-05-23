import {
  renderBoard,
  renderAsideShips,
  renderBoardLabel,
  renderAnnouncement,
  renderSunkReport,
} from "../render/index.js";
import { toggleSkipLink } from "./index.js";

const prepareSinglePlayer = (match, mode, attachShipPlacementListeners) => {
  const overlay = document.body.querySelector(".screen-overlay");

  match.setMode(mode).init();
  overlay.dataset.screen = "fleet";

  const board = match.activePlayer.board.peak;
  const { dock } = match.activePlayer;

  renderBoard(board);
  renderAsideShips(dock);
  renderBoardLabel(`${match.activePlayer.name} Board`);
  renderAnnouncement("Place Fleet");
  renderSunkReport("");

  attachShipPlacementListeners(match);
  toggleSkipLink();
};

export { prepareSinglePlayer };
