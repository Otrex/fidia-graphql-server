const express = require('express');
const cors = require('cors');
const path = require('path');
const { PRODUCTION } = require('./constants');
const config = require('./config');
const helmet = require('helmet');
const { dbUri } = require('./database');
const {
  errorHandler,
  pageNotFound,
} = require('./middlewares/error.handler');

const { deSerialize } = require('./middlewares/auth');

// create the server
const app = express();

/* MIDDLEWARES */
app.use(cors());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'static')));

const stream = {
  write: (text) => console.log(text.trim()),
};

app.use(deSerialize);

module.exports = app;
