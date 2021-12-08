import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { JOIN_GAME } from './graphql/mutations'

function JoinGame({ playerId, setGameId }) {
  const [joinGameFunction, { data }] = useMutation(JOIN_GAME);
  const [showForm, setShowForm] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    joinGameFunction({ variables: { playerId, gameId: textInput }});
  }
  
  useEffect(() => {
    if (data) {
      if (!data.joinGame) {
        setNotFound(true);
        return 0;
      }

      setGameId(textInput);
      navigate('../');
    }
  }, [data])
  
  return (
    <div className="game-actions__join-game" onClick={() => setShowForm(true)}>
      <i class="fas fa-satellite-dish"></i>
      <p>Join Game</p>
      { showForm && 
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Game ID" onChange={(e) => setTextInput(e.target.value)} value={textInput}></input>
        <input type="submit" value="Connect" />
      </form>}
      { notFound && <p>Game not found...</p>}
    </div>
  )
}

export default JoinGame;