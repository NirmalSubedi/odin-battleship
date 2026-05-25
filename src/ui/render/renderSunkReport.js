const renderSunkReport = (shipName = "ship", render = false) => {
  const reportElm = document.body.querySelector(".report");
  const shipNameElm = reportElm.querySelector(".ship-name");
  shipNameElm.textContent = shipName;
  reportElm.classList.toggle("show", render);
};

export { renderSunkReport };
