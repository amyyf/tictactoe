module.exports = {

  init: function (model, view) {
    this.model = model;
    this.view = view;
    this.model.init();
    this.view.init();
  },

  checkForGameOver: function () {
    if (this.checkForWin()) {
      this.show('gameWon', this.model.currentPlayer);
      this.exit();
    } else if (this.checkIfBoardFilled()) {
      this.show('gameOver');
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
    if (this.model.board.indexOf(0) === -1) {
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
      .then(() => this.view.getPlayerSymbols(this.model.sharePlayerSymbols()));
  },

  exit: function () {
    process.exit();
  },

  move: function (chosenSpace, playerData) {
    // unary plus ('+') converts position to a number
    this.model.updateBoard(+chosenSpace, playerData);
    this.checkForGameOver();
    this.model.toggleCurrentPlayer();
  },

  play: function (invalidEntry) {
    const boundController = this;
    const boundView = this.view;
    const currentPlayer = this.model.shareCurrentPlayer();
    const play = new Promise(function (resolve, reject) {
      boundController.show('turn', currentPlayer.data);
      if (invalidEntry) {
        boundView.sayMessage(boundView.messages.invalidEntry, currentPlayer.data);
      }
      if (currentPlayer.type === 'human') {
        resolve(
          boundController.processInput('move', currentPlayer.data)
            .then(space => boundController.move(space, currentPlayer.data))
        );
      } else if (currentPlayer.type === 'computer') {
        setTimeout(function () {
          const space = boundController.computerPickSpace(currentPlayer.data);
          resolve(boundController.move(space, currentPlayer.data));
        }, 500);
      }
    });
    return play;
  },

  processInput: function (inputType, player) {
    return this.view.handleUserInput(inputType)
      .then(response => {
        if (
          (inputType === 'position' && (response === 'y' || response === 'n')) ||
          (inputType === 'type' && (response === '1' || response === '2')) ||
          (inputType === 'symbol' && response.match(/\S/)) ||
          (inputType === 'move' && (+response >= 0 && +response <= 8 && this.model.board[+response] === 0))
        ) {
          return response;
        } else {
          this.view.sayMessage(this.view.messages.invalidEntry);
          if (inputType === 'move') {
            return this.processInput(inputType, player);
          }
          return this.updatePlayer(player, inputType);
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

  show: function (message, playerData) {
    const board = this.view.convertBoardArrayToSymbols(this.model.shareBoardData());
    this.view.renderBoard(board);
    this.view.sayMessage(this.view.messages[message], playerData);
  },

  updatePlayer: function (player, prop) {
    const boundController = this;
    const boundModel = this.model;
    const boundView = this.view;
    boundView.sayMessage(boundView.messages.playerSetup[prop], player);
    const playerData = new Promise(function (resolve, reject) {
      boundController.processInput(prop, player)
        .then(selection => {
          if (prop === 'position') {
            if (selection === 'y') {
              boundModel.setStartingPlayer(1);
            } else if (selection === 'n') {
              boundModel.setStartingPlayer(2);
            }
          } else {
            if (prop === 'type' && selection === '1') {
              selection = 'human';
            } else if (prop === 'type' && selection === '2') {
              selection = 'computer';
            }
            boundModel.setPlayerData(player, prop, selection);
          }
          resolve(player[prop]);
        });
    });
    return playerData;
  }
};
