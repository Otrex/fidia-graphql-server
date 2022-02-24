const http = require('http');

const app = require('./app');
const { ApolloServer } = require('apollo-server-express');
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
} = require('apollo-server-core');

const config = require('./config');
const sdl = require('./graphqlSchema');

module.exports = async (port) => {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    ...sdl,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageDisabled(),
    ],
  });

  await server.start();

  // Mount Apollo middleware here.
  server.applyMiddleware({ app, path: config.app.path });
  await new Promise((resolve) => httpServer.listen({ port }, resolve));

  const url = `http://localhost:${port}${server.graphqlPath}`;
  console.log(`🚀 Server ready at ${url}`);

  return { server, app, httpServer, url };
};
