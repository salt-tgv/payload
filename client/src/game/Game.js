import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_BOARDS, SUBSCRIBE_BOARDS} from './graphql/queries';
import OppBoard from './components/OppBoard';
import MyBoard from './components/MyBoard';
import PlacementBoard from './components/PlacementBoard';
import Connecting from './components/Connecting';
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
    
  if (loading) return <div className="user-page"><div className="user-wrapper"><div className="loading"><h3>Loading...</h3></div></div></div>;
  if (error) return (<> { window.location.href="/user"} </>);
  
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
      <div className="placement-page">
        { gameOver && 
            <div className="game-over">
            <h1 className="game-over__message">{gameOver}</h1> 
            <button className="game-over__exit" onClick={() => navigate('../user')}>Exit</button>
          </div>}
        { !allJoined && <Connecting gameId={gameId} />}
        {areBothReady ? playBoards : allJoined && <PlacementBoard gameState={gameState} playerId={playerId}/>}
      </div>
    </div>
  );
}

export default Game;
