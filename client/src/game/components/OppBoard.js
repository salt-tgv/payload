import { generatePlayBoard } from '../gameLogic/boardLogic';
import './Board.css';
import { enemyNetworkText } from '../graphics/text';

function OppBoard ({ boardState, isMyTurn, winner }) {
  const active = winner ? false : true;

  return (
    <div className="opp-board-wrapper">
      <div className="board-text">
        {enemyNetworkText}
      </div>
      <div className="board">
        <div className="grid">
        { generatePlayBoard(boardState, active)}  
        </div>
      </div>
      <h2 className="turn-text">{isMyTurn ? "Your Turn" : "Opponent's Turn"}</h2>
    </div>
  )
}

export default OppBoard;