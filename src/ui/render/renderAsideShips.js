const renderAsideShips = (playerDock = []) => {
  const dockElm = document.body.querySelector("aside .fleet .dock");

  if (dockElm.childElementCount >= playerDock.length) return;

  dockElm.textContent = "";
  for (let i = 0; i < playerDock.length; ++i) {
    const ship = playerDock[i];
    const shipElm = document.createElement("div");
    for (let j = 0; j < ship.length; ++j) {
      const shipPartElm = document.createElement("div");

      shipPartElm.setAttribute("class", "ship-part");
      shipElm.appendChild(shipPartElm);
    }
    shipElm.setAttribute("class", "ship");
    dockElm.appendChild(shipElm);
  }
};

export { renderAsideShips };
