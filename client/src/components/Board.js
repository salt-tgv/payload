import { useMutation } from '@apollo/client'
import { PLAY_MOVE } from '../graphql/mutations';
import './Board.css';

function Board ({ boardState, primary, playerId }) {
  const [playMove] = useMutation(PLAY_MOVE);
  const on = boardState ? "on" : "off";

  const handleClick = primary ? () => {playMove()} : null;
  
  return (
    <div className={on} onClick={handleClick}></div>
  )
}

export default Board;