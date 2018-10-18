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
        name: 'player1',
        data: 1
      },
      {
        name: 'player2',
        data: 2
      }
    ];
    this.currentPlayer = null;
    this.gameWon = false;
  },

  setStartingPlayer: function (player, selection) {
    if (this.currentPlayer === null && selection === 'y') {
      this.currentPlayer = player;
    }
  },

  setPlayerData: function (player, key, value) {
    const position = player - 1;
    this.players[position][key] = value;
  },

  shareBoardData: function () {
    return this.board;
  },

  shareCurrentPlayer: function () {
    const id = this.currentPlayer;
    // correct to zero-index
    return this.players[id - 1];
  },

  sharePatterns: function () {
    return this.patterns;
  },

  sharePlayerSymbols: function () {
    const player1Symbol = this.players[0].symbol;
    const player2Symbol = this.players[1].symbol;
    return [player1Symbol, player2Symbol];
  },

  toggleCurrentPlayer: function () {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }
};

const controller = {

  init: function () {
    model.init();
    view.init();
    this.createPlayers()
      .then(() => this.runPlaySequence());
  },

  show: function () {
    const boardData = model.shareBoardData();
    const playerSymbols = model.sharePlayerSymbols();
    return view.renderBoard(boardData, playerSymbols);
  },

  // this fn controls computer gameplay, runs after player makes a move and gameplay should continue
  // TODO separate concerns with move and check for win
  computerPickSpace: function (currentPlayer) {
    let space = 0;
    const patterns = model.sharePatterns();
    const board = model.shareBoardData();
    const boundController = this;
    space = boundController.checkPatterns(patterns[0]);
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
    const inputStream = process.openStdin();
    return this.updatePlayer(1, 'type', inputStream)
      .then(() => this.updatePlayer(1, 'symbol', inputStream))
      .then(() => this.updatePlayer(1, 'position', inputStream))
      .then(() => this.updatePlayer(2, 'type', inputStream))
      .then(() => this.updatePlayer(2, 'symbol', inputStream))
      .then(() => this.updatePlayer(2, 'position', inputStream));
  },

  // TODO separate concerns in below function
  // TODO handle bad data entry
  // TODO implement catch
  updatePlayer: function (player, prop, stream) {
    // return early if currentPlayer has already been assigned
    if (prop === 'position' && model.shareCurrentPlayer()) {
      return;
    }
    view.sayMessage(view.messages.playerSetup[prop]);
    const playerData = new Promise(function (resolve, reject) {
      stream.once('data', res => {
        let convertedRes = res.toString('utf8').slice(0, 1);
        if (prop === 'position') {
          model.setStartingPlayer(player, convertedRes);
        } else {
          if (prop === 'type' && convertedRes === '1') {
            convertedRes = 'human';
          } else if (prop === 'type' && convertedRes === '2') {
            convertedRes = 'computer';
          }
          model.setPlayerData(player, prop, convertedRes);
        }
        resolve(player[prop]);
      });
    });
    return playerData;
  },

  // executes after player gives valid input or computer fn has selected a space
  move: function (chosenSpace, playerData) {
    // checks that the correct player is moving
    if (playerData !== model.currentPlayer) {
      return false;
    }
    // unary plus ('+') converts position to a number
    if (+chosenSpace >= 0 && +chosenSpace <= 8 && !isNaN(+chosenSpace) && model.board[+chosenSpace] === 0) {
      // TODO need update board function
      model.board.splice(+chosenSpace, 1, playerData);
      return true;
    }
    // TODO handle bad data here or in play fn
    return false;
  },

  checkIfBoardFilled: function () {
    let x = model.board.join('').indexOf(0);
    if (x === -1) {
      this.show();
      view.sayMessage(view.messages.gameOver);
      return true;
    }
    return false;
  },

  checkForGameOver: function () {
    if (this.checkForWin() || this.checkIfBoardFilled()) {
      this.exit();
    }
  },

  checkPatterns: function (patternsToCheck) {
    const boardString = model.board.join('');
    for (let i = 0; i < patternsToCheck.length; i++) {
      const array = boardString.match(patternsToCheck[i][0]);
      if (array) {
        return patternsToCheck[i][1];
      }
    }
    return -1;
  },

  // TODO gameWon status no longer needed? it's probably a good check, though
  checkForWin: function () {
    const patterns = model.sharePatterns();
    const winFound = this.checkPatterns(patterns[2]);
    if (winFound === -1 && model.gameWon === false) {
      return false;
    } else {
      model.gameWon = true;
      this.show();
      view.sayMessage(view.messages.gameWon);
      return true;
    }
  },

  exit: function () {
    process.exit();
  },

  runPlaySequence: function () {
    this.show();
    view.sayMessage(view.messages.instructions);
    const inputStream = process.openStdin();
    // only nine moves are possible in a game of tic tac toe
    return this.play(inputStream)
      .then(() => this.play(inputStream))
      .then(() => this.play(inputStream))
      .then(() => this.play(inputStream))
      .then(() => this.play(inputStream))
      .then(() => this.play(inputStream))
      .then(() => this.play(inputStream))
      .then(() => this.play(inputStream))
      .then(() => this.play(inputStream))
      .then(() => this.checkPatterns(model.sharePatterns()[3]))
      .catch((e) => console.log(e));
  },

  play: function (inputStream) {
    const boundController = this;
    const currentPlayer = model.shareCurrentPlayer();
    const play = new Promise(function (resolve, reject) {
      if (currentPlayer.type === 'human') {
        inputStream.once('data', function (chosenSpace) {
          if (boundController.move(chosenSpace, currentPlayer.data)) {
            boundController.show();
            boundController.checkForGameOver();
            model.toggleCurrentPlayer();
          } else {
            view.sayMessage(view.messages.invalidEntry);
          }
          resolve(currentPlayer);
          reject(console.log('rejected in human'));
        });
      } else if (currentPlayer.type === 'computer') {
        setTimeout(function () {
          const space = boundController.computerPickSpace(currentPlayer);
          boundController.move(space, currentPlayer.data);
          boundController.show();
          boundController.checkForGameOver();
          model.toggleCurrentPlayer();
          resolve(currentPlayer);
          reject(console.log('rejected in computer'));
        }, 500);
      }
    });
    return play;
  }
};

const view = {

  init: function () {
    this.messages = {
      gameOver: 'Game over',
      gameWon: 'Game won',
      instructions: 'Enter [0-8]:',
      invalidEntry: 'That was not a valid move',
      playerSetup: {
        position: 'Will Player 1 play first? Enter y/n.',
        symbol: 'What symbol will Player 1 use? Enter the symbol and press enter to confirm.',
        type: 'Is Player 1 a human or computer? Enter \'1\' for human and \'2\' for computer.'
      },
      welcome: 'Welcome to Tic Tac Toe! First you\'ll need to create your players. We\'ll set up one player at a time.'
    };
    this.sayMessage(this.messages.welcome);
  },

  // TODO "the existing code is so coupled to the console"
  renderBoard: function (boardData, playerSymbols) {
    const [ player1Symbol, player2Symbol ] = playerSymbols;
    const boardSymbols = boardData.map(space => {
      if (space === 0) {
        return ' ';
      } else if (space === 1) {
        return player1Symbol;
      } else if (space === 2) {
        return player2Symbol;
      }
    });
    console.log(' ' + boardSymbols[0] + ' |' + ' ' + boardSymbols[1] + ' |' + ' ' + boardSymbols[2] + '\n===+===+===\n' +
    ' ' + boardSymbols[3] + ' |' + ' ' + boardSymbols[4] + ' |' + ' ' + boardSymbols[5] + '\n===+===+===\n' +
    ' ' + boardSymbols[6] + ' |' + ' ' + boardSymbols[7] + ' |' + ' ' + boardSymbols[8]);
  },

  sayMessage: function (message) {
    console.log(message);
  }
};

controller.init();

// export for Jasmine testing
module.exports = {
  board: model.board,
  checkIfBoardFilled: controller.checkIfBoardFilled,
  computerPickSpace: controller.computerPickSpace,
  createPlayers: controller.createPlayers,
  gameWon: model.gameWon,
  getMove: controller.getMove,
  model: model,
  move: controller.move,
  play: controller.play,
  players: model.players,
  renderBoard: view.renderBoard,
  setPlayerData: model.setPlayerData,
  show: controller.show,
  startingPlayer: model.currentPlayer,
  updatePlayer: controller.updatePlayer
};
