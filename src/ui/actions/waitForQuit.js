const waitForQuit = async (inputSignal, matchController) =>
  new Promise((resolve) => {
    const quitBtn = document.body.querySelector(".buttons .home-screen");
    quitBtn.addEventListener(
      "click",
      () => {
        resolve(matchController.abort());
      },
      { once: true, signal: inputSignal }
    );
  });

export { waitForQuit };
