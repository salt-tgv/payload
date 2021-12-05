const generateBoard = require('../gameLogic/boardLogic');

const createNewGame = (playerId, size = 5) => {
  const gameState = {
    gameId: String(Date.now()),
    activePlayer: playerId,
    inactivePlayer: '',
    winner: '',
    player1: {
      ready: false,
    },
    player2: {
      ready: false,
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

const joinNewGame = (playerId, gameState) => {
  if (!gameState.board2.playerId) {
    gameState.inactivePlayer = playerId;
    gameState.board2.playerId = playerId;
    gameState.asset2.playerId = playerId
  }

  return gameState;
}

module.exports = { createNewGame, joinNewGame };