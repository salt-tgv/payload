import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { VALID_GAME } from './graphql/queries';
import { useQuery } from '@apollo/client';

function JoinGameByLink({}) {
  const params = useParams();
  const navigate = useNavigate();
  const { data } = useQuery(VALID_GAME, { variables: { gameId: String(params.gameid) }  })
  useEffect(() => {
    if (data) {
      if(data.validGame){
        document.cookie = `gameToJoin=${params.gameid}; path=/`;
      }
      navigate('../user');
    }
  }, [data])

  return (<div>Loading game...</div>)
}

export default JoinGameByLink;