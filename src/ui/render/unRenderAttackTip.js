const unRenderAttackTip = () => {
  const attackTipElm = document.body.querySelector(
    ".instructions .attack-message"
  );
  attackTipElm.classList.add("remove");
};

export { unRenderAttackTip };
