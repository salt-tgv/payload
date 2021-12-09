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
      { !notFound && <div className="game-actions__join-game">
        <i className="fas fa-satellite-dish"></i>
        { !showForm && <p>Join Game</p>}
        { showForm && 
        <form className="join-game__form" onSubmit={handleSubmit}>
          <input className="join-game__input" type="text" placeholder="Game ID" onChange={(e) => setTextInput(e.target.value)} value={textInput}></input>
          <input className="join-game__submit" type="submit" value="JOIN!" />
        </form>}
      </div>}
      { notFound && <div className="join-game__form">
        <p className="join-game__text">Game not found...</p>
        <button className="join-game__submit" onClick={()=>{setNotFound(false)}}>OK</button>
        </div>}
    </div>
  )
}

export default JoinGame;