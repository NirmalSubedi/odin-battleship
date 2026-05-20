const getModeSelection = (event) => {
  const modeElm = event.target.closest("[class$='-player']");
  if (!modeElm || !event.currentTarget.contains(modeElm)) return;

  const validKeys = ["Enter", "Space"];
  if (event.code && !validKeys.includes(event.code)) return;

  const mode = modeElm.className;
  return mode.slice(0, mode.indexOf("-"));
};

export { getModeSelection };
