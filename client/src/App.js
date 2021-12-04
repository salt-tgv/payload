import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Login from './login/Login'
import InitializeGame from './game/InitializeGame'

function App() {
  const [playerId, setPlayerId] = useState('');

  return (<>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login setPlayerId={setPlayerId} />}></Route>
      {/* <Route path="/user" element={<Login setPlayerId={setPlayerId} />}></Route> */}
      <Route path="/" element={<InitializeGame playerId={playerId} />}></Route>
    </Routes>
    </BrowserRouter>
  </>
  )
}

export default App;