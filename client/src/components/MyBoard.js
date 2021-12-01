import { useMutation, useQuery } from '@apollo/client'
import { useEffect } from 'react';
import { GET_ASSETS, SUBSCRIBE_ASSETS } from '../graphql/queries';
import { generateBoard } from '../gameLogic/boardLogic';
import './Board.css';

function MyBoard ({ boardState }) {
  const { subscribeToMore, loading, error, data } = useQuery(GET_ASSETS);
  
  useEffect(() => {
    subscribeToMore({
      document: SUBSCRIBE_ASSETS,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newData = subscriptionData.data;
        return { assets: newData.assetUpdate };
      } 
    })
  }, []);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
    
  const { assets } = data.assets;

  return (
    <div className="board">{generateBoard(boardState, false, assets)}</div>
  )
}

export default MyBoard;