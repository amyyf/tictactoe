const model = {
  patterns: [
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
  ],
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  X: 'X',
  O: 'O',
  // TODO generate players and symbols from user input
  players: [
    {
      name: 'player1',
      data: 1,
      symbol: 'X'
    },
    {
      name: 'player2',
      data: 2,
      symbol: 'O'
    }
  ],
  currTurn: this.X,
  gameWon: false,
  shareBoardData: function () {
    return this.board;
  },

  sharePatterns: function () {
    return this.patterns;
  },

  sharePlayerSymbols: function () {
    const player1Symbol = this.players[0].symbol;
    const player2Symbol = this.players[1].symbol;
    return [player1Symbol, player2Symbol];
  }
};

const controller = {
  init: function () {
    this.play();
  },

  show: function () {
    const boardData = model.shareBoardData();
    const playerSymbols = model.sharePlayerSymbols();
    return view.renderBoard(boardData, playerSymbols);
  },

  // this fn controls computer gameplay, runs after player makes a move and gameplay should continue
  computerPickSpace: function () {
    const patterns = model.sharePatterns();
    const board = model.shareBoardData();
    let space = 0;
    space = this.checkPatterns(patterns[0]);
    if (space === -1) {
      space = this.checkPatterns(patterns[1]);
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
    // TODO 2 is hard-coded for the computer player's data
    this.move(space, 2);
    // check winning patterns
    this.checkPatterns(patterns[2]);
  },

  // executes after player gives valid input or computer fn has selected a space
  move: function (pos, x) {
    // checks that the correct player is moving
    // if (x !== model.currTurn) {
    //   return false;
    // }
    // unary plus ('+') converts position to a number
    if (+pos >= 0 && +pos <= 8 && !isNaN(+pos) && model.board[+pos] === 0) {
      model.board.splice(+pos, 1, x);
      model.currTurn = (x === model.X) ? model.O : model.X;
      return true;
    }
    // TODO handle bad data here or in play fn
    return false;
  },

  checkIfBoardFilled: function () {
    let x = model.board.join('').indexOf(0);
    if (x === -1) {
      this.show();
      view.renderGameOver();
      return true;
    }
    return false;
  },

  checkPatterns: function (patternsToCheck) {
    const boardString = model.board.join('');
    for (let i = 0; i < patternsToCheck.length; i++) {
      const array = boardString.match(patternsToCheck[i][0]);
      if (array) {
        if (patternsToCheck === model.patterns[2]) {
          model.gameWon = true;
          this.winGame();
        } else {
          console.log(patternsToCheck[i][1]);
          return patternsToCheck[i][1];
        }
      }
    }
    return -1;
  },

  winGame: function () {
    if (model.gameWon === false) {
      return;
    }
    this.show();
    view.renderGameOver();
    return true;
  },

  exit: function () {
    process.exit();
  },

  play: function () {
    const boundController = this;
    this.show();
    view.renderInstructions();
    process.openStdin().on('data', function (res) {
      // if move is valid, check if gameplay should end
      // TODO 1 is hard-coded for player 1's data
      if (boundController.move(res, 1)) {
        if (boundController.winGame() || boundController.checkIfBoardFilled()) {
          boundController.exit();
        } else {
          // if gameplay should continue, run compute fn to execute computer's move
          boundController.computerPickSpace();
          if (boundController.winGame() || boundController.checkIfBoardFilled()) {
            boundController.exit();
          } else {
            boundController.show();
          }
        }
      } else {
        view.renderInvalidEntry();
      }
    });
  }
};

const view = {
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
  renderGameOver: function () {
    console.log('Game over');
  },
  renderInstructions: function () {
    console.log('Enter [0-8]:');
  },
  renderInvalidEntry: function () {
    console.log('That was not a valid move');
  }
};

controller.init();

// export for Jasmine testing
module.exports = {
  board: model.board,
  renderBoard: view.renderBoard,
  checkIfBoardFilled: controller.checkIfBoardFilled,
  computerPickSpace: controller.computerPickSpace,
  getMove: controller.getMove,
  move: controller.move,
  play: controller.play,
  players: model.players,
  show: controller.show,
  gameWon: model.gameWon
};
