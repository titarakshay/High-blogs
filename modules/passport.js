var passport = require("passport");
var Githubstrategy = require("passport-github").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      var user = {};
      user.email = profile._json.email;
      user.name = profile.displayName;
      user.id = profile.id;

      User.findOne({ googleId: user.id }, (err, newUser) => {
        if (newUser) {
          return done(err, newUser);
        }
        if (!newUser) {
          User.create(
            {
              googleId: user.id,
              name: user.name,
              email: user.email,
            },
            (err, newUser) => {
              return done(err, newUser);
            }
          );
        }
      });
    }
  )
);

passport.use(
  new Githubstrategy(
    {
      clientID: process.env.Client_ID,
      clientSecret: process.env.Client_Secret,
      callbackURL: "/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      //user create or find
      User.findOne({ githubId: profile.id }, (err, user) => {
        if (user) {
          return done(err, user);
        }
        if (!user) {
          User.create(
            {
              githubId: profile.id,
              name: profile.displayName,
            },
            (err, user) => {
              return done(err, user);
            }
          );
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log(user,"user is here");
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  var user = { email: "akshay@mail", username: "xyz" };
  done(null, user);
});
