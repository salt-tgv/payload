import './PlayCell.css'

function PlacementCell ({cellData, onClickCb, onEnterCb, onLeaveCb, x, y, activeAssetIndex}) {
  let cellClass = (cellData.asset !== 'NONE') ? "board__cell--miss" : "board__cell--unknown";
  cellClass += cellData.hover ? " board__cell--hover" : "";
  return (<div id={`${x},${y}`} 
    className={cellClass}
    onClick={() => onClickCb(x, y, cellData)}
    onMouseEnter={() => onEnterCb(x, y, cellData)}
    onMouseLeave={() => onLeaveCb(x, y, cellData)}>
    </div>)
}

export default PlacementCell;
