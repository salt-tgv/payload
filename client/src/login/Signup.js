import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from './graphql/mutations'
import redirectIfCookie from './redirect';
import { Link } from 'react-router-dom';

function Signup() {
  const [signUpFunction, { data, loading, error }] = useMutation(SIGN_UP);
  const [credentialsInput, setCredentialsInput] = useState({});
  
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    signUpFunction({ variables: { user: { username: credentialsInput.username, password: credentialsInput.password }}});
  }
  
  useEffect(() => {
    redirectIfCookie(navigate);

    if (data) {
      if (!data.signup.error) {
        document.cookie = `playerId=${data.signup.playerId}`;
        document.cookie = `username=${data.signup.username}`;
        return navigate("../user");
      } 
    }
  }, [data])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" id="username" value={credentialsInput.username} onChange={handleInput}></input>
        <input type="password" placeholder="password" id="password" value={credentialsInput.password} onChange={handleInput}></input>
        <input type="submit" value="Signup" />
        <p>Already have an account? <Link to="../login">Login</Link></p>
      </form>
      { data && data.signup.error && <p>{data.signup.error}</p> }
    </div>
  )
}

export default Signup;