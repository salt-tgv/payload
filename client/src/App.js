import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_BOARDS, SUBSCRIBE_BOARDS} from './graphql/queries';
import Board from './components/Board';


function App({ playerId }) {
  const { subscribeToMore, loading, error, data } = useQuery(GET_BOARDS);
  

  useEffect(() => {
    subscribeToMore({
      document: SUBSCRIBE_BOARDS,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newData = subscriptionData.data;
        return {gameState: newData.gameUpdate};
      } 
    })
  }, []);
    
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const { gameState } = data;
  const myBoard = (playerId === gameState.board1.playerId) ? gameState.board1 : gameState.board2;
  const oppBoard = (playerId !== gameState.board1.playerId) ? gameState.board1 : gameState.board2;
  console.log(oppBoard);
  return (
    <div className="App">
      <Board boardState={oppBoard.boardState} primary={true} playerId={playerId}/>
      <Board boardState={myBoard.boardState} primary={false}/>
    </div>
  );
}

export default App;
