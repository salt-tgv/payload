const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type serverMessages {
    welcome: String!
    goodbye: String!
  }

  type Query {
    serverMessages: serverMessages
    messages: [chatMessage]
    gameState: gameState
  }

  type chatMessage {
    name: String!
    message: String!
  }

  type Mutation {
    sendMessage(name: String!, message: String!): chatMessage
    playMove: Boolean
  }

  type Subscription {
    newMessage: chatMessage
    gameUpdate: gameState!
  }

  type Board {
    playerId: String!
    boardState: [[Boolean]]!
  }

  type gameState {
    board1: Board!
    board2: Board!
  }
`

module.exports = typeDefs;