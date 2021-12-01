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

const generatePlayBoard = (boardState, active, assets) => generateBoard(boardState, active, assets, PlayCell)
const generatePlacementBoard = (boardState) => generateBoard(boardState, true, null, PlacementCell)

export {
  generatePlayBoard,
  generatePlacementBoard,
}