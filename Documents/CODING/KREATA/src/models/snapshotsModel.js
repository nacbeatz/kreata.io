const mongoose = require('mongoose');

const SnapshotSchema = new mongoose.Schema({
    channelId: { type: String, required: true },
    userId: { type: String, required: true },
    snapshotData: [
      {
        subscriberCount: { type: Number, default: 0 },
        viewCount: { type: Number, default: 0 },
        videoCount: { type: Number, default: 0 },
        rpm: { type: Number, default: 0 },
        category: { type: String, default: 'Unknown' },
        mostViewedVideos: [
          {
            videoId: { type: String, required: true },
            title: { type: String, required: true },
            viewCount: { type: Number, default: 0 },
            likeCount: { type: Number, default: 0 },
            commentCount: { type: Number, default: 0 },
            shareCount: { type: Number, default: 0 },
            ctr: { type: Number, default: 0 },
          },
        ],
        channelMetrics: {
          views: { type: Number, default: 0 },
          comments: { type: Number, default: 0 },
          favoritesAdded: { type: Number, default: 0 },
          favoritesRemoved: { type: Number, default: 0 },
          likes: { type: Number, default: 0 },
          dislikes: { type: Number, default: 0 },
          shares: { type: Number, default: 0 },
          estimatedMinutesWatched: { type: Number, default: 0 },
          impressions: { type: Number, default: 0 },
          impressionClickThroughRate: { type: Number, default: 0 },
          averageViewDuration: { type: Number, default: 0 },
          subscribersGained: { type: Number, default: 0 },
          subscribersLost: { type: Number, default: 0 },
        },
        takenAt: { type: Date, default: Date.now },
        takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
    updatedAt: { type: Date},
  });

  SnapshotSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });
  
  module.exports = mongoose.model('Snapshot', SnapshotSchema);
  