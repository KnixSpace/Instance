require("dotenv").config();
const { User } = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URI,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        let newUser = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        newUser = await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  User.findById(id).then((user) => {
    done(null, {
      userId: user._id,
      googleId: user.googleId,
      username: user.username,
      avatar: user.avatar,
    });
  });
});
