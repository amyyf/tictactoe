# TicTacToe

This project resulted from a coding challenge to improve upon a pretty janky command-line game. I fixed several known issues and implemented requested features, described below. Although I successfully passed the challenge, I have a few additional goals for making the game even better!

#### Fixed issues:
- [x] Gracefully handled bad user input
- [x] Increased difficulty level to 'hard'
- [x] Improved user experience of gameplay with smoother transitions between moves, delay before computer moves, clearer user messages

#### New features added:
- [x] User can choose type of player (human or computer)
- [x] User can choose which player goes first
- [x] User can choose which symbol each player uses

#### To-do list:
- [ ] Refactor game brain focusing on efficiency
  - [ ] Add different difficulty levels: easy, medium, hard
  - [ ] Allow user to select desired difficulty level
- [ ] Create webpage to allow game to be played in a GUI


## To play the game

Fork or clone the repository to your machine.

This game runs in Node and was developed with version `10.9.0`. If not installed, Node can be downloaded directly [from its website](https://nodejs.org/en/).

After downloading, run `node game.js` in the terminal and follow the directions!

## Code testing

Tic Tac Toe uses [Jasmine](https://jasmine.github.io/index.html) as a testing framework. To run or edit the tests, first install dependencies with `npm install`, then run the tests with `npm test`.
