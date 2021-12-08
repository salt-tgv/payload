import { useQuery } from '@apollo/client';
import { GET_GAMES } from './graphql/queries';
import ActiveGame from './ActiveGame';

function ActiveGames ({ playerId, setGameId }) {
  const { data, loading, error } = useQuery(GET_GAMES, {variables: {playerId}});

  if (loading) return <h2 className="loading">Loading...</h2>
  if (error) return <h2 className="error">Error</h2>

  const activeGamesArr = data.activeGames.map((game, index) => {
    const opponent = game.board1.playerId === playerId ? game.player2.username : game.player1.username;
    if (index <= 3)
      return <ActiveGame key={index} gameId={game.gameId} playerId={playerId} opponent={opponent} setGameId={setGameId} />
  });

  return (
  <div className="user__active-games">
    {activeGamesArr}
  </div>)
}

export default ActiveGames;