const processNames = (match) => {
  const names = [];
  const inputs = document.body.querySelectorAll(".name-selection input");

  inputs.forEach((input) => {
    const name = input.value.trim();
    if (name !== "") names.push(name);
  });

  match.setPlayers(...names);
};

export { processNames };
