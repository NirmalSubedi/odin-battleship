import { renderAsideShips, renderCell } from "../render/index.js";

const resetShipsPlacements = (match) => {
  const player = match.activePlayer;
  const { fleet } = player.board;

  for (let i = 0; i < fleet.length; ++i) {
    const ship = fleet.at(i);
    renderCell(ship.head, "", ship.placementDirection, ship.length);
  }

  match.resetBoard();

  renderAsideShips(player.dock);
};

export { resetShipsPlacements };
