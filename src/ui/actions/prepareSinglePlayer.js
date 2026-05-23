import { renderFleetScreen } from "../render/index.js";
import { toggleSkipLink } from "./index.js";

const prepareSinglePlayer = (match, mode, attachShipPlacementListeners) => {
  match.setMode(mode).init();

  renderFleetScreen(match);
  attachShipPlacementListeners(match);
  toggleSkipLink();
};

export { prepareSinglePlayer };
