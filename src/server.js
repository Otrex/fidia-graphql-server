const dotenv = require('dotenv');

dotenv.config()

const startApolloServer = require('./graphqlServer');

const path = require('path');
const config = require('./config');
const {connect} = require('./database');

dotenv.config(path.join(__dirname, '../.env'));

(async () => {
  await connect();
  await startApolloServer(config.app.port);
})().catch(console.error)