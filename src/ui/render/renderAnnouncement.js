const renderAnnouncement = (message = "") => {
  const announcement = document.body.querySelector("header .announce .message");
  announcement.textContent = message;
};

export { renderAnnouncement };
