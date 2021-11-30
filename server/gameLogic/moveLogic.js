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
      asset.destroyedCells.push(asset.cells[hitIndex])
    }
    if (asset.cells.length === asset.destroyedCells.length) {
      asset.destroyed = true;
    }
  }

  return assets;
}

const updateRevealed = (assets, board) => {
  assets.forEach(asset => {
    if (asset.destroyed) {
      asset.cells.forEach(cell => {
        board[cell[0]][cell[1]] = asset.type;
      })
    }
  })
  return board;
}

module.exports = {
  checkMove,
  updateAsset, 
  updateRevealed,
}
