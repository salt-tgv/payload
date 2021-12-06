import { generatePlacementBoard, boardGenerator } from '../gameLogic/boardLogic';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import PlacementInventory from './PlacementInventory';
import PlacedInventory from './PlacedInventory';
import { PLAYER_CONFIRM } from '../graphql/mutations';
import '../game.css'
import { placementText } from '../graphics/text';

const assetList = [
  {
    cells: [],
    type: 'SERVER',
    size: 3,
    vertical: true,
  },
  {
    cells: [],
    type: 'DB',
    size: 2,
    vertical: true,
  },
  {
    cells: [],
    type: 'DB',
    size: 1,
    vertical: false,
  },
]

const initialCellValue = {
  hover: false,
  asset: 'NONE',
}

function PlacementBoard ({ gameState, playerId }) {
const [assetsToPlace, setAssetsToPlace] = useState(assetList.map(asset => ({...asset, cells: []})));
const [placedAssets, setPlacedAssets] = useState([]);
const [activeAssetIndex, setActiveAssetIndex] = useState(-1);
const [placementBoardState, setPlacementBoardState] = useState(boardGenerator(5, initialCellValue));
const [playerConfirm] = useMutation(PLAYER_CONFIRM);

// useEffect(() => {
//   setPlacedAssets([])
//   return () => {
//     setPlacedAssets([])
//   }
//   }, []);

const onClickCb = (x, y, cellData) => {
  if(activeAssetIndex !== -1){
    const asset = assetsToPlace[activeAssetIndex];
    const newBoardState = [...placementBoardState];
    const cells = [];
    let isOnBoard = false;
    if(asset.vertical && y >= (asset.size -1)) {
      for (let i = 0; i < asset.size; i++){
        cells.push([x, y-i]);
        isOnBoard = true;
      }
    }
    if(!asset.vertical && x >= (asset.size -1)) {
      for (let i = 0; i < asset.size; i++) {
        cells.push([x-i, y]);
        isOnBoard = true;
      }
    }
    let isValidPlacement = false;
    if (isOnBoard){
      isValidPlacement = cells.every(cell => newBoardState[cell[0]][cell[1]].asset === 'NONE');
    }
    
    if(isValidPlacement) {
      cells.forEach(cell => {
        asset.cells.push(cell);
        newBoardState[cell[0]][cell[1]] = {hover: false, asset: asset.type}
      });
      const newAssetsToPlace = [...assetsToPlace];
      setPlacedAssets([...placedAssets, ...newAssetsToPlace.splice(activeAssetIndex, 1)]);
      setAssetsToPlace(newAssetsToPlace);
      setPlacementBoardState(newBoardState);
      setActiveAssetIndex(-1);
    }
  }
}

const onEnterCb = (x, y) => {
  if(activeAssetIndex !== -1){
    const newBoardState = [...placementBoardState];
    const asset = assetsToPlace[activeAssetIndex];
    const cells = []
    let isOnBoard = false;
    if (asset.vertical && y >= (asset.size - 1)) {
      for (let i = 0; i < asset.size; i++) {
        cells.push([x,y-i]);
        isOnBoard = true;
      }
    }
    if (!asset.vertical && x >= (asset.size - 1)) {
      for (let i = 0; i < asset.size; i++) {
        cells.push([x-i,y]);
        isOnBoard = true;
      }
    }
    let isValidPlacement = false;
    if (isOnBoard) {
      isValidPlacement = cells.every(cell => newBoardState[cell[0]][cell[1]].asset === 'NONE');
    }

    if (isValidPlacement) {
      cells.forEach(cell => newBoardState[cell[0]][cell[1]].hover = true);
    }

    setPlacementBoardState(newBoardState);
  }
}
const onLeaveCb = (x, y) => {
  if(activeAssetIndex !== -1){
    const newBoardState = [...placementBoardState];
    const asset = assetsToPlace[activeAssetIndex];
    if (asset.vertical && y >= asset.size - 1) {
      for (let i = 0; i < asset.size; i++) {
        newBoardState[x][y-i].hover = false;
      }
    }
    if (!asset.vertical && x >= (asset.size - 1)) {
      for (let i = 0; i < asset.size; i++) {
        newBoardState[x-i][y].hover = false;
      }
    }
    setPlacementBoardState(newBoardState);
  }
}

const resetPlacedAsset = (index) => {
  const newPlacedAssets = [...placedAssets];
  const newBoardState = [...placementBoardState];
  newPlacedAssets[index].cells.forEach(cell => {
    newBoardState[cell[0]][cell[1]].asset = "NONE";
  })
  newPlacedAssets[index].cells = [];
  const resetAsset = newPlacedAssets.splice(index, 1);
  setPlacedAssets(newPlacedAssets);
  setAssetsToPlace([...assetsToPlace, ...resetAsset]);
}

const player = gameState.board1.playerId === playerId ? 'player1' : 'player2'

return (
  <div className="board-wrapper">
    <div className="board-contents">
      {placementText}
      <div className="board">
        <PlacementInventory assets={assetsToPlace} setAssets={setAssetsToPlace} activeAssetIndex={activeAssetIndex} setActiveAssetIndex={setActiveAssetIndex}/>
        {generatePlacementBoard(placementBoardState, onClickCb, onEnterCb, onLeaveCb)}
        <PlacedInventory assets={placedAssets} resetPlacedAsset={resetPlacedAsset} />
        {(assetsToPlace.length === 0 && !gameState[player].ready) &&<button className="board__confirm" onClick={()=> {
          playerConfirm({ variables: { assetsToPlace: placedAssets.map(asset => ({cells: asset.cells, type: asset.type})) }});
          console.log(placedAssets);
        }}>CONFIRM!</button>}
        {(assetsToPlace.length === 0 && gameState[player].ready) && <h2>Waiting for your slow opponent...</h2>}
      </div>
    </div>
  </div>)
}

export default PlacementBoard;