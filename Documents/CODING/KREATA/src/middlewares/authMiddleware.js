const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const verifyToken = (req, res, next) => {
  // Check for token in cookies first
  let token = req.cookies.authToken;

  // If no token in cookies, check Authorization header
  if (!token) {
    const authHeader = req.headers.authorization || req.headers.Authorization; // Case-insensitive
     if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // If still no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload (including role, if present) to req.user
    console.log("Decoded user from token:", req.user); // Debugging output
    next();
  } catch (err) {
    console.error("Token verification failed:", err); // For debugging
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = verifyToken;

