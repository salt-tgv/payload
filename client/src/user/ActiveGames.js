import { useQuery } from '@apollo/client';
import { GET_GAMES } from './graphql/queries';
import ActiveGame from './ActiveGame';

function ActiveGames ({ playerId, setGameId }) {
  const { data, loading, error } = useQuery(GET_GAMES, {variables: {playerId}});

  if (loading) return <h2>Loading...</h2>
  if (error) return <h2>Error</h2>

  const activeGamesArr = data.activeGames.map((game, index) => {
    return <ActiveGame key={index} gameId={game.gameId} playerId={playerId} setGameId={setGameId} />
  });

  return (
  <div>
    {activeGamesArr}
  </div>)
}

export default ActiveGames;