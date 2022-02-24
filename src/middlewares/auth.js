const { AuthenticationError, ServiceError } = require('../http/lib/exceptions');
const { decodeJWT } = require('../http/lib/utils');
const models = require('../http/models');

module.exports = {
  deSerialize: async (req, res, next) => {
    req.session = {};
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) return next();

      const token = authorizationHeader.split(' ').reverse()[0];
      const jwtData = decodeJWT(token);

      req.session.userId = jwtData.id;
      req.jwtData = jwtData;

      next();
    } catch (err) {
      return next();
    }
  },

  isAuthenticated: async (_, data, ctx) => {
    if (ctx.jwtData?.key != 'auth' || !ctx.userId) {
      throw new AuthenticationError('user not authenticated');
    }
    const user = await models.User.findById(ctx.userId);
    if (!user) throw new AuthenticationError('user not authenticated');
    ctx.user = user;
  },

  getVerificationUser: async (_, { token }, ctx) => {
    const jwtData = decodeJWT(token);
    if (!jwtData)
      throw new ServiceError('invalid token, please make a resend request');
    const user = await models.User.findById(jwtData?.id);
    if (!user) throw new AuthenticationError('user not found');
    ctx.user = user;
    ctx.userId = jwtData.id;
  },
};
