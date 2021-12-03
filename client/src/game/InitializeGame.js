import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ApolloClient, InMemoryCache, ApolloProvider, } from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import Game from './Game';

function InitializeGame({ playerId }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!playerId)
      navigate('../login');
  }, [])

  const wsLink = new WebSocketLink({
    uri: 'ws://localhost:1337/graphql',
    options: {
      reconnect: true,
      connectionParams: {
        playerId,
      }
    }
  })
  
  const httpLink = new HttpLink({
    uri: 'http://localhost:1337/graphql',
    headers: {
      playerid: playerId,
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
      <Game playerId={playerId}/>
    </ApolloProvider>
  )
}

export default InitializeGame;