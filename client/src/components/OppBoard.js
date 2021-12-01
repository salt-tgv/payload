import { useMutation } from '@apollo/client'
import { PLAY_MOVE } from '../graphql/mutations';
import { generatePlayBoard } from '../gameLogic/boardLogic';
import './Board.css';

function OppBoard ({ boardState }) {

  return (
    <div className="board">{generatePlayBoard(boardState, true)}</div>
  )
}

export default OppBoard;