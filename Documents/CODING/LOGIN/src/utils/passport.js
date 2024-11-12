const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/userModel');
const generateTokenAndSetCookies = require('../utils/generateTokenAndSetCookies')
// Load environment variables
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID:     '900817559451-gh7ttqb92sdbfd0ij9qkp77c43np8904.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:4000/api/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    try {
      // Find or create the user in your database
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          username: profile.id,
          googleId: profile.id,
          email: profile.email,
          role:profile.role, 
          name: profile.displayName,
          profilePicture: profile.photos[0].value,
          isVerified: true
        });
      

      
      }else {
        // Update last login date if user already exists
        user.lastLogin = new Date();
        await user.save();
    }

   // Generate JWT token
   const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);
user.token = token; 

generateTokenAndSetCookies(request.res, user);

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));
// Serialize user into the sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize user from the sessions
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err, null);
  }
}); 
