import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import redirectIfCookie from './redirect';
import { LOG_IN } from './graphql/mutations';
import { loginText, payloadText } from '../game/graphics/text';
import './auth.css';

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
    <main className="login-page">
      <div className="login-wrapper">
        {payloadText}
        <section className="login">
          <div className="login__header">{loginText}</div>
          <form onSubmit={handleSubmit} className="login__login-form" autoComplete="off">
            <div className="login-form__inputs"> 
              <div className="login-form__input"> 
                <i className="fas fa-user"></i>
                <input  type="text" placeholder="username" id="username" value={credentialsInput.username} onChange={handleInput}></input>
              </div>
              <div className="login-form__input">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="password" id="password" value={credentialsInput.password} onChange={handleInput}></input>
              </div>
            </div>
            <div className="login-form__button">
              <i className="fas fa-sign-in-alt"></i>
              <input type="submit" value="Log In" />
            </div>
            <p className="login__text">No account? <Link to="../signup">Sign Up</Link></p>
          </form>
          { data && data.login.error && <p className="signup__error">{data.login.error}</p> }
        </section>
        </div>
    </main>
  )
}

export default Login;