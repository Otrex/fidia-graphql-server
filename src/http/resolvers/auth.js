const requestHandler = require('.');
const AuthService = require('../services/auth.service');
const { getVerificationUser } = require('../../middlewares/auth');
const {
  LoginValidator,
  RegisterValidator,
  VerifyEmailValidator,
  ResendVerificationEmailValidator,
} = require('../validators');

module.exports = {
  Query: {
    login: requestHandler({
      validator: LoginValidator,
      handler: AuthService.login,
    }),
    verifyEmail: requestHandler({
      validator: VerifyEmailValidator,
      middlewares: [getVerificationUser],
      handler: AuthService.verifyEmail,
    }),
    resendVerificationEmail: requestHandler({
      handler: AuthService.resendEmailToken,
      validator: ResendVerificationEmailValidator,
    }),
  },

  Mutation: {
    register: requestHandler({
      validator: RegisterValidator,
      handler: AuthService.register,
    }),
  },
};
