const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const Channels = require('../models/ytChannelModel');
const Snapshots = require('../models/snapshotsModel');
const Subscriptions = require('../models/subscriptionsModel');
const generateTokenAndSetCookies = require('../utils/generateTokenAndSetCookies')

const register = async (req, res) => {
    try {
        const { username, password, role, name, email } = req.body;

     
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
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
            isFirstLogin: true 
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



const logout = async (req, res) => { 
console.log('Logout reaches BE for: '+req.userData);
res.status(201).json({
    success: true,
    message: `You logged successfully!`,
})
}

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

        let channels = [];
        let referenceChannels = [];
        channels = await Channels.find({ owner: user._id });

        // Initialize variables
        let credits = 5;
        let hasChannel = false;
        let plan = 'free';

        // Check credits and plan
        if (user.isFirstLogin) {
            const existingSubscription = await Subscriptions.findOne({ userId: user._id });

            if (!existingSubscription) {
                const userPlan = new Subscriptions({
                    userId: user._id,
                    plan: plan,
                    credits: credits,
                    subscribedAt: Date.now(),
                    creditsExpireAt: Date.now() + 24 * 60 * 60 * 1000 * 30, // 30 days
                });
                await userPlan.save();
                console.log('FREE subscription plan added!');
            } else {
                credits = existingSubscription.credits;
                if(credits<=3){  
                    credits = 0;
                }
                plan = existingSubscription.plan;
              
                const userChannels = await Channels.find({ owner: user._id });
                if (userChannels.length > 0) {
                    hasChannel = true;
                    console.log('This user has ' + userChannels.length + ' channel(s) on our platform');
                } else {
                    console.log('This user has no channel on our platform');
                }
            }

            await user.save();
        }

        // Find channels the user is referenced in and format the details
        const referencedChannels = await Channels.find({ references: user._id });
        
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        referenceChannels = await Promise.all(
            referencedChannels.map(async (channel) => {
                const todaySnapshot = await Snapshots.findOne({
                    channelId: channel.channelId, // Use the correct channelId from the current channel
                    updatedAt: {
                        $gte: todayStart,
                        $lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000),
                    },
                });
                const snapshotData = todaySnapshot?.snapshotData || [];
                return {
                    title: channel.title,
                    profile: channel.profile,
                    channelId: channel.channelId,
                    subs: channel.subscriberCount,
                    views: channel.viewCount,
                    handle: channel.handle,
                    description: channel.description,
                    country: channel.country,
                    createdAt: channel.createdAt,
                    publishedAt: channel.publishedAt,
                    keywords: channel.keywords,
                    topVideos: channel.topVideos,
                    latestVideos: channel.latestVideos,
                    videos: channel.videoCount,
                    lastUpdate: channel.updatedAt,
                    snapshotUpdatedAt:todaySnapshot ? todaySnapshot.updatedAt : channel.updatedAt ,
                    needsUpdate: !todaySnapshot,
                    gainedSub: snapshotData.length > 0 
                    ? (snapshotData[snapshotData.length - 1].subscriberCount - channel.subscriberCount).toLocaleString() 
                    : 0,
                    gainedViews: snapshotData.length > 0 
                    ? (snapshotData[snapshotData.length - 1].viewCount - channel.viewCount).toLocaleString() 
                    : 0,
                    videoMade: snapshotData.length > 0 
                    ? (snapshotData[snapshotData.length - 1].videoCount - channel.videoCount).toLocaleString() 
                    : 0,
                };
            })
        );
        
        const outdatedChannels = referenceChannels
        .filter(channel => channel.needsUpdate)
        .map(channel => channel.channelId);

        // Generate a token
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

        // Include credits, referenced channels, and isFirstLogin in the response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                credits: credits,
                isFirstLogin: user.isFirstLogin,
                hasChannel: hasChannel,
                channels: channels.length > 0 ? channels : [],
                referenceChannels: referenceChannels.length > 0 ? referenceChannels : [],
                userPlan: plan,
                outdatedChannels,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Login Fails`, error: err.message });
    }
};



module.exports = {register, login, logout};