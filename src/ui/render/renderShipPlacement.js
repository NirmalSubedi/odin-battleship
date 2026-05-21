import { renderCell } from "./renderCell.js";

const unRenderShipFromAside = () => {
  const asideShip = document.body.querySelector("aside .dock .ship");
  if (!asideShip) return;
  asideShip.parentElement.removeChild(asideShip);
};

const renderShipPlacement = (event, match) => {
  const cellElm = event.target.closest(".cell");
  if (!cellElm || !event.currentTarget.contains(cellElm)) return;

  const row = Number(cellElm.dataset.y) - 1;
  const col = Number(cellElm.dataset.x) - 1;
  const coordinates = [row, col];

  const isSuccess = match.place(coordinates);
  if (!isSuccess) return;

  const ship = match.activePlayer.board.fleet.at(-1);
  renderCell(coordinates, "ship", ship.placementDirection, ship.length);
  unRenderShipFromAside();
};

export { renderShipPlacement, unRenderShipFromAside };
