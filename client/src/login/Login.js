import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import redirectIfCookie from './redirect';
import { LOG_IN } from './graphql/mutations';
import './login.css';

function Login() {
  const [logInFunction, { data, loading, error }] = useMutation(LOG_IN);
  const [credentialsInput, setCredentialsInput] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    logInFunction({ variables: { user: { username: credentialsInput.username, password: credentialsInput.password }}});
  }

  const handleInput = (e) => {
    const newCredentials = {...credentialsInput};
    if (e.target.id === 'username') {
      newCredentials.username = e.target.value;
    }

    if (e.target.id === 'password') {
      newCredentials.password = e.target.value;
    }

    setCredentialsInput(newCredentials);
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
        <input type="text" placeholder="username" id="username" value={credentialsInput.username} onChange={handleInput}></input>
        <input type="password" placeholder="password" id="password" value={credentialsInput.password} onChange={handleInput}></input>
        <input type="submit" value="Login" />
        <p>No account? <Link to="../signup">Signup</Link></p>
      </form>
      { data && data.login.error && <p>{data.login.error}</p> }
    </div>
  )
}

export default Login;