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
  it('are given starting positions by the user', function () {
    expect(game.startingPlayer).toBe(null);
  });
  it('are given symbols by the user', function () {
    expect(game.players[0].symbol && game.players[1].symbol).toBeUndefined();
  });
  it('are assigned human/computer type by the user', function () {
    expect(game.players[0].type && game.players[1].type).toBeUndefined();
  });
});

describe('During gameplay', function () {
  it('valid user input makes a move', function () {
    game.model.currentPlayer = 1;
    const X = game.players[0];
    expect(game.move(2, X.data)).toBe(true);
  });
  // TODO test comp function
});

describe('To win', function () {
  it('board not full at game start', function () {
    expect(game.checkIfBoardFilled()).toBeFalsy();
  });
  it('game has not been won at game start', function () {
    expect(game.gameWon).toBeFalsy();
  });
});
