import './PlacementInventory.css';

function PlacementInventory ({ assets, activeAsset, setActiveAsset }) {
  const inventoryList = assets.map((asset, index) => {
    return <button 
    className={index === activeAsset ? "placement-inventory__button--active" : "placement-inventory__button"}
    onClick={() => setActiveAsset(index)} 
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