import { generatePlacementBoard, boardGenerator } from '../gameLogic/boardLogic';
import { useState } from 'react';
import PlacementInventory from './PlacementInventory';

const assetList = [
  {
    cells: [],
    type: 'DB',
    size: 1,
  },
  {
    cells: [],
    type: 'DB',
    size: 1,
  },
  {
    cells: [],
    type: 'DB',
    size: 1,
  },
  {
    cells: [],
    type: 'DB',
    size: 1,
  },
  {
    cells: [],
    type: 'DB',
    size: 1,
  },
]

const initialCellValue = {
  hover: false,
  asset: 'NONE'
}

function PlacementBoard ({ gameState, playerId }) {
const [assetsToPlace, setAssetsToPlace] = useState(assetList);
const [placedAssets, setPlacedAssets] = useState([]);
const [activeAssetIndex, setActiveAssetIndex] = useState(-1);
const [placementBoardState, setPlacementBoardState] = useState(boardGenerator(5, initialCellValue));

const onClickCb = (x, y, cellData) => {}
const onEnterCb = (x, y) => {
  if(activeAssetIndex !== -1){
    const newBoardState = [...placementBoardState];
    newBoardState[x][y].hover = true;
    setPlacementBoardState(newBoardState);
  }
}
const onLeaveCb = (x, y) => {
  if(activeAssetIndex !== -1){
    const newBoardState = [...placementBoardState];
    newBoardState[x][y].hover = false;
    setPlacementBoardState(newBoardState);
  }
}

return (
  <div className="board">
    <PlacementInventory assets={assetsToPlace} activeAssetIndex={activeAssetIndex} setActiveAssetIndex={setActiveAssetIndex}/>
    {generatePlacementBoard(placementBoardState, onClickCb, onEnterCb, onLeaveCb)}
  </div>)
}

export default PlacementBoard;