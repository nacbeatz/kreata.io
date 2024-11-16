const express = require('express');
const passport = require('passport')
const {register, login} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
         // The `req.user` will contain user and token from Passport callback
         const { user, token } = req.user;

         if (!token) {
            return res.status(500).json({ message: 'Authentication failed: No token generated' });
          }
          
          res.cookie('userDetails', req.user, {
            httpOnly: false,
            secure: false, //  process.env.NODE_ENV === 'production'
            maxAge: 3600000 ,// 1 hour
             sameSite: 'None' //Strict later
        });
              // Set JWT as HTTP-only cookie
            
        res.cookie('authToken', token, {
            httpOnly: false,
            secure: false, //  process.env.NODE_ENV === 'production'
            maxAge: 3600000 ,// 1 hour
             sameSite: 'None' //Strict later
        });
   
        // Optionally, you can also send the token as JSON res.status(200).json({ token });
        
        res.status(200);
        // Successful authentication, redirect to home or dashboard 
        res.redirect(`http://localhost:3000/?token=${req.user.role}`);
        
    }
);


// Logout route
// Backend route to handle logout
router.post('/api/auth/logout', (req, res) => {
   
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: 'Lax' // or 'Strict' depending on your use case
    });
    // Clear any other session data, if applicable
    req.session = null;
  
    res.status(200).json({ message: 'Logout successful' });
  });
  

module.exports = router;