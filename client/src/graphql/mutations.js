import { gql } from '@apollo/client'

const PLAY_MOVE = gql`
  mutation {
    playMove
  }
`

export { 
  PLAY_MOVE,
}
