const model = {
  // patterns to win as O (or block O), position to play
  patterns1: [
    [(/ OO....../), 0],
    [(/O..O.. ../), 6],
    [(/......OO /), 8],
    [(/.. ..O..O/), 2],
    [(/ ..O..O../), 0],
    [(/...... OO/), 6],
    [(/..O..O.. /), 8],
    [(/OO ....../), 2],
    [(/ ...O...O/), 0],
    [(/..O.O. ../), 6],
    [(/O...O... /), 8],
    [(/.. .O.O../), 2],
    [(/O O....../), 1],
    [(/O.. ..O../), 3],
    [(/......O O/), 7],
    [(/..O.. ..O/), 5],
    [(/. ..O..O./), 1],
    [(/... OO.../), 3],
    [(/.O..O.. ./), 7],
    [(/...OO .../), 5]
  ],
  // patterns to win as X (or block X), position to play
  patterns2: [
    [(/ {2}X . X {2}/), 1],
    [(/ XX....../), 0],
    [(/X..X.. ../), 6],
    [(/......XX /), 8],
    [(/.. ..X..X/), 2],
    [(/ ..X..X../), 0],
    [(/...... XX/), 6],
    [(/..X..X.. /), 8],
    [(/XX ....../), 2],
    [(/ ...X...X/), 0],
    [(/..X.X. ../), 6],
    [(/X...X... /), 8],
    [(/.. .X.X../), 2],
    [(/X X....../), 1],
    [(/X.. ..X../), 3],
    [(/......X X/), 7],
    [(/..X.. ..X/), 5],
    [(/. ..X..X./), 1],
    [(/... XX.../), 3],
    [(/.X..X.. ./), 7],
    [(/...XX .../), 5],
    [(/ X X.. ../), 0],
    [(/ ..X.. X /), 6],
    [(/.. ..X X /), 8],
    [(/ X ..X.. /), 2],
    [(/ {2}XX.. ../), 0],
    [(/X.. .. X /), 6],
    [(/.. .XX {3}/), 8],
    [(/X {2}..X.. /), 2],
    [(/ X {2}..X../), 0],
    [(/ ..X.. {2}X/), 6],
    [(/..X.. {2}X /), 8],
    [(/X {2}..X.. /), 2]
  ],
  // these are the possible winning strings for each player
  patterns3: [
    [(/OOO....../), 'O'],
    [(/...OOO.../), 'O'],
    [(/......OOO/), 'O'],
    [(/O..O..O../), 'O'],
    [(/.O..O..O./), 'O'],
    [(/..O..O..O/), 'O'],
    [(/O...O...O/), 'O'],
    [(/..O.O.O../), 'O'],
    [(/XXX....../), 'X'],
    [(/...XXX.../), 'X'],
    [(/......XXX/), 'X'],
    [(/X..X..X../), 'X'],
    [(/.X..X..X./), 'X'],
    [(/..X..X..X/), 'X'],
    [(/X...X...X/), 'X'],
    [(/..X.X.X../), 'X']
  ],
  board: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  X: 'X',
  O: 'O',
  // TODO use the below var or delete it
  players: [this.X, this.O],
  currTurn: this.X
};

const controller = {
  init: function () {
    this.play();
  },

  show: function () {
    console.log(view.boardDisplay());
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
    this.move(x, model.O);
  },

  // executes after player gives valid input or computer fn has selected a space
  move: function (pos, x) {
    // checks that the correct player is moving
    // if (x !== model.currTurn) {
    //   return false;
    // }
    // unary plus ('+') converts position to a number
    if (+pos >= 0 && +pos <= 8 && !isNaN(+pos) && model.board[+pos] === ' ') {
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
    if (model.board[4] === ' ') {
      return 4;
    }
    return model.board.indexOf(' ');
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
      if (boundController.move(res, model.X)) {
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
      } // TODO need an 'else' to handle (move(res, X) === false) - meaning bad data entry
    });
  }
};

const view = {
  // TODO "the existing code is so coupled to the console"
  boardDisplay: function () {
    return ' ' + model.board[0] + ' |' + ' ' + model.board[1] + ' |' + ' ' + model.board[2] + '\n===+===+===\n' +
    ' ' + model.board[3] + ' |' + ' ' + model.board[4] + ' |' + ' ' + model.board[5] + '\n===+===+===\n' +
    ' ' + model.board[6] + ' |' + ' ' + model.board[7] + ' |' + ' ' + model.board[8];
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
