import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function Login({ setPlayerId }) {
  const [textInput, setTextInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlayerId(textInput);
    navigate("../");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)}></input>
        <input type="submit" value="Login" />
      </form>
    </div>
  )
}

export default Login;