import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import redirectIfCookie from './redirect';
import { LOG_IN } from './graphql/mutations';

function Login() {
  const [logInFunction, { data, loading, error }] = useMutation(LOG_IN);
  const [textInput, setTextInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    logInFunction({ variables: { user: { username: textInput, password: '123' }}});
  }

  useEffect(() => {
    redirectIfCookie(navigate);
    
    if (data) {
      if (data.login.playerId) {
        document.cookie = `playerId=${data.login.playerId}`;
        document.cookie = `username=${data.login.username}`;
        navigate("../user");
      }
    }
  }, [data])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" value={textInput} onChange={(e) => setTextInput(e.target.value)}></input>
        <input type="submit" value="Login" />
        <p>No account? <Link to="../signup">Signup</Link></p>
      </form>
      { data && data.login.error && <p>{data.login.error}</p> }
    </div>
  )
}

export default Login;