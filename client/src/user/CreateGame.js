import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_GAME } from './graphql/mutations'

function CreateGame({ playerId, setGameId }) {
  const [createGameFunction, { data }] = useMutation(CREATE_GAME);
  
  useEffect(() => {
    if (data)
      if (data.createGame) {
        setGameId(data.createGame);
        console.log(data.createGame);
      } 
  }, [data])

  return(
    <div>
      <button onClick={() => createGameFunction({ variables: { playerId }})}>Create game</button>
    </div>
  )
}

export default CreateGame;