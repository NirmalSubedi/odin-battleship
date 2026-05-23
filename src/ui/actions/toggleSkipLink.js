const toggleSkipLink = (show = false) => {
  const skipLink = document.querySelector(".skip-link");
  if (show) {
    skipLink.tabIndex = 0;
  } else {
    skipLink.tabIndex = skipLink.tabIndex === 0 ? -1 : 0;
  }
};

export { toggleSkipLink };
