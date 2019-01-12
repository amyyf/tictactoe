module.exports = {

  init: function () {
    this.patterns = {
      // 0 indicates an unchosen spot
      // index 0: wins as player 1, blocks as player 2
      'player 1 matches': [
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
        [(/0{2}10.010{2}/), 1],
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
      // index 1: wins as player 2, blocks as player 1
      'player 2 matches': [
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
        [(/...220.../), 5],
        [(/0{2}20.020{2}/), 1],
        [(/0202..0../), 0],
        [(/0..2..020/), 6],
        [(/..0..2020/), 8],
        [(/020..2.. /), 2],
        [(/0{2}22..0../), 0],
        [(/2..0..020/), 6],
        [(/..0.220{3}/), 8],
        [(/20{2}..2..0/), 2],
        [(/020{2}..2../), 0],
        [(/0..2..0{2}2/), 6],
        [(/..2..0{2}20/), 8],
        [(/20{2}..2..0/), 2]
      ],
      // possible winning strings for each player
      'winning patterns': [
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
    };
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
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

  setStartingPlayer: function (player) {
    if (this.currentPlayer === null) {
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

  sharePatterns: function (patternKey) {
    return this.patterns[patternKey];
  },

  sharePlayerSymbols: function () {
    return [this.players[0].symbol, this.players[1].symbol];
  },

  toggleCurrentPlayer: function () {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  },

  updateBoard: function (space, playerData) {
    this.board.splice(space, 1, playerData);
  }
};
