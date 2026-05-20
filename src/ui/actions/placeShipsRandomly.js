import { unRenderShipFromAside, renderCell } from "../render/index.js";

const placeShipsRandomly = (match) => {
  // De-render any placed ships
  const player = match.activePlayer;
  const { fleet } = player.board;

  for (let i = 0; i < fleet.length; ++i) {
    const ship = fleet.at(i);
    renderCell(ship.head, "", ship.placementDirection, ship.length);
  }

  // Randomly place ships
  match.randomizeBoard();

  // Render randomly placed ships
  for (let i = 0; i < fleet.length; ++i) {
    const ship = fleet.at(i);
    renderCell(ship.head, "ship", ship.placementDirection, ship.length);
    unRenderShipFromAside();
  }
};

export { placeShipsRandomly };
