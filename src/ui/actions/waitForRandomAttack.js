const waitForRandomAttack = async (match, signal) =>
  new Promise((resolve) => {
    const randomAttackBtn = document.body.querySelector(
      ".buttons .random-attack"
    );
    randomAttackBtn.addEventListener(
      "click",
      () => {
        resolve(match.randomAttack());
      },
      { once: true, signal }
    );

    const handleKey = (event) => {
      if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey)
        return;
      if (!event.code || event.code !== "KeyR") return;
      event.preventDefault();

      randomAttackBtn.click();
      document.removeEventListener("keydown", handleKey);
    };
    document.addEventListener("keydown", handleKey, { signal });
  });

export { waitForRandomAttack };
