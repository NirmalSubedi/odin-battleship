import { renderCell } from "./index.js";

const removeShipFromAside = () => {
  const dockElm = document.body.querySelector("aside .fleet .dock");
  if (!dockElm || !dockElm.firstElementChild) return;

  dockElm.firstElementChild.remove();
};

const renderShipPlacement = (event, ship = {}) => {
  const column = Number(event.target.dataset.x) - 1;
  const row = Number(event.target.dataset.y) - 1;
  const coordinates = [row, column];

  removeShipFromAside();
  renderCell(coordinates, "ship", ship.placementDirection, ship.length);
};

export { renderShipPlacement };
