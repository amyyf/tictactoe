/* globals describe, it, expect */

const game = require('../game');

describe('the game board', function () {
  it('exists', function () {
    expect(game.board).toBeDefined();
  });
});
