// passport.js

const bcrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

// checks email address structure to validate
const validateEmail = require('rfc822-validate');

// Load up the user model
const User = require('../app/models/user');

passport.use(new LocalStrategy(authenticate));
passport.use('local-register', new LocalStrategy({passReqToCallback: true}, register));

// Password checker functions 
function checkPwd(str) {
  if (str.length < 6) {
    return ('is too short');
  } else if (str.length > 30) {
    return ('is too long');
  } else if (str.search(/\d/) == -1) {
    return ('does not have a number.');
  } else if (str.search(/[a-zA-Z]/) == -1) {
    return ('does not have letters.');
  } else if (str.search(/[^a-zA-Z0-9\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\_\\+]/) != -1) {
    return ('uses improper characters.');
  }
  return ('ok');
}

function authenticate(email, password, done) {
  // set email lowercase for easier comparison
  if (email) {
    email = email.toLowerCase();
  }
  process.nextTick(() => {
    User.findOne({ 'email' : email }, (err, user) => {
      // if there are any errors, return the error
      if (err) {
        return done(err);
      }
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, {message: 'invalid user and password combination'});
      } else {
        return done(null, user);
      }
    });
  });
}

function register(req, email, password, done) {
  if (email) {
    email = email.toLowerCase();
  }
  process.nextTick(() => {
    if (!req.user) {
       User.findOne({ 'email': email }, (err, user) => {
        if (err) {
          return done(err);
        }
        // Do different checks required for a valid email/password comb.
        if (user) {
          return done(null, false, {message: 'email already exists'});
        }
        const valid = validateEmail(email);

        if (!valid) {
          return done(null, false, {message: 'email address was not valid'});
        }
        if (password !== req.body.password2) {
          return done(null, false, {message: 'passwords don\'t match'})
        }
        const validPwd = checkPwd(password);
        if (validPwd !== 'ok') {
          return done(null, false, {message: validPwd});
        } 

        // create the document
        let newUser = new User();
        newUser.first_name = req.body.first_name;
        newUser.last_name = req.body.last_name;
        newUser.email = email;
        newUser.password = bcrypt.hashSync(password);
        newUser.save((err) => {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
       });
    } else {
      return done(null, req.user);
    }
  });
}


passport.serializeUser(function(user, done) {
  done(null, user.id)
});

passport.deserializeUser(function(id, done) {
  User.findById(id, (err, user) => {
    done(err, user); 
  });
});
