/* globals expectAsync describe, it, expect */

const game = require('../game');

describe('The game board', function () {
  it('exists and is the correct length', function () {
    expect(game.model.board).toBeDefined();
    expect(game.model.board.length).toBe(9);
  });
  it('renders in the console', function () {
    const board = (/........./);
    expect(game.controller.show()).toMatch(board);
  });
});

describe('Players', function () {
  it('receive new properties from user input', function () {
    expectAsync(game.controller.updatePlayer()).toBeResolved();
  });
  it('are given starting positions by the user', function () {
    expect(game.model.currentPlayer).toBe(null);
  });
  it('are given symbols by the user', function () {
    expect(game.model.players[0].symbol && game.model.players[1].symbol).toBeUndefined();
  });
  it('are assigned human/computer type by the user', function () {
    expect(game.model.players[0].type && game.model.players[1].type).toBeUndefined();
  });
});

describe('During gameplay', function () {
  it('valid user input makes a move', function () {
    game.model.currentPlayer = 1;
    const X = game.model.players[0];
    expect(game.controller.move(2, X.data)).toBe(true);
  });
  // TODO test comp function
});

describe('To win', function () {
  it('board not full at game start', function () {
    expect(game.controller.checkIfBoardFilled()).toBeFalsy();
  });
  it('game has not been won at game start', function () {
    expect(game.model.gameWon).toBeFalsy();
  });
});
