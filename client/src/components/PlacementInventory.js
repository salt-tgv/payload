import { useState, useEffect } from 'react';
import './PlacementInventory.css';

function PlacementInventory ({ assets, setAssets, activeAssetIndex, setActiveAssetIndex }) {
  const [placeVertically, setPlaceVertically] = useState(true);
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
  }, [placeVertically, assets])
  
  return (
    <div className="inventory-wrapper">
      <div className="placement-inventory">
        {inventoryList}
      </div>
      <div>
        <button onClick={() => setPlaceVertically(!placeVertically)}>{placeVertically ? 'Vertical' : 'Horizontal'}</button>
      </div>
    </div>
  )
}

export default PlacementInventory;