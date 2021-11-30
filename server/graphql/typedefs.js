const { gql } = require('apollo-server-express');

const typeDefs = gql`

  enum cellState {
    UNKNOWN
    HIT
    MISS
    DB
    SERVER
  }

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
    playMove(coords: [Int]!): Boolean
  }

  type Subscription {
    newMessage: chatMessage
    gameUpdate: gameState!
    assetUpdate: assets!
  }

  type Board {
    playerId: String!
    boardState: [[cellState!]]!
  }

  type gameState {
    board1: Board!
    board2: Board!
  }

  type asset {
    destroyed: Boolean!
    cells: [[Int]]!
    destroyedCells: [[Int]]
    type: cellState!
  }
  type assets {
    playerId: String!
    assets: [asset]!
  }
`

module.exports = typeDefs;