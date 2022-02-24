const { APP_ENV } = require('../constants');
const { name } = require('../../package.json');
const path = require('path');

module.exports = {
  app: {
    port: process.env.PORT || 3032,
    secret: process.env.APP_SECRET,
    name: process.env.APP_NAME || name,
    env: process.env.APP_ENV,
    path: '/graphql',
    testPath: path.join(__dirname, '..', '..', 'test'),
    bcryptRounds: 10,
    baseUrl: process.env.APP_BASE_URL,
  },
  db: {
    name:
      process.env.APP_ENV !== APP_ENV.TEST
        ? process.env.DB_DATABASE
        : process.env.TEST_DB_DATABASE,

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    uri: process.env.DB_URI,
    authSource: 'admin&readPreference=primary&ssl=false',
  },
  session: {
    ttl: +(process.env.SESSION_TTL || 1 * 24 * 60 * 60),
  },
  email: {
    verificationTTL: process.env.EMAIL_VERIFICATION_TTL || '24h',
    from: process.env.APP_EMAIL,
    nodeMailer: {
      service: process.env.NODEMAILER_SERVICE,
      auth: {
        user: process.env.NODEMAILER_AUTH_USER,
        pass: process.env.NODEMAILER_AUTH_PASS,
      },
    },
  },
};
