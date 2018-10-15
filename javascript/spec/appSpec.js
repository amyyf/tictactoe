/* globals describe, it, expect */

const game = require('../game');

describe('The game board', function () {
  it('exists', function () {
    expect(game.board).toBeDefined();
  });
  it('renders in the console', function () {
    const board = (/........./);
    expect(game.show()).toMatch(board);
  });
});

describe('During gameplay', function () {
  it('valid user input makes a move', function () {
    const X = game.players[0];
    expect(game.move(2, X)).toBe(true);
  });
  // TODO test comp function
});

describe('To win', function () {
  it('board not full at game start', function () {
    this.gameMove = game.gameMove;
    expect(game.checkIfBoardFilled()).toBeFalsy();
  });
  it('game has not been won at game start', function () {
    expect(game.gameWon).toBeFalsy();
  });
});
