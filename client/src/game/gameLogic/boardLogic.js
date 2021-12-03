import PlayCell from '../components/PlayCell'
import PlacementCell from '../components/PlacementCell'


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

const generateBoard = (boardState, active, assets, Cell) => {
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

const generatePlacementBoard = (boardState, onClickCb, onEnterCb, onLeaveCb) => {
  return boardState.map((xArr, x) => {
    const newXArr = xArr.map((yCell, y) => <PlacementCell
      key={`${x},${y}`}
      cellData={yCell} 
      x={x} y={y}
      onClickCb={onClickCb}
      onEnterCb={onEnterCb}
      onLeaveCb={onLeaveCb}
    />)
    return <div key={x} className="board__column">{newXArr}</div>
  })
}

const boardGenerator = (num, value) => {
  const boardArr = Array(num).fill(0, 0, num);
  return boardArr.map(elem => {
    return Array(num).fill(0, 0, num).map(arr => ({...value}));
  })
}

const generatePlayBoard = (boardState, active, assets) => generateBoard(boardState, active, assets, PlayCell)

export {
  generatePlayBoard,
  generatePlacementBoard,
  boardGenerator,
}
