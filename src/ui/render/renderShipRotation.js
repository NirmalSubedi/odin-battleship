import { renderCell } from "./index.js";

const renderShipRotation = (event, match) => {
  const cellElm = event.target.closest(".cell");
  if (!cellElm || !event.currentTarget.contains(cellElm)) return;
  if (cellElm.dataset.state !== "ship") return;
  if (cellElm.dataset.state === "ship") event.stopImmediatePropagation();

  const row = Number(cellElm.dataset.y) - 1;
  const col = Number(cellElm.dataset.x) - 1;
  const coordinates = [row, col];

  const { board } = match.activePlayer;
  const counterClockWise = event.ctrlKey;

  const shipPosition = board.peak[row][col] - 1;
  const ship = board.fleet.at(shipPosition);
  const oldPlacementDirection = ship.placementDirection;

  const isSuccess = board.rotateShipAt(coordinates, counterClockWise);
  if (!isSuccess) return;

  renderCell(ship.head, "", oldPlacementDirection, ship.length);
  renderCell(ship.head, "ship", ship.placementDirection, ship.length);
};

export { renderShipRotation };
