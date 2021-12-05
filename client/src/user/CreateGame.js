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
        console.log(data.createGame)
        setGameId(data.createGame);
        navigate('../');
      } 
  }, [data])

  return(
    <div>
      <button onClick={() => createGameFunction({ variables: { playerId }})}>Create game</button>
    </div>
  )
}

export default CreateGame;