const dateResolver = require('./http/lib/date.resolvers');
const types = require('./http/sdls/type');
const authScheme = require('./http/sdls/auth');
const userScheme = require('./http/sdls/user');
const authResolvers = require('./http/resolvers/auth');
const userResolvers = require('./http/resolvers/user');
const objectIdResolver = require('./http/lib/objectId.resolver');
const { errorHandler } = require('./middlewares/error.handler');

module.exports = {
  typeDefs: [types, authScheme, userScheme],
  resolvers: {
    Date: dateResolver,
    ObjectId: objectIdResolver,
    Query: {
      ...authResolvers.Query,
      ...userResolvers.Query,
    },
    Mutation: {
      ...authResolvers.Mutation,
    },
  },
  context: ({ req }) => ({
    userId: req.session.userId,
    jwtData: req.jwtData,
  }),
  introspection: true,
  playground: true,
  formatError: errorHandler,
};
