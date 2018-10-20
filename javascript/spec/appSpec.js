/* globals beforeEach, describe, it, expect */

const controller = require('../controller');
const model = require('../model');
const view = require('../view');

describe('Before game begins,', function () {
  beforeEach(() => controller.init(model, view));
  it('game has not been won', function () {
    expect(model.gameWon).toBeFalsy();
  });
  it('the board data array exists and is the correct length', function () {
    expect(model.board).toBeDefined();
    expect(model.board.length).toBe(9);
    expect(controller.checkIfBoardFilled()).toBeFalsy();
  });
  it('players are not fully defined', function () {
    expect(model.currentPlayer).toBe(null);
    expect(model.players[0].symbol && model.players[1].symbol).toBeUndefined();
    expect(model.players[0].type && model.players[1].type).toBeUndefined();
  });
});

describe('Before user config, players', function () {
  beforeEach(() => controller.init(model, view));
  // it('receive new properties from user input', function () {
  //   expectAsync(controller.updatePlayer()).toBeResolved();
  // });
});

describe('During gameplay', function () {
  beforeEach(function () {
    model.init();
    model.setStartingPlayer(1, 'y');
  });
  // it('computer chooses a space', function () {
  //   expect(controller.computerPickSpace(1)).toBeLessThanOrEqual(9);
  // });
});
