const model = {
  // patterns to win as O (or block O), position to play
  // 0 indicates an unchosen spot
  patterns1: [
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
  patterns2: [
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
  patterns3: [
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
  shareBoardData: function () {
    return this.board;
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
    console.log(view.boardDisplay(boardData, playerSymbols));
  },

  // this fn controls computer gameplay, runs after player makes a move and gameplay should continue
  // TODO better naming needed for 'x' and 'comp'
  comp: function () {
    let x = this.getPattern1Move();
    if (x === -1) {
      x = this.getPattern2Move();
      if (x === -1) {
        x = this.getMove();
      }
    }
    // TODO 2 is hard-coded for the computer player's data
    this.move(x, 2);
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

  boardFilled: function () {
    let x = this.getMove();
    if (x === -1) {
      this.show();
      console.log('Game over');
      return true;
    }
    return false;
  },

  /* TODO extreme repetition in below three functions - need to separate concerns and combine functions
  1. check which player is currently active
  2. check that list of moves
  3. move
  4. check for win
  5. check for game over
  */
  winner: function () {
    let boardString = model.board.join('');
    let theWinner = null;
    for (let i = 0; i < model.patterns3.length; i++) {
      const array = boardString.match(model.patterns3[i][0]);
      if (array) {
        theWinner = model.patterns3[i][1];
      }
    }
    // TODO implement message or similar to congratulate winner
    if (theWinner) {
      this.show();
      console.log('Game over');
      return true;
    }
    return false;
  },

  // the below 3 fns are how the computer makes its moves
  getPattern1Move: function () {
    let boardString = model.board.join('');
    // continues first pattern that matches
    for (let i = 0; i < model.patterns1.length; i++) {
      const array = boardString.match(model.patterns1[i][0]);
      if (array) {
        return model.patterns1[i][1];
      }
    }
    return -1;
  },

  getPattern2Move: function () {
    let boardString = model.board.join('');
    for (let i = 0; i < model.patterns2.length; i++) {
      let array = boardString.match(model.patterns2[i][0]);
      if (array) {
        return model.patterns2[i][1];
      }
    }
    return -1;
  },

  /* the computer's default/fallback position is the center or, if the center is filled,
  the first empty space IF there's no possible win on the next move */
  getMove: function () {
    if (model.board[4] === 0) {
      return 4;
    }
    return model.board.indexOf(0);
  },

  exit: function () {
    process.exit();
  },

  play: function () {
    this.show();
    const boundController = this;
    console.log('Enter [0-8]:');
    process.openStdin().on('data', function (res) {
      // if move is valid, check if gameplay should end
      // TODO 1 is hard-coded for player 1's data
      if (boundController.move(res, 1)) {
        if (boundController.winner() || boundController.boardFilled()) {
          boundController.exit();
        } else {
          // if gameplay should continue, run compute fn to execute computer's move
          boundController.comp();
          if (boundController.winner() || boundController.boardFilled()) {
            boundController.exit();
          } else {
            boundController.show();
          }
        }
        // TODO need an 'else' to handle (move(res, X) === false) - meaning bad data entry
      } else {
        console.log('moveFN not valid');
      }
    });
  }
};

const view = {
  // TODO "the existing code is so coupled to the console"
  boardDisplay: function (boardData, playerSymbols) {
    console.log(boardData);
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
    return ' ' + boardSymbols[0] + ' |' + ' ' + boardSymbols[1] + ' |' + ' ' + boardSymbols[2] + '\n===+===+===\n' +
    ' ' + boardSymbols[3] + ' |' + ' ' + boardSymbols[4] + ' |' + ' ' + boardSymbols[5] + '\n===+===+===\n' +
    ' ' + boardSymbols[6] + ' |' + ' ' + boardSymbols[7] + ' |' + ' ' + boardSymbols[8];
  }
};

controller.init();

// export for Jasmine testing
module.exports = {
  board: model.board,
  boardDisplay: view.boardDisplay,
  boardFilled: controller.boardFilled,
  comp: controller.comp,
  getMove: controller.getMove,
  move: controller.move,
  play: controller.play,
  players: model.players,
  show: controller.show,
  winner: controller.winner
};
