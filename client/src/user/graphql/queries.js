import { gql } from '@apollo/client';

const GET_GAMES = gql`
query getActiveGames($playerId: String!) {
  activeGames(playerId: $playerId) {
    gameId
    player1 {
      username
    }
    player2 {
      username
    }
    board1 {
      playerId
    }
    board2 {
      playerId
    }
  }
}`

const VALID_GAME = gql`
query isGameValid($gameId: String!) {
  validGame(gameId: $gameId)
}`

const VALIDATE_USER = gql`
query validateUser($username: String!, $playerId: String!) {
  validateUser(username: $username, playerId: $playerId)
}
`
export {
  GET_GAMES,
  VALIDATE_USER,
  VALID_GAME,
}