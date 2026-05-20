const toggleSkipLink = () => {
  const skipLink = document.querySelector(".skip-link");
  skipLink.tabIndex = skipLink.tabIndex === 0 ? -1 : 0;
};

export { toggleSkipLink };
