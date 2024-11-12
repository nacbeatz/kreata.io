// src/models/channelModel.js
const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  thumbnailUrl: { type: String },
  subscriberCount: { type: Number }
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
