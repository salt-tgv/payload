import { gql } from '@apollo/client';

const CREATE_GAME = gql`
  mutation($playerId: String!) {
    createGame(playerId: $playerId)
  }
`

const JOIN_GAME = gql`
  mutation($playerId: String!, $gameId: String!) {
    joinGame(playerId: $playerId, gameId: $gameId)
  }
`

export { CREATE_GAME, JOIN_GAME };