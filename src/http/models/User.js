const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  lastPasswordReset: {
    type: Date,
  },
  
  password: {
    type: String,
    required: true,
    select: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verifiedAt: {
    type: Date,
  },

  lastLoggedIn: {
    type: Date,
    default: new Date(),
  },
});

userSchema.plugin(timestamp);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
