const focusTopOfPage = () => {
  const announceElm = document.body.querySelector("header .announce");
  announceElm.tabIndex = "-1";
  announceElm.focus();
};

export { focusTopOfPage };
