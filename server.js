// server.js

// set up ===========================================================================

// tools we need
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

// routes
const authRoutes = require('./routes/auth');

// config
require('./config/passport');
const configDB = require('./config/db');

// configuration ====================================================================
mongoose.connect(configDB.url, {
  useMongoClient: true
});

const db = mongoose.connection;
mongoose.Promise = global.Promise;
//assert.equal(query.exec().constructor, global.Promise);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

express()
  .set('view engine', 'hjs')
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: false}))
  .use(session({ secret: 'i love dogs', resave: false, saveUninitialized: false }))
  .use(passport.initialize())
  .use(passport.session())
  .use(authRoutes)
  .get('/', (req, res, next) => {
    res.send({
      session: req.session,
      user: req.user,
      authenticated: req.isAuthenticated(),
    })
  })
  .listen(3000)
  console.log('Yay stuff is happening!');

