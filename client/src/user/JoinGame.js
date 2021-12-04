import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { JOIN_GAME } from './graphql/mutations'


function JoinGame({ playerId, setGameId }) {
  const [joinGameFunction, { data }] = useMutation(JOIN_GAME);
  const [showForm, setShowForm] = useState(false);
  const [textInput, setTextInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    joinGameFunction({ variables: { playerId, gameId: textInput }});
  }
  
  useEffect(() => {
    if (data) {
      console.log(data);
      setGameId(textInput);
    }
  }, data)
  
  return (
    <div>
      <button onClick={() => setShowForm(true)}>Join Game</button>
      { showForm && 
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Game ID" onChange={(e) => setTextInput(e.target.value)} value={textInput}></input>
        <input type="submit" value="Connect" />
      </form>}
    </div>
  )
}

export default JoinGame;