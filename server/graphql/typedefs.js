const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type serverMessages {
    welcome: String!
    goodbye: String!
  }

  type Query {
    serverMessages: serverMessages
    messages: [chatMessage]
  }

  type chatMessage {
    name: String!
    message: String!
  }

  type Mutation {
    sendMessage(name: String!, message: String!): chatMessage
  }

  type Subscription {
    newMessage: chatMessage
  }
`

module.exports = typeDefs;