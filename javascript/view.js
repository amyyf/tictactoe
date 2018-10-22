module.exports = {

  init: function () {
    this.messages = {
      gameOver: 'Game over - no winner this time.',
      gameWon: 'Player num wins!',
      instructions: 'Instructions: \nEnter [1-9] to make your move. \nThe spaces in the board above are currently marked to show which key corresponds with which space. \nPress ENTER to play!',
      invalidEntry: 'That was not a valid entry',
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
  },

  convertBoardArrayToSymbols: function (boardData) {
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
    return (this.player1Symbol, this.player2Symbol);
  },

  handleUserInput: function (inputType) {
    const input = new Promise(function (resolve, reject) {
      process.openStdin().once('data', function (response) {
        let convertedResponse = response.toString('utf8').slice(0, 1);
        if (inputType === 'move') {
          // subtract 1 for zero-indexed array
          convertedResponse = convertedResponse - 1;
        }
        resolve(convertedResponse);
      });
    });
    return input;
  },

  renderBoard: function (boardSymbols) {
    console.clear();
    let newBoard = this.board;
    boardSymbols.forEach(symbol => {
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
