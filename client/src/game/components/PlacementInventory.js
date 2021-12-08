import { useState, useEffect } from 'react';
import './PlacementInventory.css';
import { 
  horizontalButtonClicked, 
  horizontalButtonUnclicked, 
  verticalButtonClicked, 
  verticalButtonUnclicked,
  serverButtonUnclicked,
  serverButtonClicked,
  dbButtonUnclicked,
  dbButtonClicked } from '../graphics/buttons';

function PlacementInventory ({ assets, setAssets, activeAssetIndex, setActiveAssetIndex }) {
  const [placeVertically, setPlaceVertically] = useState(true);
  const [isDatabase, setIsDatabase] = useState(true);
  const inventoryList = assets.map((asset, index) => {
    return <button 
    className={index === activeAssetIndex ? "placement-inventory__button--active" : "placement-inventory__button"}
    onClick={() => setActiveAssetIndex(index)} 
    key={index} 
    >{asset.size}</button>
  })

  useEffect(() => {
    if (!assets.every(asset => asset.vertical === placeVertically)) {
      const newAssets = [...assets];
      newAssets.forEach(asset => asset.vertical = placeVertically);
      setAssets(newAssets);
    }
    if(!assets.every(asset => asset.type === 'DB') && isDatabase) {
      const newAssets = [...assets];
      newAssets.forEach(asset => asset.type = 'DB');
    }
    if(!assets.every(asset => asset.type === 'SERVER') && !isDatabase) {
      const newAssets = [...assets];
      newAssets.forEach(asset => asset.type = 'SERVER');
    }
  }, [placeVertically, isDatabase, assets])
  
  return (
    <div className="inventory-wrapper">
      <div className="placement-inventory">
        {inventoryList}
      </div>
      <div className="placement-interactions">
        {placeVertically && <div className="orientation-buttons">
          <div classname="ghost-button-container">
            <div className="ghost-button"></div>
            <div className="button-wrapper">
              {verticalButtonClicked}
            </div>
          </div>
          <div classname="ghost-button-container">
              <div className="ghost-button" onClick={() => setPlaceVertically(false)}></div>
              <div className="button-wrapper">
                {horizontalButtonUnclicked}
              </div>
          </div>
        </div>}
        {!placeVertically && <div className="orientation-buttons">
        <div classname="ghost-button-container">
            <div className="ghost-button" onClick={()=> setPlaceVertically(true)}></div>
            <div className="button-wrapper">
              {verticalButtonUnclicked}
            </div>
          </div>
          <div classname="ghost-button-container">
            <div className="ghost-button"></div>
            <div className="button-wrapper">
              {horizontalButtonClicked}
            </div>
          </div>
        </div>}
        {isDatabase && <div className="asset-type-buttons">
        <div classname="ghost-button-container">
            <div className="ghost-button"></div>
            <div className="button-wrapper">
              {dbButtonClicked}
            </div>
          </div>
          <div classname="ghost-button-container">
            <div className="ghost-button" onClick={()=>setIsDatabase(false)}></div>
            <div className="button-wrapper">
              {serverButtonUnclicked}
            </div>
          </div>
        </div>}
        {!isDatabase && <div className="asset-type-buttons">
        `<div classname="ghost-button-container">
            <div className="ghost-button" onClick={()=>setIsDatabase(true)}></div>
            <div className="button-wrapper">
              {dbButtonUnclicked}
            </div>
          </div>
          <div classname="ghost-button-container">
            <div className="ghost-button"></div>
            <div className="button-wrapper">
              {serverButtonClicked}
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}

export default PlacementInventory;