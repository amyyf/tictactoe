module.exports = {

  init: function (model, view) {
    this.model = model;
    this.view = view;
    this.model.init();
    this.view.init();
  },

  checkForGameOver: function () {
    if (this.checkForWin() || this.checkIfBoardFilled()) {
      this.exit();
    }
  },

  checkForWin: function () {
    const patterns = this.model.sharePatterns();
    const checkWinningPatterns = this.checkPatterns(patterns[2]);
    if (checkWinningPatterns === -1 && this.model.gameWon === false) {
      return false;
    } else {
      this.model.gameWon = true;
      this.view.sayMessage(this.view.messages.gameWon, this.model.currentPlayer);
      return true;
    }
  },

  checkIfBoardFilled: function () {
    if (this.model.board.join('').indexOf(0) === -1) {
      this.view.sayMessage(this.view.messages.gameOver);
      return true;
    }
    return false;
  },

  checkPatterns: function (patternsToCheck) {
    const boardString = this.model.board.join('');
    for (let i = 0; i < patternsToCheck.length; i++) {
      if (boardString.match(patternsToCheck[i][0])) {
        return patternsToCheck[i][1];
      }
    }
    return -1;
  },

  computerPickSpace: function (currentPlayer) {
    const patterns = this.model.sharePatterns();
    const board = this.model.shareBoardData();
    const boundController = this;
    let checkFirst, checkSecond;
    if (currentPlayer === 1) {
      checkFirst = 0;
      checkSecond = 1;
    } else if (currentPlayer === 2) {
      checkFirst = 1;
      checkSecond = 0;
    }
    let space = boundController.checkPatterns(patterns[checkFirst]);
    if (space === -1) {
      space = boundController.checkPatterns(patterns[checkSecond]);
      if (space === -1) {
      /* the computer's default/fallback position is the center or, if the center is filled,
      the first empty space IF there's no possible win on the next move */
        if (board[4] === 0) {
          space = 4;
        } else {
          space = board.indexOf(0);
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

  // TODO correct for zero-indexed array based on directions
  // executes after player gives valid input or computer fn has selected a space
  move: function (chosenSpace, playerData) {
    // checks that the correct player is moving
    if (playerData !== this.model.currentPlayer) {
      return false;
    }
    // unary plus ('+') converts position to a number
    if (+chosenSpace >= 0 && +chosenSpace <= 8 && !isNaN(+chosenSpace) && this.model.board[+chosenSpace] === 0) {
      // TODO need update board function
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
        boundView.handleUserInput()
          .then(space => {
            if (boundController.move(space - 1, currentPlayer.data)) {
              boundController.show();
              boundController.checkForGameOver();
              boundModel.toggleCurrentPlayer();
            } else {
              boundView.sayMessage(boundView.messages.invalidEntry);
            }
            resolve(currentPlayer);
          });
        // reject(console.log('rejected in human'));
      } else if (currentPlayer.type === 'computer') {
        setTimeout(function () {
          const space = boundController.computerPickSpace(currentPlayer.data);
          boundController.move(space, currentPlayer.data);
          boundController.show();
          boundController.checkForGameOver();
          boundModel.toggleCurrentPlayer();
          resolve(currentPlayer);
          // reject(console.log('rejected in computer'));
        }, 500);
      }
    });
    return play;
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
    const boundModel = this.model;
    const boundView = this.view;
    // return early if currentPlayer has already been assigned
    if (prop === 'position' && this.model.shareCurrentPlayer()) {
      return Promise.resolve(player[prop]);
    }
    boundView.sayMessage(boundView.messages.playerSetup[prop], player);
    const playerData = new Promise(function (resolve, reject) {
      boundView.handleUserInput()
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
