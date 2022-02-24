const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV !== 'prod') {
  dotenv.config(path.join(__dirname, '../.env'));
}
const config = require('./config');

const dbUri =
  process.env.DB_URI ||
  `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}?authSource=${config.db.authSource}`;

const connect = async () => {
  try {
    const connection = mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongodb connected`);
    return connection;
  } catch (err) {
    console.error('mongodb failed to connect', err);
    process.exit(1);
  }
};

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running'))
        return;
      console.log(error.message);
    }
  }
}

module.exports = { connect, dbUri, dropAllCollections };
