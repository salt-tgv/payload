const { PubSub, withFilter } = require('graphql-subscriptions');
const generateBoard = require('../gameLogic/boardLogic');
const { checkMove, updateAsset, updateRevealed, resolveMove, checkWin } = require('../gameLogic/moveLogic');
const pubsub = new PubSub();

const serverMessage = { welcome: "Welcome to Caj's Cool Chatroom", goodbye: "Thanks for visiting!"}
const messageArr = [];


const gameState = {
  gameId: '1',
  activePlayer: '1',
  inactivePlayer: '2',
  winner: '',
  player1: {
    ready: false,
  },
  player2: {
    ready: false,
  },
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
    assets: []
  },
  asset2: {
    playerId: '2',
    assets: []
  }
}

const resolvers = {
  Query: {
    serverMessages: () => (serverMessage),
    messages: () => messageArr,
    gameState: (parent, args, context, info) => {
      return {
        activePlayer: gameState.activePlayer,
        player1: gameState.player1,
        player2: gameState.player2,
        winner: gameState.winner,
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
    /** Login mutation */
    /** Signup mutation */
    /** Create Game Mutation */
    /** Join Game Mutation */
    sendMessage: (_, args) => {
      messageArr.push(args)
      pubsub.publish('NEW_MESSAGE', { newMessage: args })
      return args
    },
    playMove: (parent, args, context) => {
      /** WARNING: gameState is a reference to gameState (pointer) */
      if (gameState.activePlayer === context.playerId) {
        const updatedAsset = resolveMove(gameState, args.coords, context.playerId);
        pubsub.publish('ASSET_UPDATE', { assetUpdate: updatedAsset })
        checkWin(gameState);
        gameState.activePlayer = gameState.inactivePlayer;
        gameState.inactivePlayer = context.playerId;
        pubsub.publish('GAME_UPDATE', { gameUpdate: { 
          player1: gameState.player1,
          player2: gameState.player2,
          board1: gameState.board1, 
          board2: gameState.board2, 
          winner: gameState.winner, 
          activePlayer: gameState.activePlayer}});
        if (gameState.winner) {
          console.log(`${gameState.winner} has won!`)
        }
      }
    },
    placeAssets: (parent, args, context) => {
      const { assetsToPlace } = args;
      const { playerId } = context;
      assetsToPlace.forEach(asset => {
        asset.destroyed = false;
        asset.destroyedCells = [];
      })

      if (gameState.asset1.playerId === playerId) {
        gameState.asset1.assets = assetsToPlace; 
        gameState.player1.ready = true;
      } else if (gameState.asset2.playerId === playerId) {
        gameState.asset2.assets = assetsToPlace;
        gameState.player2.ready = true;
      }
      pubsub.publish(['GAME_UPDATE'], { gameUpdate: { 
        player1: gameState.player1, 
        player2: gameState.player2, 
        board1: gameState.board1, 
        board2: gameState.board2, 
        winner: gameState.winner,
        activePlayer: gameState.activePlayer,
      }})

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