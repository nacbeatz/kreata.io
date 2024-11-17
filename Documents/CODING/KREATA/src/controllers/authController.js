const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const Channels = require('../models/ytChannelModel');
const generateTokenAndSetCookies = require('../utils/generateTokenAndSetCookies')

const register = async (req, res) => {
    try {
        const { username, password, role, name, email } = req.body;

        console.log('BE received: ' + username + ' ' + password + ' ' + role);

        if (!username || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(1000000 + Math.random() * 900000).toString();

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            role,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            isFirstLogin: true // Mark as first login
        });

        await newUser.save();

        generateTokenAndSetCookies(res, newUser._id);

        res.status(201).json({
            success: true,
            message: `User ${username} is registered`,
            user: {
                ...newUser._doc,
                password: undefined, // Exclude the password
                isFirstLogin: true // Ensure the flag is sent
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `User ${req.body.username} can't be registered`, error: err.message });
    }
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password' });
        }

const channels = await Channels.findOne({ owner:user._id });
console.log(channels);
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set cookies
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", // Protect from CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

      
        // Include isFirstLogin in the response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isFirstLogin: user.isFirstLogin,   
            },
            channels: channels.length > 0 ? channels : [],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Something went wrong`, error: err.message });
    }
};

module.exports = {register, login};