import { GameBoard } from "./index.js";

class Player {
  type;
  board;

  constructor({ type = "computer", row, col } = {}) {
    this.type = type;
    this.board = new GameBoard(row, col);
  }
}

export { Player };
