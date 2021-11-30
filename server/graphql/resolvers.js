const { PubSub, withFilter } = require('graphql-subscriptions');
const generateBoard = require('../gameLogic/boardLogic');
const pubsub = new PubSub();

const serverMessage = { welcome: "Welcome to Caj's Cool Chatroom", goodbye: "Thanks for visiting!"}
const messageArr = [];

const gameState = {
  board1: {
    playerId: '1',
    boardState: generateBoard(5, false),
  },
  board2: {
    playerId: '2',
    boardState: generateBoard(5, false),
  },
  asset1 : {

  },
  asset2: {

  }

}

const resolvers = {
  Query: {
    serverMessages: () => (serverMessage),
    messages: () => messageArr,
    gameState: (parent, args, context, info) => {
      return {
        board1: gameState.board1,
        board2: gameState.board2,
      }
    }
  },
  Mutation: {
    sendMessage: (_, args) => {
      messageArr.push(args)
      pubsub.publish('NEW_MESSAGE', { newMessage: args })
      return args
    },
    playMove: (parent, args, context) => {
      if (context.playerId === '1') {
        gameState.board2.boardState = !gameState.board2.boardState;
      } else {
        gameState.board1.boardState = !gameState.board1.boardState;
      }

      pubsub.publish('GAME_UPDATE', {gameUpdate: { board1: gameState.board1, board2: gameState.board2 }});
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE']),
    },
    gameUpdate: {
      subscribe: () => pubsub.asyncIterator(['GAME_UPDATE'])
    }
  },
}

module.exports = resolvers;