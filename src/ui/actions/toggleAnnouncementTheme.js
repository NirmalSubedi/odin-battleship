const toggleAnnouncementTheme = (show = false) => {
  const announcementElm = document.querySelector("header .announce");
  if (show) {
    announcementElm.classList.toggle("alternative", show);
  } else {
    announcementElm.classList.toggle("alternative");
  }
};

export { toggleAnnouncementTheme };
