/* globals beforeEach, describe, expectAsync, it, expect, spyOn */

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

describe('During user config,', function () {
  beforeEach(() => {
    spyOn(model, 'init');
    spyOn(view, 'init');
    controller.init(model, view);
  });
  it('all modules are initialized', function () {
    expect(model.init).toHaveBeenCalled();
    expect(view.init).toHaveBeenCalled();
  });
  it('the updatePlayer function runs and resolves', function () {
    expectAsync(controller.updatePlayer(1, 'position')).toBeResolved();
  });
  it('the model receives player data updates', function () {
    model.setPlayerData(1, 'type', 'computer');
    expect(model.players[0].type).toBeDefined();
    expect(model.players[0].type).toBe('computer');
  });
});

describe('During gameplay,', function () {
  beforeEach(function () {
    controller.init(model, view);
    model.setStartingPlayer(1, 'y');
    spyOn(controller, 'checkPatterns');
  });
  it('the patterns are checked by the computer pick space function', function () {
    controller.computerPickSpace(1);
    expect(controller.checkPatterns).toHaveBeenCalledTimes(1);
    expect(controller.checkPatterns).toHaveBeenCalledWith('player 1 matches');
  });
  it('the patterns are checked by the checkForWin function', function () {
    model.gameWon = true;
    controller.checkForWin();
    expect(controller.checkPatterns).toHaveBeenCalledTimes(1);
    expect(controller.checkPatterns).toHaveBeenCalledWith('winning patterns');
  });
});
