// config/passport.js

// load all the things we need

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// load the auth variables
var configAuth = require('./auth');

module.exports = function (passport) {

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Google profile is serialized
    //   and deserialized.
    passport.serializeUser(function (user, done) {
        console.log('serializeUser');
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        console.log('deserializeUser');
        done(null, obj);
    });


    passport.use(new GoogleStrategy({

            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,

        },
        function (token, refreshToken, profile, done) {

            // make the code asynchronous
            process.nextTick(function () {
                console.log('nextTick');
                //profile.identifier = identifier;
                return done(null, profile);

            });

        }));

};