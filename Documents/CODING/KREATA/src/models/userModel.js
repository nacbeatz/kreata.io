const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    password: {
        type: String,
        // Required only if googleId is not provided
        required: function() {
          return !this.googleId;
        }
      },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      },
      username: {
        type: String,
        required: true,
        trim: true
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
        sparse: true, 
        unique: true,
        index: true
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
// Compound index to ensure email uniqueness per auth method
userSchema.index({ 
    email: 1, 
    googleId: 1 
  }, { 
    sparse: true,
    unique: true 
  });

module.exports = mongoose.model('User', userSchema)

