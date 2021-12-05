const { PubSub, withFilter } = require('graphql-subscriptions');
const { createNewGame, joinNewGame } = require('../gameLogic/gameSetup');
const { checkMove, updateAsset, updateRevealed, resolveMove, checkWin } = require('../gameLogic/moveLogic');
const pubsub = new PubSub();

const serverMessage = { welcome: "Welcome to Caj's Cool Chatroom", goodbye: "Thanks for visiting!"}
const messageArr = [];
const usersArr = [];
const gamesArr = [];
const finishedArr = [];

const resolvers = {
  Query: {
    serverMessages: () => (serverMessage),
    messages: () => messageArr,
    gameState: (parent, args, context, info) => {
      const gameState = gamesArr.find(game => game.gameId === context.gameId);
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
      const gameState = gamesArr.find(game => game.gameId === context.gameId);
      if (context.playerId === gameState.asset1.playerId)
        return gameState.asset1;
      else if (context.playerId === gameState.asset2.playerId)
        return gameState.asset2;
    }
  },
  Mutation: {
    signup: (_, { user }, context) => {
      const foundUser = usersArr.find(userInArr => userInArr.username === user.username)
      if (!foundUser) {
        user.playerId = String(Date.now());
        usersArr.push(user);
        return { username: user.username, playerId: user.playerId };
      }

      return { error: 'User already exists!', username: 'error' };
    },

    login: (_, { user }, context) => {
      const foundUser = usersArr.find(userInArr => userInArr.username === user.username)
      if (foundUser) {
        return { username: foundUser.username, playerId: foundUser.playerId };
      }

      return { error: 'User not found', username: 'error' };
    },
    /** Create Game Mutation */
    createGame: (_, { playerId }, context) => {
      const newGame = createNewGame(playerId);
      gamesArr.push(newGame);
      return newGame.gameId;
    },
    /** Join Game Mutation */
    joinGame: (_, { gameId, playerId }, context) => {
      let gameStateIndex;
      const gameState = gamesArr.find((game, index) => {
        if (game.gameId === gameId) {
          gameStateIndex = index;
          return true;
        }
      });

      if (!gameState) {
        return false;
      }

      /** Publish game if join */
      gamesArr[gameStateIndex] = joinNewGame(playerId, gameState);
      pubsub.publish(['GAME_UPDATE'], { gameUpdate: { 
        player1: gameState.player1, 
        player2: gameState.player2, 
        board1: gameState.board1, 
        board2: gameState.board2, 
        gameId: gameState.gameId,
        winner: gameState.winner,
        activePlayer: gameState.activePlayer,
      }})

      return true;
    },
    sendMessage: (_, args) => {
      messageArr.push(args)
      pubsub.publish('NEW_MESSAGE', { newMessage: args })
      return args
    },
    playMove: (parent, args, context) => {
      /** WARNING: gameState is a reference to gameState (pointer) */
      const gameState = gamesArr.find(game => game.gameId === context.gameId);
      if (gameState.activePlayer === context.playerId && !gameState.winner) {
        const updatedAsset = resolveMove(gameState, args.coords, context.playerId);
        pubsub.publish('ASSET_UPDATE', { assetUpdate: updatedAsset, gameUpdate: { gameId: gameState.gameId } })
        checkWin(gameState);
        gameState.activePlayer = gameState.inactivePlayer;
        gameState.inactivePlayer = context.playerId;
        pubsub.publish('GAME_UPDATE', { gameUpdate: { 
          player1: gameState.player1,
          player2: gameState.player2,
          board1: gameState.board1,
          gameId: gameState.gameId,
          board2: gameState.board2, 
          winner: gameState.winner, 
          activePlayer: gameState.activePlayer}});
        if (gameState.winner) {
          const gameIndex = gamesArr.findIndex(game => game.gameId === context.gameId);
          finishedArr.push(gamesArr.splice(gameIndex, 1));
          console.log(finishedArr);
        }
      }
    },
    placeAssets: (parent, args, context) => {
      const gameState = gamesArr.find(game => game.gameId === context.gameId);
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
        gameId: gameState.gameId,
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
      subscribe: withFilter(
        () => pubsub.asyncIterator(['GAME_UPDATE']),
        ((payload, variables, context) => {
          // console.log();
          return payload.gameUpdate.gameId === context.gameId;
        })
      )
    },
    assetUpdate: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['ASSET_UPDATE']),
        ((payload, variables, context) => { 
          return ((payload.assetUpdate.playerId === context.playerId) 
          && payload.gameUpdate.gameId === context.gameId)
        })
      )
    } 
  },
}

module.exports = resolvers;