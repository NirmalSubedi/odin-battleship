const toggleSkipLink = (show = false) => {
  const skipLink = document.querySelector(".skip-link");
  skipLink.tabIndex = show ? 0 : -1;
};

export { toggleSkipLink };
