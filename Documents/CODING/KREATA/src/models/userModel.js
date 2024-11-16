const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true, 
    },
    password: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'creator', 'user'],
        default: 'user',
    },
    name: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        required: false,
        default: null,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isFirstLogin: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, {
    timestamps: true,
});


module.exports = mongoose.model('User', userSchema)

