// user.js

// User schema to create documents in user collection

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// define the scheme for our user model

const userSchema = mongoose.Schema({
  first_name : String,
  last_name : String,
  email : String,
  password : String
});

module.exports = mongoose.model('User', userSchema);