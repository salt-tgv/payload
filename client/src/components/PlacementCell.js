import './PlayCell.css'

function PlacementCell ({cellData, onClickCb, onEnterCb, onLeaveCb, x, y, activeAssetIndex}) {
  if (cellData.hover) {
    console.log(`I'M HOVERING ${x}, ${y}`)
  }
  const cellClass = cellData.hover ? "board__cell--unknown board__cell--hover" : "board__cell--unknown";
  return (<div id={`${x},${y}`} 
    className={cellClass}
    onClick={() => onClickCb(x, y, cellData)}
    onMouseEnter={() => onEnterCb(x, y, cellData)}
    onMouseLeave={() => onLeaveCb(x, y, cellData)}>
    </div>)
}

export default PlacementCell;
