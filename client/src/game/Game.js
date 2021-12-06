import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_BOARDS, SUBSCRIBE_BOARDS} from './graphql/queries';
import OppBoard from './components/OppBoard';
import MyBoard from './components/MyBoard';
import PlacementBoard from './components/PlacementBoard';
import { useNavigate } from 'react-router';
import './game.css';

function Game({ playerId, gameId }) {
  const { subscribeToMore, loading, error, data } = useQuery(GET_BOARDS);
  const [gameOver, setGameOver] = useState('');
  const navigate = useNavigate();

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
  if (winner && !gameOver) {
    let gameEndMsg = winner === playerId ? 'You have won!' : 'Sorry bro...';
    setGameOver(gameEndMsg);
  }
  const myBoard = (playerId === gameState.board1.playerId) ? gameState.board1 : gameState.board2;
  const oppBoard = (playerId !== gameState.board1.playerId) ? gameState.board1 : gameState.board2;

  const isMyTurn = (playerId === gameState.activePlayer)

  const areBothReady = (gameState.player1.ready && gameState.player2.ready);
  const allJoined = (gameState.board2.playerId);

  const playBoards = <div className="board-wrapper">
    <OppBoard boardState={oppBoard.boardState} isMyTurn={isMyTurn} winner={gameState.winner}/>
    <MyBoard boardState={myBoard.boardState}/>
  </div>;


  return (
    <div className="App">
      { gameOver && 
        <>
        <h1>{gameOver}</h1> 
        <button onClick={() => navigate('../user')}>Exit</button>
        </>}
      { !allJoined && <h1>{gameId}</h1>}
      {areBothReady ? playBoards : allJoined && <PlacementBoard gameState={gameState} playerId={playerId}/>}
    </div>
  );
}

export default Game;
