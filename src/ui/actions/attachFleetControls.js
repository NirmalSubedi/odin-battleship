import {
  renderShipPlacement,
  renderShipRotation,
  renderCell,
} from "../render/index.js";
import {
  placeShipsRandomly,
  resetShipsPlacements,
  focusBoardCell,
} from "./index.js";

const handleDragOver = (event) => {
  if (event.dataTransfer.types.includes("ship-position")) {
    event.preventDefault();
  }
};

const handleDragStart = (event) => {
  const shipElm = event.target.closest(".ship");
  if (!shipElm || !event.currentTarget.contains(shipElm)) return;

  shipElm.id = "dragged-ship";
  event.dataTransfer.effectAllowed = "move";

  const shipIndex = [...shipElm.parentElement.children].indexOf(shipElm);
  event.dataTransfer.setData("ship-position", `${shipIndex + 1}`);

  const dockElm = event.currentTarget;
  const cellSizeStr = window
    .getComputedStyle(dockElm)
    .getPropertyValue("--board-cell-size");
  const cellPixelSize = Number.parseInt(cellSizeStr, 10);
  /* Multiplier to chip down last ship-part's bottom edge pixel row from integer value into float value for floor division */
  const MULTIPLIER = 0.99;
  const selectedShipPartOffsetFromHeadPart = Math.floor(
    (event.offsetY / cellPixelSize) * MULTIPLIER
  );
  event.dataTransfer.setData(
    "offset-from-head",
    `${selectedShipPartOffsetFromHeadPart}`
  );
};

const handleDrop = (event, match) => {
  const cellElm = event.target.closest(".cell");
  if (!cellElm || !event.currentTarget.contains(cellElm)) return;

  const upDirection = [-1, 0];
  const [dr, dc] = upDirection;
  let row = Number(cellElm.dataset.y) - 1;
  let col = Number(cellElm.dataset.x) - 1;
  let offsetFromHead = event.dataTransfer.getData("offset-from-head");

  while (offsetFromHead-- > 0) {
    row += dr;
    col += dc;
  }

  const shipPosition = event.dataTransfer.getData("ship-position");
  let isDroppedSuccessfully;
  try {
    isDroppedSuccessfully = match.place([row, col], shipPosition);
  } catch (error) {
    if (error instanceof RangeError) isDroppedSuccessfully = false;
  }
  if (!isDroppedSuccessfully) return;

  const droppedShip = match.activePlayer.board.fleet.at(-1);
  if (!droppedShip) return;

  renderCell(
    droppedShip.head,
    "ship",
    droppedShip.placementDirection,
    droppedShip.length
  );
  focusBoardCell([row, col]);

  const draggedShipElm = document.body.querySelector("#dragged-ship");
  draggedShipElm.parentElement.removeChild(draggedShipElm);
};

const handleDragEnd = (event) => {
  const shipElm = event.target.closest(".ship");
  if (!shipElm || !event.currentTarget.contains(shipElm)) return;

  shipElm.removeAttribute("id");
};

const attachDragShipToBoardControls = (match, fleetController) => {
  const { signal } = fleetController;

  const cellsContainer = document.body.querySelector("main .board .cells");
  cellsContainer.addEventListener("dragover", handleDragOver, { signal });
  cellsContainer.addEventListener(
    "drop",
    (event) => {
      handleDrop(event, match);
    },
    { signal }
  );

  const dockElm = document.body.querySelector("aside .dock");
  dockElm.addEventListener("dragstart", handleDragStart, { signal });
  dockElm.addEventListener("dragend", handleDragEnd, { signal });
};

const attachRandomizeBoardControls = (match, fleetController) => {
  const randomizeBoardBtn = document.body.querySelector(
    ".buttons .randomize-board"
  );
  randomizeBoardBtn.addEventListener(
    "click",
    () => {
      placeShipsRandomly(match);
    },
    { signal: fleetController.signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.code !== "KeyS") return;
      placeShipsRandomly(match);
    },
    { signal: fleetController.signal }
  );
};

const attachResetBoardControls = (match, fleetController) => {
  const resetBoardBtn = document.body.querySelector(".buttons .reset-board");
  resetBoardBtn.addEventListener(
    "click",
    () => {
      resetShipsPlacements(match);
    },
    { signal: fleetController.signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.code !== "KeyR") return;
      resetShipsPlacements(match);
    },
    { signal: fleetController.signal }
  );
};

const attachShipRotationControl = (match, fleetController) => {
  const cellsContainer = document.body.querySelector("main .cells");
  cellsContainer.addEventListener(
    "click",
    (event) => {
      renderShipRotation(event, match);
    },
    { signal: fleetController.signal }
  );
};

const attachShipPlacementControl = (match, fleetController) => {
  const cellsContainer = document.body.querySelector("main .cells");
  cellsContainer.addEventListener(
    "click",
    (event) => {
      renderShipPlacement(event, match);
    },
    { signal: fleetController.signal }
  );
};

const attachFleetControls = (match, fleetController) => {
  attachShipRotationControl(match, fleetController);
  attachShipPlacementControl(match, fleetController);
  attachDragShipToBoardControls(match, fleetController);
  attachRandomizeBoardControls(match, fleetController);
  attachResetBoardControls(match, fleetController);
};

export { attachFleetControls };
