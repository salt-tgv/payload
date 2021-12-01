import { useMutation } from '@apollo/client'
import { PLAY_MOVE } from '../graphql/mutations';
import { generateBoard } from '../gameLogic/boardLogic';
import './Board.css';

function OppBoard ({ boardState }) {

  return (
    <div className="board">{generateBoard(boardState, true)}</div>
  )
}

export default OppBoard;