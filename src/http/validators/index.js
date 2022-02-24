const GenericValidator = require('./core');

class LoginValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    email: { type: 'email' },
    password: { type: 'string', trim: true, min: 5 },
  };
}

class RegisterValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    email: { type: 'email' },
    password: { type: 'string', trim: true, min: 5 },
    firstName: { type: 'string', trim: true, min: 1 },
    lastName: { type: 'string', trim: true, min: 1 },
    phoneNumber: { type: 'string', min: 9, max: 21 }
  };
}

class VerifyEmailValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    token: { type: 'string' },
  };
}

class ResendVerificationEmailValidator extends VerifyEmailValidator {}


module.exports = {
  LoginValidator,
  RegisterValidator,
  ResendVerificationEmailValidator,
  VerifyEmailValidator,
};
