const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');

const PORT = 1337;
//https://www.apollographql.com/docs/apollo-server/integrations/middleware/#swapping-out-apollo-server

async function startServer () {
  try {
    const app = express();
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
          return { playerId };
        }}, 
      { server: httpServer, path: '/graphql' }
    );

    const server = new ApolloServer({
      schema,
      context: ({req}) => {
        return { playerId: req.headers.playerid }
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
