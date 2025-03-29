require('dotenv').config({ path: '../../.env' }); // Adjust path if needed
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

console.log('DOTENV CONFIG:');
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      // Create a user object with all necessary details
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
        // Include the entire profile for flexibility
        originalProfile: profile
      };
      
      console.log('Processed User:', user);
      done(null, user);
    }
  )
);

// Modify serialization to store more user info
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});