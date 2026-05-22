const attackCell = (event, match) => {
  const cell = event.target.closest(".cell");
  if (!cell || !event.currentTarget.contains(cell)) return;

  const row = Number(cell.dataset.y) - 1;
  const col = Number(cell.dataset.x) - 1;
  const coordinates = [row, col];

  const status = match.attack(coordinates);

  return status;
};

export { attackCell };
