const renderDock = (playerDock) => {
  const dockElm = document.body.querySelector("aside .fleet .dock");

  for (let i = 0; i < playerDock.length; ++i) {
    const ship = playerDock[i];
    const shipElm = document.createElement("div");

    for (let j = 0; j < ship.length; ++j) {
      const shipPart = document.createElement("div");
      shipPart.setAttribute("class", "ship-part");
      shipElm.appendChild(shipPart);
    }

    shipElm.setAttribute("class", "ship");
    dockElm.appendChild(shipElm);
  }
};

export { renderDock };
