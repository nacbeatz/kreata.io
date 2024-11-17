// src/controllers/channelController.js
const Channel = require('../models/ytChannelModel');
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
    //Channel does not exist!
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channel_Id}&key=${process.env.YT_DATA_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
          console.log('Fetching url went wrong');
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const channel = await response.json();
        const newChannel = new Channel({
          channelId: channel.items[0].id,
          title: channel.items[0].snippet.title,
          handle: channel.items[0].snippet.customUrl,
          description: channel.items[0].snippet.description,
          owner: userId,
          thumbnailUrl: channel.items[0].snippet.thumbnails.medium.url,
          subscriberCount: channel.items[0].statistics.subscriberCount,
          profile: channel.items[0].snippet.thumbnails.default.url,
          country:channel.items[0].snippet.country ,
          publishedAt: channel.items[0].snippet.publishedAt.split('T')[0],
          subscriberCount: channel.items[0].statistics.subscriberCount,
          viewCount:channel.items[0].statistics.viewCount,
          videoCount:channel.items[0].statistics.videoCount,
        
        });
         //'Fetched channel saved successfuly'
        await newChannel.save();
        savedChannels.push(newChannel);
      } catch (error) {
        //Error Fetching the YT DATA API;
        console.error('Error fetching Channel Data:', error);
        return [];
    }

} else {
  // 'Channel exist already!
        savedChannels.push(existingChannel);
      }
    res.status(200).json(savedChannels);
  } catch (error) {
    // Error Adding Channel
    console.error('Error adding channel:', error);
    res.status(500).json({ message: 'This channel cannot be added' });
  }
};

module.exports = {
  saveChannels, addChannel
};
