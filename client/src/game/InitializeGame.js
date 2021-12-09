import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ApolloClient, InMemoryCache, ApolloProvider, } from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import Game from './Game';

function InitializeGame({ playerId, gameId }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!playerId || !gameId)
      navigate('../user');
  }, [])

  const wsLink = new WebSocketLink({
    uri: '/graphql',
    options: {
      reconnect: true,
      connectionParams: {
        playerId,
        gameId
      }
    }
  })
  
  const httpLink = new HttpLink({
    uri: '/graphql',
    headers: {
      playerid: playerId,
      gameid: gameId
    }
  })
  
  const splitLink = split(
    ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
    wsLink,
    httpLink  
  );
  
  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
  })

  return (
    <ApolloProvider client={client}>
      <Game playerId={playerId} gameId={gameId} />
    </ApolloProvider>
  )
}

export default InitializeGame;