import React, { useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'

const SUBSCRIBE_MESSAGES = gql`
  subscription {
    newMessage {
      name
      message
    }
  }
`

function App() {
  const { subscribeToMore, loading, error, data } = useQuery(gql`
    query getMessages {
      messages {
        name
        message
      }
    }
  `);

  useEffect(() => {
    subscribeToMore({
      document: SUBSCRIBE_MESSAGES,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newData = subscriptionData.data.newMessage;
        return {messages: [...prev.messages, newData]};
      } 
    })
  }, []);
    
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  return (
    <div className="App">
      <p>Hello</p>
      <ul>
        {data.messages.map(data => <li>{data.message}</li>)}
      </ul>
    </div>
  );
}

export default App;
