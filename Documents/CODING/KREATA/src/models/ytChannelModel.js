const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: [String], default: [] }, // Tags field
  keywords: { type: [String], default: [] }, // New keywords field
  publishedAt: { type: Date, required: true },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  thumbnailUrl: { type: String },
  videoUrl: { type: String },
}, { timestamps: true });



const ChannelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true }, 
  title: { type: String, required: true }, 
  handle: { type: String, required: true }, 
  profile: { type: String, required: false }, 
  description: { type: String },
  keywords: { type: [String], default: [] }, // Array of keywords for the channel
  country: { type: String }, 
  owner: { type: String, required: false }, 
  ownerEmail: { type: String, required: false }, 
  references: { type: [String], default: [] }, 
  addedBy: { type: String, required: false }, 
  privilegies: { type: String, required: false }, 
  publishedAt: { type: Date }, 
  snapshopUpdatedAt: { type: Date }, 
  subscriberCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 }, 
  videoCount: { type: Number, default: 0 }, 
  topVideos: { 
    type: [VideoSchema], 
    default: [], 
    validate: [v => v.length <= 10, '{PATH} exceeds the limit of 10'], 
  }, // Array of top 10 videos
  latestVideos: { 
    type: [VideoSchema], 
    default: [], 
    validate: [v => v.length <= 10, '{PATH} exceeds the limit of 10'], 
  }, // Array of latest 10 videos
}, { timestamps: true });



module.exports = mongoose.model('Channel', ChannelSchema);
