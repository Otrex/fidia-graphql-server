const config = require('../../config');
const { APP_ENV } = require('../../constants');
const uuid = require('uuid').v4;
const fs = require('fs');
const { ServiceError } = require('../lib/exceptions');
const ObjectId = require('mongoose').Types.ObjectId;
const { mailer, mails } = require('../mails');
const models = require('../models');
const {
  bcryptHash,
  generateNumbers,
  bcryptCompare,
  generateToken,
  generateJWT,
} = require('../lib/utils');
const { DateUpdate } = require('../../core/Utils');

class AuthService {
  static login = async ({ email, password }) => {
    const user = await models.User.findOne(
      { email },
      {},
      { select: '+password' }
    );
    if (!user) throw new ServiceError('user does not exist');
    const passwordMatch = await bcryptCompare(password, user.password);
    if (!passwordMatch) throw new ServiceError('password incorrect');

    await models.User.updateOne(
      { _id: user._id },
      { lastLoggedIn: new Date() }
    );

    const tokenMessage = user.isVerified
      ? {
          token: generateJWT({ id: user._id }),
          message: 'login successful!!',
        }
      : {
          token: generateJWT({ id: user._id }, 'verify'),
          message: 'user not verified',
        };

    return {
      user: await models.User.findById(user._id),
      isVerified: user.isVerified,
      ...tokenMessage,
    };
  };

  static register = async ({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
  }) => {
    const userExist = await models.User.findOne({ email });
    if (userExist) throw new ServiceError('user already exist');

    const userData = {
      email,
      firstName,
      lastName,
      phoneNumber,
      password: await bcryptHash(password),
    };
    const user = await models.User.create(userData);

    const token = generateJWT(
      { id: user._id },
      'email',
      config.email.verificationTTL
    );

    if (config.app.env === APP_ENV.TEST) {
      fs.writeFileSync(`${config.app.testPath}/email-token.txt`, token);
    } else {
      mails.verification.addTo(user.email);
      mails.verification.addData({
        user,
        token: `${
          config.app.baseUrl
        }/?query={verifyEmail(token:"${token.trim()}") {message}}`,
      });
      mailer.send(mails.verification);
    }

    return {
      user: await models.User.findById(user._id),
      message: 'proceed to verifying your user',
    };
  };

  static verifyEmail = async ({ user }) => {
    // User is already extracted in the getVerificationUser middleware
    if (user.isVerified) {
      throw new ServiceError('user has already been verified');
    }

    await models.User.updateOne(
      { _id: user._id },
      {
        isVerified: true,
        verifiedAt: new Date(),
      }
    );

    return {
      message: 'account has been verified, proceed to login',
    };
  };

  static resendEmailToken = async ({ accountId }) => {
    const account = await models.Account.findById(accountId);
    if (!account) throw new ServiceError('account does not exist');
    if (account.isVerified) {
      throw new ServiceError('account has already been verified');
    }

    // TODO throttle resend emails
    const token = generateJWT(
      { id: user._id },
      'email',
      config.email.verificationTTL
    );

    if (config.app.env === APP_ENV.TEST) {
      fs.writeFileSync(`${config.app.testPath}/email-token.txt`, token);
    } else {
      mails.verification.addTo(user.email);
      mails.verification.addData({
        user,
        token: `${
          config.app.baseUrl
        }/?query={verifyEmail(token:"${token.trim()}") {message}}`,
      });
      mailer.send(mails.verification);
    }

    return {
      message: 'proceed to verifying your account',
    };
  };
}

module.exports = AuthService;
