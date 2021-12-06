import { useMutation } from '@apollo/client'
import { PLAY_MOVE } from '../graphql/mutations';
import { generatePlayBoard } from '../gameLogic/boardLogic';
import './Board.css';

function OppBoard ({ boardState, isMyTurn, winner }) {

  return (
    <div className="board">
      <div className="grid">
      { generatePlayBoard(boardState, true)}
      </div>
      <h2>{isMyTurn ? "Your Turn" : "Opponent's Turn"}</h2>
    </div>
  )
}

export default OppBoard;