require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const { dbInit } = require('./db/db');
const path = require('path');
// const cors = require('cors');

const BUILD_PATH = path.join(__dirname, '../client/build/index.html');
const PORT = process.env.PORT || 1337;
//https://www.apollographql.com/docs/apollo-server/integrations/middleware/#swapping-out-apollo-server

async function startServer () {
  try {
    const app = express();
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('/user', (req, res) => {
      res.send("helo");
    })

    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    const subscriptionServer = SubscriptionServer.create(
      { schema, 
        execute, 
        subscribe,
        onConnect: (connectionParams, socket) => {
          const playerId = connectionParams.playerId;
          const gameId = connectionParams.gameId
          return { playerId, gameId };
        }}, 
      { server: httpServer, path: '/graphql' }
    );

    const server = new ApolloServer({
      schema,
      context: async ({ req, res }) => {
        const db = await dbInit();
        return { playerId: req.headers.playerid, gameId: req.headers.gameid, res, db }
      },
      plugins: [{
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          }
        }
      }]
    });
  
    await server.start();
    server.applyMiddleware({ app });
    

    httpServer.listen(PORT, console.log('Server activated... 👽'));
  } catch(error) {
    console.error(error);
  }
}

startServer();
