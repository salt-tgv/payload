const generateBoard = require('../gameLogic/boardLogic');

const createNewGame = (playerId, size = 5) => {
  const gameState = {
    gameId: Date.now(),
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

export default createNewGame;