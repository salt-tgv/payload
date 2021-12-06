import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { JOIN_GAME } from './graphql/mutations'
import { useNavigate } from 'react-router';

function ActiveGame({ gameId, setGameId, playerId }) {
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
    <div onClick={handleClick}>
      <h3>{gameId} Continue playing</h3>
    </div>
  )
}

export default ActiveGame;