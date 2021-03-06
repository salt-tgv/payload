const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum cellState {
    UNKNOWN
    HIT
    MISS
    DB
    SERVER
  }

  enum assetType {
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
    validGame (gameId: String!): Boolean
    assets: assets
    activeGames (playerId: String!): [gameState]
    validateUser(username: String!, playerId: String!): Boolean
  }

  type chatMessage {
    name: String!
    message: String!
  }

  input AssetToPlace {
    cells: [[Int!]]
    type: assetType!
  }

  input User {
    username: String
    password: String
  }

  type UserOut {
    username: String
    playerId: String
    error: String
  }

  type Mutation {
    sendMessage(name: String!, message: String!): chatMessage
    playMove(coords: [Int]!): Boolean
    placeAssets(assetsToPlace: [AssetToPlace]): Boolean
    signup(user: User): UserOut
    login(user: User): UserOut
    createGame(playerId: String!): String!
    joinGame(playerId: String!, gameId: String!): Boolean
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

  type Player {
    ready: Boolean!
    username: String
  }

  type gameState {
    gameId: String
    activePlayer: String!
    winner: String!
    player1: Player!
    player2: Player!
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
