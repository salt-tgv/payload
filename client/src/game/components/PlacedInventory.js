import './PlacementInventory.css';
import { serverGreen, dbGreen } from '../graphics/assets';

function PlacedInventory ({ assets, resetPlacedAsset }) {
  const generateInventoryList = () => assets.map((asset, index) => {
    return <div
      className="placement-inventory__button--active"
      onClick={() => resetPlacedAsset(index)} 
      key={index}>
        <div class="button-asset">
          {asset.type === 'DB' ? dbGreen : serverGreen}
        </div>
        <div class="button-asset-size">
          <p>X {asset.size}</p>
        </div>
      </div>
    })


  return (
    <div className="placed-inventory">
      {generateInventoryList()}
    </div>
  )
}

export default PlacedInventory;