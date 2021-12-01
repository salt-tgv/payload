const checkMove = (coords, assets) => {
  for (const asset of assets) {
    const hit = asset.cells.find(cell => {
      return JSON.stringify(cell) === JSON.stringify(coords)});
    if (hit) return 'HIT';
  }
  
  return 'MISS';
}

const updateAsset = (coords, assets) => {
  for (const asset of assets) {
    const hitIndex = asset.cells.findIndex(cell => {
      return JSON.stringify(cell) === JSON.stringify(coords);
    })
    if (hitIndex !== -1) {
      asset.destroyedCells.push(asset.cells.splice(hitIndex, 1)[0])
    }
    if (asset.cells.length === 0) {
      asset.destroyed = true;
    }
  }

  return assets;
}

const updateRevealed = (assets, board) => {
  assets.forEach(asset => {
    if (asset.destroyed) {
      asset.destroyedCells.forEach(cell => {
        board[cell[0]][cell[1]] = asset.type;
      })
    }
  })
  return board;
}

const resolveByPlayer = (boardState, assets, coords) => {
  const result = checkMove(coords, assets)
    boardState[coords[0]][coords[1]] = result;
    if (result === 'HIT') {
      assets = updateAsset(coords, assets)
      boardState = updateRevealed(assets, boardState);
    }
  
  return assets;
}

const resolveMove = (gameState, coords, playerId) => {
  if (playerId === gameState.board1.playerId) {
    gameState.asset2.assets = resolveByPlayer(gameState.board2.boardState, gameState.asset2.assets, coords);
    return gameState.asset2;
  } else if (playerId === gameState.board2.playerId) {
    gameState.asset1.assets = resolveByPlayer(gameState.board1.boardState, gameState.asset1.assets, coords);
    return gameState.asset1;
  }
}

const checkWin = (gameState) => {
  const { activePlayer, asset1, asset2 } = gameState;
  const inactiveAssets = (activePlayer === asset1.playerId) ? asset2 : asset1;
  if (inactiveAssets.assets.every(asset => asset.destroyed)) {
    gameState.winner = activePlayer;
  }
}

module.exports = {
  checkMove,
  updateAsset, 
  updateRevealed,
  resolveMove,
  checkWin
}
