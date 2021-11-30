import { useMutation } from '@apollo/client'
import { PLAY_MOVE } from '../graphql/mutations';
import Cell from './Cell';
import './Board.css';

const generateBoard = (boardState, active) => {
  return boardState.map((xArr, x) => {
    const newXArr = xArr.map((yCell, y) => <Cell 
      key={`${x},${y}`} 
      cellData={yCell} 
      x={x} y={y}
      active={active}
    />)
    return <div key={x} className="board__column">{newXArr}</div>
  })
}

function Board ({ boardState, primary, playerId }) {

  return (
    <div className="board">{generateBoard(boardState, primary)}</div>
  )
}

export default Board;