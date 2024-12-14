const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./utils/passport');
const cors = require('cors');
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnect');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/ytChannelRoutes');
const verifyToken = require('./middlewares/authMiddleware')
const authorizeRoles = require('./middlewares/roleMiddleware')
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Explicitly allow frontend origin
    credentials: true, // Allow cookies to be sent
  }));

dbConnect();

// Middleware to parse JSON and URL-encoded data

//Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport and restore authentication state from the session
app.use(passport.initialize());
app.use(passport.session());


//Routesw
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
app.get('/api/users/user',verifyToken, authorizeRoles("admin", "creator","user"), (req,res) =>{
  
    const userDetails = req.cookies.userData;
    if (!userDetails) return res.status(404).json({ message: 'User not found' });

    
    if (typeof userDetails === 'string') {
        res.json(JSON.parse(decodeURIComponent(userDetails)));
      } else {
        res.json(userDetails);
      }
      
        })

//Start Server

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})
