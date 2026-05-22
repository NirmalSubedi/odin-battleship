const unRenderShipFromAside = () => {
  const asideShip = document.body.querySelector("aside .dock .ship");
  if (!asideShip) return;
  asideShip.parentElement.removeChild(asideShip);
};

export { unRenderShipFromAside };
