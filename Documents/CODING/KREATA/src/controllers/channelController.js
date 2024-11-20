// src/controllers/channelController.js
const Channel = require('../models/ytChannelModel');
const { lastTenVideos, topTenVideos } = require('../utils/fetchVideos');
const extractKeywords = require('../utils/keywordExtractor.js');
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
        // If channel exists, update its fields
        existingChannel.title = channel.snippet.title;
        existingChannel.description = channel.snippet.description;
        existingChannel.thumbnailUrl = channel.snippet.thumbnails.medium.url;
        existingChannel.subscriberCount = channel.statistics.subscriberCount;
        await existingChannel.save();
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

    // Fetch channel details from the YouTube API
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

    const extractedKeywords = extractKeywords(channel.snippet.title, channel.snippet.description);
    console.log('Channel Keywords: '+extractedKeywords);

    if (!existingChannel) {
      // If the channel does not exist, create a new one
      console.log('Channel does not exist. Creating a new one...');

      const newChannel = new Channel({
        channelId: channel.id,
        title: channel.snippet.title,
        handle: channel.snippet.customUrl,
        description: channel.snippet.description,
        keywords: extractedKeywords,
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

      await newChannel.save();
      savedChannels.push(newChannel);
      console.log('Channel saved successfully.');
    } else {
      // If the channel exists, update its fields
      console.log('Channel already exists. Updating details...');

      existingChannel.title = channel.snippet.title;
      existingChannel.handle = channel.snippet.customUrl;
      existingChannel.description = channel.snippet.description;
      existingChannel.keywords = extractedKeywords;
      existingChannel.thumbnailUrl = channel.snippet.thumbnails.medium.url;
      existingChannel.subscriberCount = channel.statistics.subscriberCount;
      existingChannel.viewCount = channel.statistics.viewCount;
      existingChannel.videoCount = channel.statistics.videoCount;
      existingChannel.latestVideos = lastTen;
      existingChannel.topVideos = topTen;

      await existingChannel.save();
      savedChannels.push(existingChannel);
      console.log('Channel updated successfully.');
    }

    res.status(200).json(savedChannels);
  } catch (error) {
    console.error('Error adding channel:', error.message);
    res.status(500).json({ message: 'This channel cannot be added' });
  }
};


module.exports = {
  saveChannels,
  addChannel,
};
