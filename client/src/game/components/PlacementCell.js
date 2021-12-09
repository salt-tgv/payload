import './PlayCell.css'
import { cellGradientGreen, cellSolidGreen } from '../graphics/cells';
import { serverGreen, dbGreen } from '../graphics/assets'

function PlacementCell ({cellData, onClickCb, onEnterCb, onLeaveCb, x, y, activeAssetIndex}) {
  // let cellClass = (cellData.asset !== 'NONE') ? "board__cell--miss" : "board__cell--unknown";
  // cellClass += cellData.hover ? " board__cell--hover" : "";
  let hasAsset = cellData.asset!== 'NONE';
  let isHovered = cellData.hover;
  return (<div id={`${x},${y}`} 
  className="placement-cell"
    // className={cellClass}
    onClick={() => onClickCb(x, y, cellData)}
    onMouseEnter={() => onEnterCb(x, y, cellData)}
    onMouseLeave={() => onLeaveCb(x, y, cellData)}>
    {hasAsset && cellSolidGreen}
    {(!hasAsset && isHovered) && cellSolidGreen}
    {(!hasAsset && !isHovered) && cellGradientGreen}
    {cellData.asset === 'SERVER' && <div className="asset-container-placement">{serverGreen}</div>}
    {cellData.asset === 'DB' && <div className="asset-container-placement">{dbGreen}</div>}
    </div>)
}

export default PlacementCell;
