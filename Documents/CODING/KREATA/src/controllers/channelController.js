// src/controllers/channelController.js
const Channel = require('../models/ytChannelModel');

// Save channels to MongoDB
const saveChannels = async (req, res) => {
  const channels = req.body.channels;

  try {
    const savedChannels = [];

    for (const channel of channels) {
      let existingChannel = await Channel.findOne({ channelId: channel.id });

      if (!existingChannel) {
        const newChannel = new Channel({
          channelId: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnailUrl: channel.snippet.thumbnails.medium.url,
          subscriberCount: channel.statistics.subscriberCount,
        });
        await newChannel.save();
        savedChannels.push(newChannel);
      } else {
        savedChannels.push(existingChannel);
      }
    }

    res.status(200).json(savedChannels);
  } catch (error) {
    console.error('Error saving channels:', error);
    res.status(500).json({ message: 'Error saving channels' });
  }
};

module.exports = {
  saveChannels
};
