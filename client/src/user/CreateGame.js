import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_GAME } from './graphql/mutations'
import { useNavigate } from 'react-router';

function CreateGame({ playerId, setGameId }) {
  const [createGameFunction, { data }] = useMutation(CREATE_GAME);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (data)
      if (data.createGame) {
        setGameId(data.createGame);
        navigate('../');
      } 
  }, [data])

  return(
    <div className="game-actions__create-game" onClick={() => createGameFunction({ variables: { playerId }})}>
      <i className="fas fa-power-off"></i>
      <p>Create game</p>
    </div>
  )
}

export default CreateGame;