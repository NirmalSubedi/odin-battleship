const moveOrthogonallyOnBoard = (event, board) => {
  const cell = event.target.closest(".cell");
  if (!cell || !event.currentTarget.contains(cell)) return;

  if (!event.code || !event.code.startsWith("Arrow")) return;

  let dirX;
  let dirY;

  const direction = event.code.slice(5);
  switch (direction) {
    case "Up":
      dirX = 0;
      dirY = -1;
      break;
    case "Down":
      dirX = 0;
      dirY = 1;
      break;
    case "Left":
      dirX = -1;
      dirY = 0;
      break;
    case "Right":
      dirX = 1;
      dirY = 0;
      break;
  }

  const currX = Number(event.target.dataset.x);
  const currY = Number(event.target.dataset.y);
  let newX = currX + dirX;
  let newY = currY + dirY;

  const { rows, cols } = board;
  const wrapAround = event.ctrlKey;
  const offset = 1;

  if (wrapAround) {
    newX = ((newX - offset + cols) % cols) + offset;
    newY = ((newY - offset + rows) % rows) + offset;
  }

  const nextElm = event.currentTarget.querySelector(
    `.cell[data-x="${newX}"][data-y="${newY}"]`
  );
  nextElm?.focus();
};

export { moveOrthogonallyOnBoard };
