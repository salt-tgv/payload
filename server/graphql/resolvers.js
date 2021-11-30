const { PubSub, withFilter } = require('graphql-subscriptions');
const generateBoard = require('../gameLogic/boardLogic');
const { checkMove, updateAsset, updateRevealed } = require('../gameLogic/moveLogic');
const pubsub = new PubSub();

const serverMessage = { welcome: "Welcome to Caj's Cool Chatroom", goodbye: "Thanks for visiting!"}
const messageArr = [];

const gameState = {
  gameId: '1',
  board1: {
    playerId: '1',
    boardState: generateBoard(5, 'UNKNOWN'),
  },
  board2: {
    playerId: '2',
    boardState: generateBoard(5, 'UNKNOWN'),
  },
  asset1: {
    playerId: '1',
    assets: [
      { destroyed: false, cells: [[1, 3], [2, 3]], destroyedCells: [], type: 'DB'}, 
      { destroyed: false, cells: [[4, 1]], destroyedCells: [], type: 'DB' }, 
      { destroyed: false, cells: [[3, 2]], destroyedCells: [], type: 'DB' }
    ]
}
  ,
  asset2: {
    playerId: '2',
    assets: [
      { destroyed: false, cells: [[1, 3], [2, 3]], destroyedCells: [], type: 'DB' }, 
      { destroyed: false, cells: [[4, 1]], destroyedCells: [], type: 'DB' }, 
      { destroyed: false, cells: [[3, 2]], destroyedCells: [], type: 'DB' }
    ]
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
    },
    assets: (parent, args, context) => {
      if (context.playerId === gameState.asset1.playerId)
        return gameState.asset1;
      else if (context.playerId === gameState.asset2.playerId)
        return gameState.asset2;
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
        const result = checkMove(args.coords, gameState.asset2.assets)
        gameState.board2.boardState[args.coords[0]][args.coords[1]] = result;
        if (result === 'HIT') {
          gameState.asset2.assets = updateAsset(args.coords, gameState.asset2.assets)
          gameState.board2.boardState = updateRevealed(gameState.asset2.assets, gameState.board2.boardState);
          pubsub.publish('ASSET_UPDATE', { assetUpdate: gameState.asset2 });
        }
      } else if (context.playerId === '2') {
        const result = checkMove(args.coords, gameState.asset1.assets)
        gameState.board1.boardState[args.coords[0]][args.coords[1]] = result;
        if (result === 'HIT') {
          gameState.asset1.assets = updateAsset(args.coords, gameState.asset1.assets);
          gameState.board1.boardState = updateRevealed(gameState.asset1.assets, gameState.board1.boardState);
          pubsub.publish('ASSET_UPDATE', { assetUpdate: gameState.asset1 });
        }
      }
      
      pubsub.publish('GAME_UPDATE', { gameUpdate: { board1: gameState.board1, board2: gameState.board2 }});
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE']),
    },
    gameUpdate: {
      subscribe: () => pubsub.asyncIterator(['GAME_UPDATE']),
    },
    assetUpdate: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['ASSET_UPDATE']),
        ((payload, variables, context) => (payload.assetUpdate.playerId === context.playerId))
      )
    } 
  },
}

module.exports = resolvers;