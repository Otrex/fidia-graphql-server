const { AppEnvironmentEnum } = require('../config');
const config = require('../config');
const {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  ServiceError,
  NotFoundError,
} = require('../http/lib/exceptions');

const errorHandler = (err) => {
  console.log(err);
  // err.extensions?.exception?.stack = {}
  if (typeof err.message !== 'string') {
    err.message = JSON.stringify(err.message);
  }
  return err
};

const pageNotFound = (req, res, next) => {
  res.status(404).send({
    status: 'error',
    message: 'endpoint not found',
  });
};

module.exports = {
  errorHandler,
  pageNotFound,
};
