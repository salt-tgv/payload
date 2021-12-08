import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './app.css'
import Login from './auth/Login';
import Signup from './auth/Signup';
import User from './user/User';
import InitializeGame from './game/InitializeGame';
import JoinGameByLink from './user/JoinGameByLink';

function App() {
  const [playerId, setPlayerId] = useState('');
  const [gameId, setGameId] = useState('');

  const httpLink = new HttpLink({
    uri: 'http://localhost:1337/graphql',
  })
  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  })

  return (<>
    <ApolloProvider client={client}>
    <BrowserRouter>
    <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/user" element={<User setPlayerId={setPlayerId} setGameId={setGameId} />}></Route>
        <Route path="/joingame/:gameid" element={<JoinGameByLink/>}></Route>
      <Route path="/" element={<InitializeGame playerId={playerId} gameId={gameId} />}></Route>
    </Routes>
    </BrowserRouter>
  </ApolloProvider>
  </>

  )
}

export default App;