import { useState, useEffect } from 'react';
import './PlacementInventory.css';

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
      <div>
        <button onClick={() => setPlaceVertically(!placeVertically)}>{placeVertically ? 'Vertical' : 'Horizontal'}</button>
        <button onClick={() => setIsDatabase(!isDatabase)}>{isDatabase ? 'Database' : 'Server'}</button>
      </div>
    </div>
  )
}

export default PlacementInventory;