import { gql } from '@apollo/client'

const PLAY_MOVE = gql`
  mutation($coords: [Int]!) {
    playMove(coords: $coords)
  }
`

export { 
  PLAY_MOVE,
}
