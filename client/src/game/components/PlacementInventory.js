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
import { serverGreen, dbGreen } from '../graphics/assets';

function PlacementInventory ({ assets, setAssets, activeAssetIndex, setActiveAssetIndex }) {
  const generateInventoryList = () => assets.map((asset, index) => {
    return <div
      className={index === activeAssetIndex ? "placement-inventory__button--active" : "placement-inventory__button"}
      onClick={() => setActiveAssetIndex(index)} 
      key={index}>
        <div class="button-asset">
          {asset.type === 'DB' ? dbGreen : serverGreen}
        </div>
        <div class="button-asset-size">
          <p>X {asset.size}</p>
        </div>
      </div>
    })

  const [placeVertically, setPlaceVertically] = useState(true);
  const [isDatabase, setIsDatabase] = useState(true);

  useEffect(() => {
    if (!assets.every(asset => asset.vertical === placeVertically)) {
      const newAssets = [...assets];
      newAssets.forEach(asset => asset.vertical = placeVertically);
      setAssets(newAssets);
    }
    if(!assets.every(asset => asset.type === 'DB') && isDatabase) {
      const newAssets = [...assets];
      newAssets.forEach(asset => asset.type = 'DB');
      setAssets(newAssets);
    }
    if(!assets.every(asset => asset.type === 'SERVER') && !isDatabase) {
      const newAssets = [...assets];
      newAssets.forEach(asset => asset.type = 'SERVER');
      setAssets(newAssets);
    }
  }, [placeVertically, isDatabase, assets])
  
  return (
    <div className="inventory-wrapper">
      <div className="placement-inventory">
        {generateInventoryList()}
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