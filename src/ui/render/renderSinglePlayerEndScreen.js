import { renderAnnouncement, renderStats } from "./index.js";

const renderSinglePlayerEndScreen = (match) => {
  const overlay = document.body.querySelector(".screen-overlay");
  let winnerName = match.activePlayer.name;

  if (winnerName === "Your") {
    winnerName = "You";
    overlay.dataset.screen = "win";
    renderAnnouncement(`${winnerName} Win!`);
  } else {
    overlay.dataset.screen = "lose";
    renderAnnouncement(`${winnerName} Wins!`);
  }

  renderStats([match.activePlayer, match.defender]);
};

export { renderSinglePlayerEndScreen };
