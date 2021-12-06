import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client'
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';
import ActiveGames from './ActiveGames';
import { VALIDATE_USER } from './graphql/queries';


function User({ setPlayerId, setGameId }) {
  const cookiePlayerIdGroups = document.cookie.match(/(playerId)=(\d+)/);
  const cookiePlayerId = cookiePlayerIdGroups ? cookiePlayerIdGroups[2] : '';
  const cookieUsernameGroups = document.cookie.match(/(username)=(\w+)/);
  const cookieUsername = cookieUsernameGroups ? cookieUsernameGroups[2] : '';
  const [cookies, setCookies] = useState({ username: cookieUsername, playerId: cookiePlayerId });
  const { data, loading, error } = useQuery(VALIDATE_USER, { variables: { username: cookieUsername, playerId: cookiePlayerId } });
  const navigate = useNavigate();

  const clearCookies = () => {
    document.cookie = 'playerId=; Max-Age=-99999999';
    document.cookie = 'username=; Max-Age=-99999999';
    setCookies({ username: '', playerId: ''});
    navigate('../login');
  }

  useEffect(() => {
    if (data) {
      console.log(data);
      if (!data.validateUser) {
        clearCookies();
        return;
      }

      return;
    }

    const newCookies = {};
    newCookies.playerId = cookiePlayerId;
    newCookies.username = cookieUsername;

    setCookies(newCookies);
    setPlayerId(cookiePlayerId);
  }, [data])
 
  return (
    <>
    { loading && <div><h3>Loading</h3></div>} 
    { error && <h3>Error :(</h3> }
    { data && data.validateUser && <div>
      <h1>Welcome {cookies.username}!</h1>
      <CreateGame playerId={cookies.playerId} setGameId={setGameId} />
      <JoinGame playerId={cookies.playerId} setGameId={setGameId} />
      <button onClick={clearCookies}>Log Out</button>
      <ActiveGames playerId={cookies.playerId} setGameId={setGameId}/>
    </div>
    }
    </>
  )
}

export default User;