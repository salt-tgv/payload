import './PlacementInventory.css';

function PlacementInventory ({ assets, activeAssetIndex, setActiveAssetIndex }) {
  const inventoryList = assets.map((asset, index) => {
    return <button 
    className={index === activeAssetIndex ? "placement-inventory__button--active" : "placement-inventory__button"}
    onClick={() => setActiveAssetIndex(index)} 
    key={index} 
    >{asset.size}</button>
  })


  return (
    <div className="placement-inventory">
      {inventoryList}
    </div>
  )
}

export default PlacementInventory;