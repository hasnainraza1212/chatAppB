const passport = require('passport');
const User = require('../model/userModel');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const authenticate = async()=>{
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    const { displayName:name, emails } = profile;
    const email = emails[0].value;
    const existingUser = await User.findOne({ _id: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = new User({
      _id: profile.id,
      name,
      email,
    });

    // Save the new user to the database
    const user = await newUser.save();
    done(null, user);
  }
));
}
module.exports = authenticate
