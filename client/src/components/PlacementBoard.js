import { generatePlacementBoard } from '../gameLogic/boardLogic';
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

function PlacementBoard ({ board, gameState, playerId }) {
const [assetsToPlace, setAssetsToPlace] = useState(assetList);
const [placedAssets, setPlacedAssets] = useState([]);
const [activeAsset, setActiveAsset] = useState(-1);

return (
  <div className="board">
    <PlacementInventory assets={assetsToPlace} activeAsset={activeAsset} setActiveAsset={setActiveAsset}/>
    {generatePlacementBoard(board.boardState, true)}
  </div>)
}

export default PlacementBoard;