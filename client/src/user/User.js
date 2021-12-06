import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';


function User({ setPlayerId, setGameId }) {
  const [cookies, setCookies] = useState({ username: '', playerId: '' });
  const navigate = useNavigate();

  const clearCookies = () => {
    document.cookie = 'playerId=; Max-Age=-99999999';
    document.cookie = 'username=; Max-Age=-99999999';
    setCookies({ username: '', playerId: ''});
    navigate('../login');
  }

  useEffect(() => {
    const cookiePlayerId = document.cookie.match(/(playerId)=(\d+)/) || '';
    const cookieUsername = document.cookie.match(/(username)=(\w+)/) || '';
    if (!cookiePlayerId[1] || !cookiePlayerId[2]) {
      /** Check against database/query if sessionID matches with username in usersArr */
      clearCookies();
      return navigate('../login');
    }

    const newCookies = {};
    newCookies[cookiePlayerId[1]] = cookiePlayerId[2];
    newCookies[cookieUsername[1]] = cookieUsername[2];

    setCookies(newCookies);
    setPlayerId(cookiePlayerId[2]);
  }, [])

  

  
 
  return (
    <div>
      <h1>Welcome {cookies.username}!</h1>
      <CreateGame playerId={cookies.playerId} setGameId={setGameId} />
      <JoinGame playerId={cookies.playerId} setGameId={setGameId} />
      <button onClick={clearCookies}>Log Out</button>
    </div>
  )
}

export default User;