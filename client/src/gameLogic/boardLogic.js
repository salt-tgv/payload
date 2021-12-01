import Cell from '../components/Cell'


const getAssetType = (assets, x, y) => {
  for (const asset of assets) {
    for (const cell of asset.cells) {
      if (cell[0] === x && cell[1] === y) {
        return asset.type; 
      }
    }
    for (const cell of asset.destroyedCells) {
      if (cell[0] === x && cell[1] === y) {
        return `DESTROYED_${asset.type}`;
      }
    }
  }
  return null;
}

const generateBoard = (boardState, active, assets) => {
  return boardState.map((xArr, x) => {
    const newXArr = xArr.map((yCell, y) => <Cell 
      key={`${x},${y}`} 
      cellData={yCell} 
      x={x} y={y}
      active={active}
      assetType={assets ? getAssetType(assets, x, y) : null}
    />)
    return <div key={x} className="board__column">{newXArr}</div>
  })
}

export {
  generateBoard,
}