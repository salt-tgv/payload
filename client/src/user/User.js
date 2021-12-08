import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client'
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';
import ActiveGames from './ActiveGames';
import { VALIDATE_USER } from './graphql/queries';
import { JOIN_GAME } from './graphql/mutations';
import { userPageText } from '../game/graphics/text';
import './user.css';


function User({ setPlayerId, setGameId }) {
  const cookiePlayerIdGroups = document.cookie.match(/(playerId)=(\d+)/);
  const cookiePlayerId = cookiePlayerIdGroups ? cookiePlayerIdGroups[2] : '';
  const cookieUsernameGroups = document.cookie.match(/(username)=(\w+)/);
  const cookieUsername = cookieUsernameGroups ? cookieUsernameGroups[2] : '';
  const cookieGameToJoinGroups = document.cookie.match(/(gameToJoin)=(\d+)/);
  const cookieGameToJoin = cookieGameToJoinGroups ? cookieGameToJoinGroups[2] : '';

  const [cookies, setCookies] = useState({ username: cookieUsername, playerId: cookiePlayerId });
  const [joinGameFunction, { data: joinData }] = useMutation(JOIN_GAME);
  const { data, loading, error } = useQuery(VALIDATE_USER, { variables: { username: cookieUsername, playerId: cookiePlayerId } });
  const navigate = useNavigate();

  const clearCookies = () => {
    document.cookie = 'playerId=; Max-Age=-99999999';
    document.cookie = 'username=; Max-Age=-99999999';
    document.cookie = 'gameToJoin=; Max-Age=-99999999';
    setCookies({ username: '', playerId: '' });
    navigate('../login');
  }

  useEffect(() => {
    if (data) {
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

    if (cookieGameToJoin) {
      joinGameFunction({ variables: {playerId: cookiePlayerId, gameId: cookieGameToJoin }});
      document.cookie = 'gameToJoin=; Max-Age=-99999999';
      setGameId(cookieGameToJoin);
      navigate('../');
    }
    
  }, [data])
 
  return (
    <main className="user-wrapper">
      
        { loading && <div className="loading"><h3>Loading</h3></div>} 
        { error && navigate('../login') }
        { data && data.validateUser && 
        <section className="user">
          <div>{userPageText}</div>
          <h1 className="user__header">Welcome {cookies.username}!</h1>
          <div className="user__game-actions"> 
            <CreateGame playerId={cookies.playerId} setGameId={setGameId} />
            <JoinGame playerId={cookies.playerId} setGameId={setGameId} />
          </div>
          <button className="user__logout-button" onClick={clearCookies}>Log Out</button>
          <ActiveGames playerId={cookies.playerId} setGameId={setGameId}/>
        </section>}
      
    </main>
  )
}

export default User;