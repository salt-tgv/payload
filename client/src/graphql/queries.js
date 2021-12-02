import { gql } from '@apollo/client'

/** WHEN TIME, CLEAN UP NAMING, HERE AND BACKEND */

const SUBSCRIBE_MESSAGES = gql`
subscription {
  newMessage {
    name
    message
  }
}`

const GET_MESSAGES = gql`
query getMessages {
  messages {
    name
    message
  }
}`

const GET_BOARDS = gql`
query getBoards {
  gameState {
    activePlayer
    winner
    player1{
      ready
    }
    player2{
      ready
    }
    board1 {
      playerId
      boardState
    }
    board2 {
      playerId
      boardState
    }
  }
}`

const SUBSCRIBE_BOARDS = gql`
subscription gameUpdates {
  gameUpdate {
    activePlayer
    winner
    player1 {
      ready
    }
    player2 {
      ready
    }
    board1 {
      playerId
      boardState
    }
    board2 {
      playerId
      boardState
    }
  }
}`

const GET_ASSETS = gql`
  query getAssets {
    assets {
      playerId
      assets {
        destroyed
        cells
        destroyedCells
        type
      }
    }
  }
`

const SUBSCRIBE_ASSETS = gql`
  subscription assetUpdates {
    assetUpdate {
      playerId
      assets {
        destroyed
        cells
        destroyedCells
        type
      }
    }
  }
`

export {
  GET_BOARDS,
  SUBSCRIBE_BOARDS,
  GET_ASSETS,
  SUBSCRIBE_ASSETS,
}