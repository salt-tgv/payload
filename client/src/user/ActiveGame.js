import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { JOIN_GAME } from './graphql/mutations'
import { useNavigate } from 'react-router';
import './user.css';

function ActiveGame({ gameId, setGameId, playerId, opponent }) {
  const [joinGameFunction, { data }] = useMutation(JOIN_GAME);
  const navigate = useNavigate();
  
  const handleClick = () => {
    joinGameFunction({ variables: { playerId, gameId }});
  }

  useEffect(() => {
    if (data) {
      if (!data.joinGame) {
        return 0;
      }

      setGameId(gameId);
      navigate('../');
    }
  }, [data])

  return (
    <div className="active-games__game" onClick={handleClick}>
      <div className="game__text">
        <h3>VS. {opponent}</h3>
        <p>Game id: {gameId}</p>
      </div>
      <i className="fas fa-sign-in-alt"></i>
    </div>
  )
}

export default ActiveGame;