module.exports = {

  init: function (model, view) {
    this.model = model;
    this.view = view;
    this.model.init();
    this.view.init();
  },

  checkForGameOver: function () {
    if (this.checkForWin()) {
      this.view.sayMessage(this.view.messages.gameWon, this.model.currentPlayer);
      this.exit();
    } else if (this.checkIfBoardFilled()) {
      this.view.sayMessage(this.view.messages.gameOver);
      this.exit();
    }
  },

  checkForWin: function () {
    const checkWinningPatterns = this.checkPatterns('winning patterns');
    if (checkWinningPatterns === -1 && this.model.gameWon === false) {
      return false;
    } else {
      this.model.gameWon = true;
      return true;
    }
  },

  checkIfBoardFilled: function () {
    if (this.model.board.join('').indexOf(0) === -1) {
      return true;
    }
    return false;
  },

  checkPatterns: function (patternsToCheck) {
    const patterns = this.model.sharePatterns(patternsToCheck);
    const boardString = this.model.shareBoardData().join('');
    for (let i = 0; i < patterns.length; i++) {
      if (boardString.match(patterns[i][0])) {
        return patterns[i][1];
      }
    }
    return -1;
  },

  computerPickSpace: function (currentPlayer) {
    const boundController = this;
    // determine which patterns to check first
    let checkFirst, checkSecond;
    if (currentPlayer === 1) {
      checkFirst = 'player 1 matches';
      checkSecond = 'player 2 matches';
    } else if (currentPlayer === 2) {
      checkFirst = 'player 2 matches';
      checkSecond = 'player 1 matches';
    }
    let space = boundController.checkPatterns(checkFirst);
    if (space === -1) {
      space = boundController.checkPatterns(checkSecond);
      if (space === -1) {
      /* the computer's default/fallback position is the center or, if the center is filled,
      the first empty space IF there's no possible win on the next move */
        if (this.model.shareBoardData()[4] === 0) {
          space = 4;
        } else {
          space = this.model.shareBoardData().indexOf(0);
        }
      }
    }
    return space;
  },

  createPlayers: function () {
    this.view.sayMessage(this.view.messages.welcome);
    return this.updatePlayer(1, 'type')
      .then(() => this.updatePlayer(1, 'symbol'))
      .then(() => this.updatePlayer(1, 'position'))
      .then(() => this.updatePlayer(2, 'type'))
      .then(() => this.updatePlayer(2, 'symbol'))
      .then(() => this.updatePlayer(2, 'position'))
      .then(() => this.view.getPlayerSymbols(this.model.sharePlayerSymbols()));
  },

  exit: function () {
    process.exit();
  },

  // executes after player gives valid input or computer fn has selected a space
  move: function (chosenSpace, playerData) {
    console.log(chosenSpace);
    // unary plus ('+') converts position to a number
    if (+chosenSpace >= 0 && +chosenSpace <= 8 && !isNaN(+chosenSpace) && this.model.board[+chosenSpace] === 0) {
      // TODO need update board function in model
      this.model.board.splice(+chosenSpace, 1, playerData);
      return true;
    }
    // TODO handle bad data here or in play fn
    return false;
  },

  play: function () {
    const boundController = this;
    const boundModel = this.model;
    const boundView = this.view;
    const currentPlayer = this.model.shareCurrentPlayer();
    const play = new Promise(function (resolve, reject) {
      boundController.show();
      boundView.sayMessage(boundView.messages.turn, currentPlayer.data);
      if (currentPlayer.type === 'human') {
        return boundController.processInput('move', currentPlayer.data)
          .then(space => {
            if (boundController.move(space, currentPlayer.data)) {
              /* TODO duplicated code - maybe set human/computer outside promise,
              pick space, then initiate move sequence */
              boundController.show();
              boundController.checkForGameOver();
              boundModel.toggleCurrentPlayer();
            } else {
              boundView.sayMessage(boundView.messages.invalidEntry);
              boundView.sayMessage(boundView.messages.turn, currentPlayer.data);
            }
            resolve(currentPlayer);
          });
      } else if (currentPlayer.type === 'computer') {
        setTimeout(function () {
          const space = boundController.computerPickSpace(currentPlayer.data);
          boundController.move(space, currentPlayer.data);
          // TODO duplicated code with above
          boundController.show();
          boundController.checkForGameOver();
          boundModel.toggleCurrentPlayer();
          resolve(currentPlayer);
        }, 500);
      }
    });
    return play;
  },

  processInput: function (inputType, player) {
    return this.view.handleUserInput(inputType)
      .then(response => {
        if (inputType === 'position') {
          if (response === 'y' || response === 'n') {
            return response;
          } else {
            this.view.sayMessage(this.view.messages.invalidEntry);
            return this.updatePlayer(player, inputType);
          }
        } else if (inputType === 'type') {
          if (response === '1' || response === '2') {
            return response;
          } else {
            this.view.sayMessage(this.view.messages.invalidEntry);
            return this.updatePlayer(player, inputType);
          }
        } else if (inputType === 'symbol') {
          const regexp = /\S/;
          if (response.match(regexp)) {
            return response;
          } else {
            this.view.sayMessage(this.view.messages.invalidEntry);
            return this.updatePlayer(player, inputType);
          }
        } else if (inputType === 'move') {
          if (+response >= 0 && +response <= 8 && !isNaN(+response) && this.model.board[+response] === 0) {
            return response;
          } else {
            this.view.sayMessage(this.view.messages.invalidEntry);
            return this.play();
          }
        }
      });
  },

  // only nine moves are possible in a game of tic tac toe
  runPlaySequence: function () {
    return this.view.renderInstructions()
      .then(() => this.play())
      .then(() => this.play())
      .then(() => this.play())
      .then(() => this.play())
      .then(() => this.play())
      .then(() => this.play())
      .then(() => this.play())
      .then(() => this.play())
      .then(() => this.play())
      .catch((e) => console.log(e));
  },

  show: function () {
    const board = this.view.convertBoardString(this.model.shareBoardData());
    this.view.renderBoard(board);
  },

  // TODO separate concerns in below function
  // TODO handle bad data entry
  // TODO implement catch
  updatePlayer: function (player, prop) {
    const boundController = this;
    const boundModel = this.model;
    const boundView = this.view;
    // return early if currentPlayer has already been assigned
    if (prop === 'position' && this.model.shareCurrentPlayer()) {
      return Promise.resolve(player[prop]);
    }
    boundView.sayMessage(boundView.messages.playerSetup[prop], player);
    const playerData = new Promise(function (resolve, reject) {
      boundController.processInput(prop, player)
        .then(selection => {
          if (prop === 'position') {
            boundModel.setStartingPlayer(player, selection);
          } else {
            if (prop === 'type' && selection === '1') {
              selection = 'human';
            } else if (prop === 'type' && selection === '2') {
              selection = 'computer';
            }
            boundModel.setPlayerData(player, prop, selection);
          }
          resolve(player[prop]);
          // reject(console.log('Sorry, this data was invalid. Please make another selection.'));
        });
    });
    return playerData;
  }
};
