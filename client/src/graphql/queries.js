import { gql } from '@apollo/client'

const SUBSCRIBE_MESSAGES = gql`
subscription {
  newMessage {
    name
    message
  }
}
`

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
    board1 {
      playerId
      boardState
    }
    board2{
      playerId
      boardState
    }
  }
}`

export {
  GET_BOARDS,
  SUBSCRIBE_BOARDS
}