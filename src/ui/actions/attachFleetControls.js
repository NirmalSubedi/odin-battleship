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

let dragOffsetX = 0;
let dragOffsetY = 0;

const getCellSize = () => {
  const dockElm = document.body.querySelector("aside .dock");
  const cellSizeStr = window
    .getComputedStyle(dockElm)
    .getPropertyValue("--board-cell-size");
  const cellSize = Number.parseInt(cellSizeStr, 10);

  return cellSize;
};

const getBoardCoordinates = (event) => {
  const cellSize = getCellSize();
  const cellsContainer = document.body.querySelector("main .cells");
  const containerRect = cellsContainer.getBoundingClientRect();
  const col = Math.floor(
    (event.clientX - containerRect.left - dragOffsetX) / cellSize
  );
  const row = Math.floor(
    (event.clientY - containerRect.top - dragOffsetY) / cellSize
  );

  return [row, col];
};

const makeShipPlaceholder = (draggedShipElm) => {
  const placeholderShipElm = document.createElement("div");
  placeholderShipElm.setAttribute("class", "placeholder-ship");

  const { width, height } = draggedShipElm.getBoundingClientRect();
  const maxElmLength = Math.max(width, height);
  const cellSize = getCellSize();
  const shipLength = Math.floor(maxElmLength / cellSize);

  for (let i = 0; i < shipLength; ++i) {
    const shipPartElm = document.createElement("div");
    shipPartElm.setAttribute("class", "ship-part");
    placeholderShipElm.appendChild(shipPartElm);
  }

  placeholderShipElm.style.flexDirection = width < height ? "column" : "row";

  return placeholderShipElm;
};

const isShipPlaceHolderOutOfBound = (event) => {
  const cellsContainer = document.body.querySelector("main .cells");
  const cellsContainerRect = cellsContainer.getBoundingClientRect();
  const currentTop = event.clientY - dragOffsetY - cellsContainerRect.top;
  const currentLeft = event.clientX - dragOffsetX - cellsContainerRect.left;

  const cellSize = getCellSize();
  const placeholderRow = Math.floor(currentTop / cellSize) * cellSize;
  const placeholderCol = Math.floor(currentLeft / cellSize) * cellSize;

  return (
    placeholderRow < 0 ||
    placeholderCol < 0 ||
    event.clientY > cellsContainerRect.bottom ||
    event.clientX > cellsContainerRect.right
  );
};

const isOverSameCell = (event, shipPlaceholder) => {
  const cellSize = getCellSize();
  const placeholderRect = shipPlaceholder.getBoundingClientRect();
  const [hoveredRow, hoveredCol] = getBoardCoordinates(event);
  const placeholderRow = Math.floor(placeholderRect.top / cellSize);
  const placeholderCol = Math.floor(placeholderRect.left / cellSize);

  const isOverSameRow = placeholderRow === hoveredRow;
  const isOverSameCol = placeholderCol === hoveredCol;
  return isOverSameCol && isOverSameRow;
};

const moveShipPlaceholder = (event, match) => {
  if (!event.dataTransfer.types.includes("ship-position")) return;
  event.preventDefault();

  const cellsContainer = document.body.querySelector("main .cells");
  const draggedShipElm = document.body.querySelector("#dragged-ship");

  const existingShipPlaceholder =
    cellsContainer.querySelector(".placeholder-ship");
  const shipPlaceholder =
    existingShipPlaceholder ?? makeShipPlaceholder(draggedShipElm);

  const cellsContainerRect = cellsContainer.getBoundingClientRect();
  const currentTop = event.clientY - dragOffsetY - cellsContainerRect.top;
  const currentLeft = event.clientX - dragOffsetX - cellsContainerRect.left;

  const cellSize = getCellSize();
  const placeholderRow = Math.floor(currentTop / cellSize) * cellSize;
  const placeholderCol = Math.floor(currentLeft / cellSize) * cellSize;

  if (existingShipPlaceholder) {
    if (isOverSameCell(event, shipPlaceholder)) {
      return;
    }
    if (isShipPlaceHolderOutOfBound(event)) {
      existingShipPlaceholder?.remove();
      return;
    }
  }

  const coordinates = getBoardCoordinates(event);
  const draggedShipRect = draggedShipElm.getBoundingClientRect();
  const length = Math.max(
    Math.floor(draggedShipRect.height / cellSize),
    Math.floor(draggedShipRect.width / cellSize)
  );
  const direction = draggedShipRect.width < draggedShipRect.height ? "D" : "R";

  if (match.activePlayer.board.canDraw(coordinates, length, direction)) {
    event.dataTransfer.dropEffect = "move";
    shipPlaceholder.style.top = `${placeholderRow}px`;
    shipPlaceholder.style.left = `${placeholderCol}px`;
    cellsContainer.appendChild(shipPlaceholder);
  } else {
    event.dataTransfer.dropEffect = "none";
    existingShipPlaceholder?.remove();
  }
};

const handleDragOver = (event, match) => {
  moveShipPlaceholder(event, match);
};

const handleDragStart = (event) => {
  const shipElm = event.target.closest(".ship");
  if (!shipElm || !event.currentTarget.contains(shipElm)) return;

  shipElm.id = "dragged-ship";
  event.dataTransfer.effectAllowed = "move";

  const shipIndex = [...shipElm.parentElement.children].indexOf(shipElm);
  event.dataTransfer.setData("ship-position", `${shipIndex + 1}`);

  const rect = shipElm.getBoundingClientRect();

  dragOffsetX = event.clientX - rect.left;
  dragOffsetY = event.clientY - rect.top;
};

const handleDrop = (event, match) => {
  const cellElm = event.target.closest(".cell");
  if (!cellElm || !event.currentTarget.contains(cellElm)) return;
  event.preventDefault();

  const [row, col] = getBoardCoordinates(event);

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

  const shipPlaceholder =
    event.currentTarget.querySelector(".placeholder-ship");
  shipPlaceholder?.remove();
};

const handleDragEnd = (event) => {
  const shipElm = event.target.closest(".ship");
  if (!shipElm || !event.currentTarget.contains(shipElm)) return;

  shipElm.removeAttribute("id");
  const shipPlaceholder = document.querySelector(
    "main .cells .placeholder-ship"
  );
  shipPlaceholder?.remove();
};

const handleDrag = (event) => {
  if (isShipPlaceHolderOutOfBound(event)) {
    const shipPlaceholder = document.querySelector(
      "main .cells .placeholder-ship"
    );
    shipPlaceholder?.remove();
  }
};

const handleDragLeave = (event) => {
  const cellElm = event.target.closest(".cell");
  if (!cellElm || !event.currentTarget.contains(cellElm)) return;

  const shipPlaceholder = document.body.querySelector(
    "main .cells .placeholder-ship"
  );
  shipPlaceholder?.remove();
};

const attachDragShipToBoardControls = (match, fleetController) => {
  const { signal } = fleetController;

  const cellsContainer = document.body.querySelector("main .board .cells");
  cellsContainer.addEventListener(
    "dragover",
    (event) => handleDragOver(event, match),
    { signal }
  );
  cellsContainer.addEventListener(
    "drop",
    (event) => {
      handleDrop(event, match);
    },
    { signal }
  );
  cellsContainer.addEventListener("dragleave", handleDragLeave, { signal });

  const dockElm = document.body.querySelector("aside .dock");
  dockElm.addEventListener("dragstart", handleDragStart, { signal });
  dockElm.addEventListener("dragend", handleDragEnd, { signal });
  dockElm.addEventListener("drag", handleDrag, { signal });
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

  const handleKey = (event) => {
    if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey)
      return;
    if (!event.code || event.code !== "KeyS") return;

    event.preventDefault();
    randomizeBoardBtn.click();
  };
  document.addEventListener("keydown", handleKey, {
    signal: fleetController.signal,
  });
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

  const handleKey = (event) => {
    if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey)
      return;
    if (!event.code || event.code !== "KeyR") return;

    event.preventDefault();
    resetBoardBtn.click();
  };
  document.addEventListener("keydown", handleKey, {
    signal: fleetController.signal,
  });
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
