/* globals describe, it, expect */

const controller = require('../controller');
const model = require('../model');
// const view = require('../view');

describe('The game board', function () {
  it('exists and is the correct length', function () {
    expect(model.board).toBeDefined();
    expect(model.board.length).toBe(9);
  });
  it('renders in the console', function () {
    const board = (/........./);
    expect(controller.show()).toMatch(board);
  });
});

describe('Before user config, players', function () {
  // it('receive new properties from user input', function () {
  //   expectAsync(controller.updatePlayer()).toBeResolved();
  // });
  it('have no starting position', function () {
    expect(model.currentPlayer).toBe(null);
  });
  it('have no symbols defined', function () {
    expect(model.players[0].symbol && model.players[1].symbol).toBeUndefined();
  });
  it('have no human/computer type', function () {
    expect(model.players[0].type && model.players[1].type).toBeUndefined();
  });
});

describe('Before game begins,', function () {
  it('board is empty', function () {
    expect(controller.checkIfBoardFilled()).toBeFalsy();
  });
  it('game has not been won', function () {
    expect(model.gameWon).toBeFalsy();
  });
});

describe('During gameplay', function () {
  it('valid user input makes a move', function () {
    model.currentPlayer = 1;
    const X = model.players[0];
    expect(controller.move(2, X.data)).toBe(true);
  });
  // TODO test comp function
});
