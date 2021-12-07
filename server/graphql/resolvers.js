const { PubSub, withFilter } = require('graphql-subscriptions');
const { createNewGame, joinNewGame } = require('../gameLogic/gameSetup');
const { resolveMove, checkWin } = require('../gameLogic/moveLogic');
const { generateHash, compareHash } = require('../authentication/authentication');
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
    gameState: async (parent, args, context, info) => {
      const gameState = await context.db
        .collection('ActiveGames')
        .findOne({ gameId: context.gameId });
      return {
        activePlayer: gameState.activePlayer,
        player1: gameState.player1,
        player2: gameState.player2,
        winner: gameState.winner,
        board1: gameState.board1,
        board2: gameState.board2,
      }
    },
    assets: async (parent, args, context) => {
      const gameState = await context.db
        .collection('ActiveGames')
        .findOne({ gameId: context.gameId });
      if (context.playerId === gameState.asset1.playerId)
        return gameState.asset1;
      else if (context.playerId === gameState.asset2.playerId)
        return gameState.asset2;
    },
    activeGames: async (parent, args, context) => {
      const activeGames = context.db
        .collection('ActiveGames')
        .find({$or: [{activePlayer: args.playerId}, {inactivePlayer: args.playerId}]})
        .toArray();

      return activeGames;
    },
    validateUser: async (parent, {username, playerId}, context) => {
      const foundUser = await context.db
        .collection('Users')
        .findOne({ username });
      if (!foundUser) {
        return false;
      }
      if (foundUser.playerId === playerId) {
        return true;
      }
      return false;
    },
    validGame: async(parent, { gameId }, context) => {
      const gameFound = await context.db 
        .collection('ActiveGames')
        .findOne({ gameId });
      return gameFound ? true : false;
    },
  },
  Mutation: {
    signup: async (_, { user }, context) => {
      const foundUser = await context.db
        .collection('Users')
        .findOne({ username: user.username });
        
      if (!foundUser) {
        const hash = await generateHash(user.password);
        user.playerId = String(Date.now());
        user.password = hash;
        await context.db
          .collection('Users')
          .insertOne(user);
        return { username: user.username, playerId: user.playerId };
      }

      return { error: 'User already exists!', username: 'error' };
    },

    login: async (_, { user }, context) => {
      const foundUser = await context.db
        .collection('Users')
        .findOne({ username: user.username });
      if (foundUser) {
        if (await compareHash(user.password, foundUser.password)){
          return { username: foundUser.username, playerId: foundUser.playerId };
        }
        return { error: 'Wrong password', username: 'error' }; 
      }

      return { error: 'User not found', username: 'error' };
    },
    /** Create Game Mutation */
    createGame: async (_, { playerId }, context) => {
      const user = await context.db
        .collection('Users')
        .findOne({playerId});
      const newGame = createNewGame(playerId, user.username);
      // gamesArr.push(newGame);
      await context.db
        .collection('ActiveGames')
        .insertOne(newGame);
      return newGame.gameId;
    },
    /** Join Game Mutation */
    joinGame: async (_, { gameId, playerId }, context) => {
      let gameStateIndex;
      const user = await context.db
        .collection('Users')
        .findOne({playerId});
      const gameState = await context.db
        .collection('ActiveGames')
        .findOne({ gameId });

      if (!gameState) {
        return false;
      }

      /** Publish game if join */
      const newGameState = joinNewGame(playerId, gameState, user.username);
      const updateStatus = await context.db
      .collection('ActiveGames')
      .replaceOne({ gameId: newGameState.gameId }, newGameState);
      if(updateStatus.acknowledged){
        pubsub.publish(['GAME_UPDATE'], { gameUpdate: { 
          player1: newGameState.player1, 
          player2: newGameState.player2, 
          board1: newGameState.board1, 
          board2: newGameState.board2, 
          gameId: newGameState.gameId,
          winner: newGameState.winner,
          activePlayer: newGameState.activePlayer,
        }})
      }
      
      return true;
    },
    sendMessage: (_, args) => {
      messageArr.push(args)
      pubsub.publish('NEW_MESSAGE', { newMessage: args })
      return args
    },
    playMove: async (parent, args, context) => {
      /** WARNING: gameState is a reference to gameState (pointer) */
      const gameState = await context.db
        .collection('ActiveGames')
        .findOne({ gameId: context.gameId });
      
      if (gameState.activePlayer === context.playerId && !gameState.winner) {
        const updatedAsset = resolveMove(gameState, args.coords, context.playerId);
        pubsub.publish('ASSET_UPDATE', { assetUpdate: updatedAsset, gameUpdate: { gameId: gameState.gameId } })
        checkWin(gameState);
        gameState.activePlayer = gameState.inactivePlayer;
        gameState.inactivePlayer = context.playerId;

        const updateStatus = await context.db
          .collection('ActiveGames')
          .replaceOne({ gameId: gameState.gameId }, gameState);

        if (updateStatus.acknowledged){
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
            await context.db
              .collection('ActiveGames')
              .deleteOne({ gameId: gameState.gameId });
            await context.db
              .collection('FinishedGames')
              .insertOne(gameState);
          }
        }
      }
    },
    placeAssets: async (parent, args, context) => {
      const gameState = await context.db
        .collection('ActiveGames')
        .findOne({ gameId: context.gameId });
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

      const updateStatus = await context.db
        .collection('ActiveGames')
        .replaceOne({ gameId: gameState.gameId }, gameState);

      if(updateStatus.acknowledged){
        pubsub.publish(['GAME_UPDATE'], { gameUpdate: { 
          player1: gameState.player1, 
          player2: gameState.player2, 
          board1: gameState.board1, 
          board2: gameState.board2, 
          gameId: gameState.gameId,
          winner: gameState.winner,
          activePlayer: gameState.activePlayer,
        }})
      }
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