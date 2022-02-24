const models = require('../models');

class UserService {
  static getAllUsers = async (_) => {
    const users = await models.User.find();
    return users;
  };
}

module.exports = UserService;
