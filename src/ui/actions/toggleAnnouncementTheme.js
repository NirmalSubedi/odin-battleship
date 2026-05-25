const toggleAnnouncementTheme = (show) => {
  const announcementElm = document.querySelector("header .announce");
  announcementElm.classList.toggle("alternative", show);
};

export { toggleAnnouncementTheme };
