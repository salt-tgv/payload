import { gql } from '@apollo/client'


const SIGN_UP = gql`
  mutation($user: User) {
    signup(user: $user) {
      username
      error
      playerId
    }
  }
`

const LOG_IN = gql`
  mutation($user: User) {
    login(user: $user) {
      username
      error
      playerId
    }
  }
`



export { SIGN_UP, LOG_IN };