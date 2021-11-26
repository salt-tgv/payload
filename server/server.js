const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');

const PORT = 1337;
//https://www.apollographql.com/docs/apollo-server/integrations/middleware/#swapping-out-apollo-server

async function startServer (typeDefs, resolvers) {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
  
    await server.start();
    server.applyMiddleware({
      app,
      path: '/'
    })
  
    httpServer.listen(PORT, console.log('Server activated... 👽'));
  } catch(error) {
    console.error(error);
  }
}
