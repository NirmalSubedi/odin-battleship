const renderSunkReport = (shipName, render = false) => {
  const reportElm = document.body.querySelector(".report");
  const shipNameElm = reportElm.querySelector(".ship-name");
  shipNameElm.textContent = shipName;
  reportElm.classList.toggle("show", render);
};

export { renderSunkReport };
