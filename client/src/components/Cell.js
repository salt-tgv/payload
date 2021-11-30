import './Cell.css';

function Cell ({cellData, x, y}) {
  return (
    <div className="cell" id={`${x},${y}`}>

    </div>
  )
}

export default Cell;