const getHitAccuracy = (shots, hits) => `${Math.trunc((hits / shots) * 100)}%`;

const renderStats = (players = []) => {
  const dialog = document.body.querySelector("dialog.stats");
  dialog.show();

  const nameElms = dialog.querySelectorAll(".player-name");
  const shipsSunkElms = dialog.querySelectorAll(".ships-sunk .stat");
  const shotsFiredElms = dialog.querySelectorAll(".shots-fired .stat");
  const hitAccuracyElms = dialog.querySelectorAll(".hit-accuracy .stat");

  for (let i = 0; i < players.length; ++i) {
    const player = players[i];
    const { stats } = player;

    nameElms[i].textContent = player.name === "Your" ? "You" : player.name;
    shipsSunkElms[i].textContent = stats.shipsSunk;
    shotsFiredElms[i].textContent = stats.shots;
    hitAccuracyElms[i].textContent = getHitAccuracy(stats.shots, stats.hits);
  }
};

export { renderStats };
