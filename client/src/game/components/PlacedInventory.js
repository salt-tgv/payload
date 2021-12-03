import './PlacementInventory.css';

function PlacedInventory ({ assets, resetPlacedAsset }) {
  const inventoryList = assets.map((asset, index) => {
    return <button 
    className="placement-inventory__button"
    onClick={() => resetPlacedAsset(index)} 
    key={index} 
    >{asset.size}</button>
  })


  return (
    <div className="placement-inventory">
      {inventoryList}
    </div>
  )
}

export default PlacedInventory;