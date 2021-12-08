import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from './graphql/mutations'
import redirectIfCookie from './redirect';
import { Link } from 'react-router-dom';
import { signupText, payloadText } from '../game/graphics/text';
import './auth.css';

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
    <main className="signup-page">
      <div className="signup-wrapper">
        {payloadText}
        <section className="signup">
          <div className="signup__header">{signupText}</div>
          <form onSubmit={handleSubmit} className="signup__signup-form">
            <div className="signup-form__inputs">
              <div className="signup-form__input">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="username" id="username" value={credentialsInput.username} onChange={handleInput}></input>
              </div>
              <div className="signup-form__input">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="password" id="password" value={credentialsInput.password} onChange={handleInput}></input>
              </div>
            </div>
            <div className="signup-form__button">
              <i className="fas fa-sign-in-alt"></i>
              <input type="submit" value="Sign Up" />
            </div>
            <p className="signup__text">Already have an account? <Link to="../login">Log In</Link></p>
          </form>
          { data && data.signup.error && <p className="login__error">{data.signup.error}</p> }
        </section>
        </div>
    </main>
  )
}

export default Signup;
