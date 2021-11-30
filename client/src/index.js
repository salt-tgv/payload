 import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, } from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import App from './App';
import reportWebVitals from './reportWebVitals';

const playerId = prompt('enter id');

const wsLink = new WebSocketLink({
  uri: 'ws://192.168.34.236:1337/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      playerId,
    }
  }
})

const httpLink = new HttpLink({
  uri: 'http://192.168.34.236:1337/graphql',
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

ReactDOM.render(
  <ApolloProvider client={client}>
    <App playerId={playerId}/>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
