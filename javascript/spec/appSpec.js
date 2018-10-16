/* globals expectAsync describe, it, expect */

const game = require('../game');

describe('The game board', function () {
  it('exists and is the correct length', function () {
    expect(game.board).toBeDefined();
    expect(game.board.length).toBe(9);
  });
  it('renders in the console', function () {
    const board = (/........./);
    expect(game.show()).toMatch(board);
  });
});

describe('Players', function () {
  it('receive new properties from user input', function () {
    expectAsync(game.updatePlayer()).toBeResolved();
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
