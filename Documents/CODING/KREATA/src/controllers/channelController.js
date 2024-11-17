// src/controllers/channelController.js
const Channel = require('../models/ytChannelModel');
const { lastTenVideos, topTenVideos } = require('../utils/fetchVideos');
const dotenv = require('dotenv').config();

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
const addChannel = async (req, res) => {
  const channel_Id = req.body.channelId;
  const userId = req.body.user.id;

  try {
    const savedChannels = [];
    let existingChannel = await Channel.findOne({ channelId: channel_Id });

    if (!existingChannel) {
      console.log('Channel does not exist. Fetching details...');

      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channel_Id}&key=${process.env.YT_DATA_API_KEY}`;
      const response = await fetch(channelUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch channel details: ${response.statusText}`);
      }

      const channelData = await response.json();
      const channel = channelData.items[0];

      if (!channel) {
        throw new Error('No channel data found for the given ID.');
      }

  
      const lastTen = await lastTenVideos(channel_Id, process.env.YT_DATA_API_KEY);
      const topTen = await topTenVideos(channel_Id, process.env.YT_DATA_API_KEY);


      const newChannel = new Channel({
        channelId: channel.id,
        title: channel.snippet.title,
        handle: channel.snippet.customUrl,
        description: channel.snippet.description,
        owner: userId,
        thumbnailUrl: channel.snippet.thumbnails.medium.url,
        subscriberCount: channel.statistics.subscriberCount,
        profile: channel.snippet.thumbnails.default.url,
        country: channel.snippet.country,
        publishedAt: channel.snippet.publishedAt.split('T')[0],
        viewCount: channel.statistics.viewCount,
        videoCount: channel.statistics.videoCount,
        latestVideos: lastTen,
        topVideos: topTen,
      });

      console.log('Saving channel to database...');
      await newChannel.save();
      savedChannels.push(newChannel);
      console.log('Channel saved successfully.');
    } else {
      console.log('Channel already exists.');
      savedChannels.push(existingChannel);
    }

    res.status(200).json(savedChannels);
  } catch (error) {
    console.error('Error adding channel:', error);
    res.status(500).json({ message: 'This channel cannot be added' });
  }
};


module.exports = {
  saveChannels, addChannel
};
