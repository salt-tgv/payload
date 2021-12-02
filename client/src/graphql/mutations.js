import { gql } from '@apollo/client'

const PLAY_MOVE = gql`
  mutation($coords: [Int]!) {
    playMove(coords: $coords)
  }
`
const PLAYER_CONFIRM = gql`
mutation($assetsToPlace: [AssetToPlace]) {
  placeAssets(assetsToPlace: $assetsToPlace)
}`

export { 
  PLAY_MOVE,
  PLAYER_CONFIRM
}
