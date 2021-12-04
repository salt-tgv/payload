import { gql } from '@apollo/client';

const CREATE_GAME = gql`
  mutation($playerId: String!) {
    createGame(playerId: $playerId)
  }
`

export { CREATE_GAME };