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
  });

export { waitForRandomAttack };
