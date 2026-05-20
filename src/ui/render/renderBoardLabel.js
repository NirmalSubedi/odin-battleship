const renderBoardLabel = (message = "") => {
  const label = document.body.querySelector("main .board .board-label");
  label.textContent = message;
};

export { renderBoardLabel };
