import { useMutation } from '@apollo/client'
import { PLAY_MOVE } from '../graphql/mutations';
import Cell from './Cell';
import './Board.css';

const generateBoard = (boardState) => {
  return boardState.map((xArr, x) => {
    const newXArr = xArr.map((yArr, y) => <Cell key={`${x},${y}`} cellData={yArr[y]} x={x} y={y}/>)
    return <div key={x} className="board__column">{newXArr}</div>
  })
}

function Board ({ boardState, primary, playerId }) {
  
  return (
    <div className="board">{generateBoard(boardState)}</div>
  )
}

export default Board;