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

    const handleKey = (event) => {
      if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey)
        return;
      if (!event.code || event.code !== "KeyQ") return;
      event.preventDefault();

      quitBtn.click();
      document.removeEventListener("keydown", handleKey);
    };
    document.addEventListener("keydown", handleKey, { signal: inputSignal });
  });

export { waitForQuit };
