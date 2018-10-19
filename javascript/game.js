const model = {

  init: function () {
    this.patterns = [
      // 0 indicates an unchosen spot
      // patterns to win as O (or block O), position to play
      [
        [(/022....../), 0],
        [(/2..2..0../), 6],
        [(/......220/), 8],
        [(/..0..2..2/), 2],
        [(/0..2..2../), 0],
        [(/......022/), 6],
        [(/..2..2..0/), 8],
        [(/220....../), 2],
        [(/0...2...2/), 0],
        [(/..2.2.0../), 6],
        [(/2...2...0/), 8],
        [(/..0.2.2../), 2],
        [(/202....../), 1],
        [(/2..0..2../), 3],
        [(/......202/), 7],
        [(/..2..0..2/), 5],
        [(/.0..2..2./), 1],
        [(/...022.../), 3],
        [(/.2..2..0./), 7],
        [(/...220.../), 5]
      ],
      // patterns to win as X (or block X), position to play
      [
        [(/0{2}10.010{2}/), 1],
        [(/011....../), 0],
        [(/1..1..0../), 6],
        [(/......110/), 8],
        [(/..0..1..1/), 2],
        [(/0..1..1../), 0],
        [(/......011/), 6],
        [(/..1..1..0/), 8],
        [(/110....../), 2],
        [(/0...1...1/), 0],
        [(/..1.1.0../), 6],
        [(/1...1...0/), 8],
        [(/..0.1.1../), 2],
        [(/101....../), 1],
        [(/1..0..1../), 3],
        [(/......101/), 7],
        [(/..1..0..1/), 5],
        [(/.0..1..1./), 1],
        [(/...011.../), 3],
        [(/.1..1..0./), 7],
        [(/...110.../), 5],
        [(/0101..0../), 0],
        [(/0..1..010/), 6],
        [(/..0..1010/), 8],
        [(/010..1.. /), 2],
        [(/0{2}11..0../), 0],
        [(/1..0..010/), 6],
        [(/..0.110{3}/), 8],
        [(/10{2}..1..0/), 2],
        [(/010{2}..1../), 0],
        [(/0..1..0{2}1/), 6],
        [(/..1..0{2}10/), 8],
        [(/10{2}..1..0/), 2]
      ],
      // these are the possible winning strings for each player
      [
        [(/222....../), '2'],
        [(/...222.../), '2'],
        [(/......222/), '2'],
        [(/2..2..2../), '2'],
        [(/.2..2..2./), '2'],
        [(/..2..2..2/), '2'],
        [(/2...2...2/), '2'],
        [(/..2.2.2../), '2'],
        [(/111....../), '1'],
        [(/...111.../), '1'],
        [(/......111/), '1'],
        [(/1..1..1../), '1'],
        [(/.1..1..1./), '1'],
        [(/..1..1..1/), '1'],
        [(/1...1...1/), '1'],
        [(/..1.1.1../), '1']
      ]
    ];
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    // TODO name formatted like Player 1?
    this.players = [
      {
        name: 'Player 1',
        data: 1
      },
      {
        name: 'Player 2',
        data: 2
      }
    ];
    this.currentPlayer = null;
    this.gameWon = false;
  },

  setPlayerData: function (player, key, value) {
    const position = player - 1;
    this.players[position][key] = value;
  },

  setStartingPlayer: function (player, selection) {
    if (this.currentPlayer === null && selection === 'y') {
      this.currentPlayer = player;
    }
  },

  shareBoardData: function () {
    return this.board;
  },

  shareCurrentPlayer: function () {
    // correct to zero-index
    return this.players[this.currentPlayer - 1];
  },

  sharePatterns: function () {
    return this.patterns;
  },

  sharePlayerSymbols: function () {
    return [this.players[0].symbol, this.players[1].symbol];
  },

  toggleCurrentPlayer: function () {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }
};

const controller = {

  init: function (model, view) {
    this.model = model;
    this.view = view;
    this.model.init();
    this.view.init();
    this.createPlayers()
      .then(() => this.runPlaySequence());
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
    let space = boundController.checkPatterns(patterns[0]);
    if (space === -1) {
      space = boundController.checkPatterns(patterns[1]);
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
          const space = boundController.computerPickSpace(currentPlayer);
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
      .then(() => this.checkPatterns(this.model.sharePatterns()[3]))
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
      return;
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

const view = {

  init: function () {
    this.messages = {
      gameOver: 'Game over',
      gameWon: 'Player num wins!',
      instructions: 'Instructions: \nEnter [1-9] to make your move. \nThe spaces in the board above are currently marked to show which key corresponds with which space. \nPress ENTER to play!',
      invalidEntry: 'That was not a valid move',
      player1: 'Player 1',
      player2: 'Player 2',
      playerSetup: {
        position: 'Will Player num play first? Enter y/n.',
        symbol: 'What symbol will Player num use? Enter the symbol and press enter to confirm.',
        type: 'Is Player num a human or computer? Enter \'1\' for human and \'2\' for computer.'
      },
      turn: 'It\'s Player num\'s turn...',
      welcome: 'Welcome to Tic Tac Toe! \nFirst you\'ll need to create your players. We\'ll set up one player at a time.'
    };
    this.board = `
     symbol | symbol | symbol
    ===+===+===
     symbol | symbol | symbol
    ===+===+===
     symbol | symbol | symbol

    `;
    this.sayMessage(this.messages.welcome);
  },

  convertBoardString: function (boardData) {
    return boardData.map(space => {
      if (space === 0) {
        return ' ';
      } else if (space === 1) {
        return this.player1Symbol;
      } else if (space === 2) {
        return this.player2Symbol;
      }
    });
  },

  getPlayerSymbols: function (playerSymbols) {
    [ this.player1Symbol, this.player2Symbol ] = playerSymbols;
  },

  handleUserInput: function () {
    const input = new Promise(function (resolve, reject) {
      process.openStdin().once('data', function (response) {
        const convertedResponse = response.toString('utf8').slice(0, 1);
        resolve(convertedResponse);
      });
    });
    return input;
  },

  renderBoard: function (boardString) {
    console.clear();
    let newBoard = this.board;
    boardString.forEach(symbol => {
      newBoard = newBoard.replace('symbol', symbol);
    });
    console.log(newBoard);
  },

  renderInstructions: function () {
    const boundView = this;
    const instructions = new Promise(function (resolve, reject) {
      boundView.renderBoard([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      boundView.sayMessage(boundView.messages.instructions);
      process.openStdin().once('data', function () {
        resolve(console.log('done'));
      });
    });
    return instructions;
  },

  sayMessage: function (message, player) {
    console.log(message.replace('num', player));
  }
};

controller.init(model, view);

// export for Jasmine testing
module.exports = {
  controller: controller,
  model: model,
  view: view
};
