const generateBoard = require('../gameLogic/boardLogic');

const createNewGame = (playerId, username, size = 8) => {
  const gameState = {
    gameId: String(Date.now()),
    activePlayer: playerId,
    inactivePlayer: '',
    winner: '',
    player1: {
      ready: false,
      username,
    },
    player2: {
      ready: false,
      username: '',
    },
    board1: {
      playerId: playerId,
      boardState: generateBoard(size, 'UNKNOWN'),
    },
    board2: {
      playerId: '',
      boardState: generateBoard(size, 'UNKNOWN'),
    },
    asset1: {
      playerId: playerId,
      assets: []
    },
    asset2: {
      playerId: '',
      assets: []
    }
  }

  return gameState;
}

const joinNewGame = (playerId, gameState, username) => {
  if (!gameState.board2.playerId) {
    gameState.inactivePlayer = playerId;
    gameState.board2.playerId = playerId;
    gameState.asset2.playerId = playerId;
    gameState.player2.username = username;
  }

  return gameState;
}

module.exports = { createNewGame, joinNewGame };