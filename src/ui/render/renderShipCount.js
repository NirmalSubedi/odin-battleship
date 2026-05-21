const renderShipCount = (board = {}) => {
  const shipCountElm = document.body.querySelector("main .ship-count .ships");
  shipCountElm.textContent = board.countAliveShips();
};

export { renderShipCount };
