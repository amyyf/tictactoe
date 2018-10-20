const controller = require('./controller');
const model = require('./model');
const view = require('./view');

controller.init(model, view);
controller.createPlayers()
  .then(() => controller.runPlaySequence());
