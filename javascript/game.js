// patterns to win as O (or block O), position to play
const patterns1 = [
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
];
// patterns to win as X (or block X), position to play
const patterns2 = [
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
];
// these are the possible winning strings for each player
const patterns3 = [
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
];
const board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
const X = 'X';
const O = 'O';
// TODO use the below var or delete it
// const players = [X, O];
let currTurn = X;

// this fn controls computer gameplay, runs after player makes a move and gameplay should continue
// TODO better naming needed for 'x' and 'comp'
const comp = function () {
  let x = getPattern1Move();
  if (x === -1) {
    x = getPattern2Move();
    if (x === -1) {
      x = getMove();
    }
  }
  move(x, O);
};

// executes after player gives valid input or computer fn has selected a space
const move = function (pos, x) {
  // checks that the correct player is moving
  if (x !== currTurn) {
    return false;
  }
  // unary plus ('+') converts position to a number
  if (+pos >= 0 && +pos <= 8 && !isNaN(+pos) && board[+pos] === ' ') {
    board.splice(+pos, 1, x);
    currTurn = (x === X) ? O : X;
    return true;
  }
  // TODO handle bad data here or in play fn
  return false;
};

// TODO "the existing code is so coupled to the console"
const boardDisplay = function () {
  return ' ' + board[0] + ' |' + ' ' + board[1] + ' |' + ' ' + board[2] + '\n===+===+===\n' +
  ' ' + board[3] + ' |' + ' ' + board[4] + ' |' + ' ' + board[5] + '\n===+===+===\n' +
  ' ' + board[6] + ' |' + ' ' + board[7] + ' |' + ' ' + board[8];
};

const show = function () {
  console.log(boardDisplay());
};

const boardFilled = function () {
  let x = getMove();
  if (x === -1) {
    show();
    console.log('Game over');
    return true;
  }
  return false;
};

/* TODO extreme repetition in below three functions - need to separate concerns and combine functions
1. check which player is currently active
2. check that list of moves
3. move
4. check for win
5. check for game over
*/
const winner = function () {
  let boardString = board.join('');
  let theWinner = null;
  for (let i = 0; i < patterns3.length; i++) {
    const array = boardString.match(patterns3[i][0]);
    if (array) {
      theWinner = patterns3[i][1];
    }
  }
  // TODO implement message or similar to congratulate winner
  if (theWinner) {
    show();
    console.log('Game over');
    return true;
  }
  return false;
};

// the below 3 fns are how the computer makes its moves
const getPattern1Move = function () {
  let boardString = board.join('');
  // continues first pattern that matches
  for (let i = 0; i < patterns1.length; i++) {
    const array = boardString.match(patterns1[i][0]);
    if (array) {
      return patterns1[i][1];
    }
  }
  return -1;
};

const getPattern2Move = function () {
  let boardString = board.join('');
  for (let i = 0; i < patterns2.length; i++) {
    let array = boardString.match(patterns2[i][0]);
    if (array) {
      return patterns2[i][1];
    }
  }
  return -1;
};

/* the computer's default/fallback position is the center or, if the center is filled,
the first empty space IF there's no possible win on the next move */
const getMove = function () {
  if (board[4] === ' ') {
    return 4;
  }
  return board.indexOf(' ');
};

const exit = function () {
  process.exit();
};

const play = function () {
  show();
  console.log('Enter [0-8]:');
  process.openStdin().on('data', function (res) {
    // if move is valid, check if gameplay should end
    if (move(res, X)) {
      if (winner() || boardFilled()) {
        exit();
      } else {
        // if gameplay should continue, run compute fn to execute computer's move
        comp();
        if (winner() || boardFilled()) {
          exit();
        } else {
          show();
        }
      }
    } // TODO need an 'else' to handle (move(res, X) === false) - meaning bad data entry
  });
};

play();

// export for Jasmine testing
module.exports = {
  board: board,
  boardFilled: boardFilled,
  show: show
};
