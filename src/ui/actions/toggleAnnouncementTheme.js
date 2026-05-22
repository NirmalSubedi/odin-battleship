const toggleAnnouncementTheme = () => {
  const announcementElm = document.querySelector("header .announce");
  announcementElm.classList.toggle("alternative");
};

export { toggleAnnouncementTheme };
