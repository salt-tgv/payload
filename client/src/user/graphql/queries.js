import { gql } from '@apollo/client';

const GET_GAMES = gql`
query getActiveGames($playerId: String!) {
  activeGames(playerId: $playerId) {
    gameId
  }
}`

const VALIDATE_USER = gql`
query validateUser($username: String!, $playerId: String!) {
  validateUser(username: $username, playerId: $playerId)
}
`
export {
  GET_GAMES,
  VALIDATE_USER,
}