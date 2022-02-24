const crypto = require("crypto");
const config = require("../../config");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.generateToken = (length) => {
  return crypto
    .randomBytes(length * 3)
    .toString('base64')
    .split('+')
    .join('')
    .split('/')
    .join('')
    .split('=')
    .join('')
    .substr(0, length);;
};

exports.generateNumbers = (length) => {
  return Math.floor(Math.random() * (Math.pow(10, length) - 1))
}

exports.generateHash = (seed) => {
  const data = seed.toString() + Date.now().toString();
  return crypto.createHash('sha256').update(data).digest('hex');
}

exports.bcryptHash = (password) => {
  return bcrypt.hash(password, config.app.bcryptRounds);
}

exports.bcryptCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
}

exports.generateJWT = (payload, key = "auth", expiresIn = '24h') => {
  return jwt.sign({ ...payload, key }, config.app.secret, { expiresIn })
}

exports.decodeJWT = (token) => {
  return jwt.decode(token)
}