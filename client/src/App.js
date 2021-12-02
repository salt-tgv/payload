import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_BOARDS, SUBSCRIBE_BOARDS} from './graphql/queries';
import OppBoard from './components/OppBoard';
import MyBoard from './components/MyBoard';
import PlacementBoard from './components/PlacementBoard';


function App({ playerId }) {
  const { subscribeToMore, loading, error, data } = useQuery(GET_BOARDS);
  
  useEffect(() => {
    subscribeToMore({
      document: SUBSCRIBE_BOARDS,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newData = subscriptionData.data;
        return { gameState: newData.gameUpdate};
      } 
    })
  }, []);
    
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  const { gameState } = data;
  const { winner } = gameState;
  if (winner) {
    let gameEndMsg = winner === playerId ? 'You have won!' : 'Sorry bro...';
    alert(gameEndMsg);
  }
  const myBoard = (playerId === gameState.board1.playerId) ? gameState.board1 : gameState.board2;
  const oppBoard = (playerId !== gameState.board1.playerId) ? gameState.board1 : gameState.board2;

  const areBothReady = (gameState.player1.ready && gameState.player2.ready);

  const playBoards = <>
    <OppBoard boardState={oppBoard.boardState}/>
    <MyBoard boardState={myBoard.boardState}/>
  </>;


  return (
    <div className="App">
      {areBothReady ? playBoards : <PlacementBoard gameState={gameState} playerId={playerId}/>}
    </div>
  );
}

export default App;
