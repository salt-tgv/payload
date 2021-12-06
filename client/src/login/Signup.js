import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from './graphql/mutations'
import redirectIfCookie from './redirect';
import { Link } from 'react-router-dom';

function Signup() {
  const [signUpFunction, { data, loading, error }] = useMutation(SIGN_UP);
  const [textInput, setTextInput] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signUpFunction({ variables: { user: { username: textInput, password: '123' }}});
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
        <input type="text" placeholder="username" value={textInput} onChange={(e) => setTextInput(e.target.value)}></input>
        <input type="submit" value="Signup" />
        <p>Already have an account? <Link to="../login">Login</Link></p>
      </form>
      { data && data.signup.error && <p>{data.signup.error}</p> }
    </div>
  )
}

export default Signup;