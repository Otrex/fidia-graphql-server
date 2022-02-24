const requestHandler = require('.');
const { isAuthenticated } = require('../../middlewares/auth');
const UserService = require('../services/user.service');

module.exports = {
  Query: {
    users: requestHandler({
      middlewares: [isAuthenticated],
      handler: UserService.getAllUsers,
    }),
  },
};
