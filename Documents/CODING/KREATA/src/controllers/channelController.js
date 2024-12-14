// src/controllers/channelController.js
const Channel = require('../models/ytChannelModel');
const Subscriptions = require('../models/subscriptionsModel.js');
const Snapshots = require('../models/snapshotsModel.js');
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
  const { channelId: channel_Id, userId, userEmail } = req.body;

  try {
    const savedChannels = [];
    let existingChannel = await Channel.findOne({ channelId: channel_Id });

    // Check the user's subscription and credits
    const existingSubscription = await Subscriptions.findOne({ userId });
    if (!existingSubscription || existingSubscription.credits <= 0) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient credits to add a new channel. Please upgrade your plan.',
      });
    }

    // Fetch channel details from the YouTube API
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channel_Id}&key=${process.env.YT_DATA_API_KEY}`;
    const response = await fetch(channelUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch channel details: ${response.statusText}`);
    }

    const channelData = await response.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      throw new Error('No channel data found for the given ID.');
    }

    const lastTen = await lastTenVideos(channel_Id, process.env.YT_DATA_API_KEY);
    const topTen = await topTenVideos(channel_Id, process.env.YT_DATA_API_KEY);

    const extractedKeywords = extractKeywords(
      channel.snippet.title,
      channel.snippet.description
    );
    console.log('Channel Keywords: ' + extractedKeywords);

    if (existingChannel) {
      // Check if the current user is the legal owner by verifying the email
      if (userEmail === channel.snippet.ownerEmail) {
        console.log('User verified as legal owner. Updating channel details...');
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
        existingChannel.updatedAt = Date.now();
        await existingChannel.save();
        savedChannels.push(existingChannel);
        console.log('Channel updated successfully.');
      } else {
        // User is not the legal owner, associate them in references
        console.log(`User is not the legal owner. Associating channel with the current user.`);
        if (!existingChannel.references.includes(userId)) {
          existingChannel.references.push(userId); // Add current user's ID to references
          await existingChannel.save();
          console.log('Channel associated with the current user.');
        } else {
          console.log('Channel already associated with the current user.');
        }
      }
    } else {
      // Create a new channel if it doesn't exist
      const isLegalOwner = userEmail === channel.snippet.ownerEmail;
      const newChannel = new Channel({
        channelId: channel.id,
        title: channel.snippet.title,
        handle: channel.snippet.customUrl,
        description: channel.snippet.description,
        keywords: extractedKeywords,
        owner: isLegalOwner ? userId : null, // Set owner only if user is verified
        ownerEmail: channel.snippet.ownerEmail, // Save the owner's email
        references: [userId], // Add current user to references
        addedBy: userId, // Track who initially added the channel
        thumbnailUrl: channel.snippet.thumbnails.medium.url,
        subscriberCount: channel.statistics.subscriberCount,
        profile: channel.snippet.thumbnails.default.url,
        country: channel.snippet.country,
        publishedAt: new Date(channel.snippet.publishedAt.split('T')[0]),
        viewCount: channel.statistics.viewCount,
        videoCount: channel.statistics.videoCount,
        latestVideos: lastTen,
        topVideos: topTen,
      });

      await newChannel.save();
      console.log('New channel created and saved.');
      savedChannels.push(newChannel);
    }
    // Deduct 1 credit from the user's subscription
    existingSubscription.credits -= 3;  
    existingSubscription.usage += 3;
    await existingSubscription.save();
    console.log('1 credit deducted for adding a channel.');

    res.status(200).json({
      success: true,
      message: 'Channel added successfully.',
      channels: savedChannels,
    });
  } catch (error) {
    console.error('Error adding channel:', error.message);
    res.status(500).json({ success: false, message: 'This channel cannot be added', error: error.message });
  }
};


const takeSnapshot = async (req, res) => {
  const { updateChannel, userId } = req.body;
  try {
    // Check if a snapshot document for this user and channel exists
    const existingSnapshot = await Snapshots.findOne({
      channelId: updateChannel,
      userId: userId,
    });

    // Fetch public channel statistics
    const channelStatsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${updateChannel}&key=${process.env.YT_DATA_API_KEY}`;
    const channelResponse = await fetch(channelStatsUrl);

    if (!channelResponse.ok) {
      throw new Error(`Failed to fetch channel statistics: ${channelResponse.statusText}`);
    }

    const channelData = await channelResponse.json();
    if (!channelData.items || channelData.items.length === 0) {
      return res.status(404).json({ success: false, message: 'Channel not found.' });
    }
    const channelStats = channelData.items[0].statistics;

    // Fetch the last 10 videos
    const lastTenUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${updateChannel}&maxResults=10&order=date&type=video&key=${process.env.YT_DATA_API_KEY}`;
    const lastTenResponse = await fetch(lastTenUrl);

    if (!lastTenResponse.ok) {
      throw new Error(`Failed to fetch videos: ${lastTenResponse.statusText}`);
    }

    const lastTen = await lastTenResponse.json();
    const videoIds = lastTen.items.map((item) => item.id.videoId);

    if (videoIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No videos found for the channel.',
      });
    }

    // Fetch video statistics
    const videoStatsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds.join(',')}&key=${process.env.YT_DATA_API_KEY}`;
    const videoResponse = await fetch(videoStatsUrl);

    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video details: ${videoResponse.statusText}`);
    }

    const videoStats = await videoResponse.json();

    // Extract details for most-viewed videos
    const mostViewedVideos = videoStats.items.map((video) => ({
      videoId: video.id,
      title: video.snippet.title,
      viewCount: parseInt(video.statistics.viewCount, 10) || 0,
      likeCount: parseInt(video.statistics.likeCount, 10) || 0,
      commentCount: parseInt(video.statistics.commentCount, 10) || 0,
    }));

    // Prepare snapshot data
    const snapshot = {
      subscriberCount: channelStats.subscriberCount || 0,
      viewCount: channelStats.viewCount || 0,
      videoCount: channelStats.videoCount || 0,
      rpm: 2.5, // Placeholder
      category: existingSnapshot ? existingSnapshot.category : 'Unknown',
      mostViewedVideos,
      takenAt: new Date(),
      takenBy: userId,
    };

    if (existingSnapshot) {
      // Append the new snapshot data to the snapshotData array
      existingSnapshot.snapshotData.push(snapshot);
      await existingSnapshot.save();
      console.log('New snapshot pushed to existing snapshots.');
    } else {
      // Create a new snapshot document if it doesn't exist
      const newSnapshot = new Snapshots({
        channelId: updateChannel,
        userId: userId,
        snapshotData: [snapshot],
      });

      await newSnapshot.save();
      console.log('New snapshot created.');
    }

    res.status(200).json({
      success: true,
      message: 'Snapshot taken successfully.',
    });
  } catch (error) {
    console.error('Error in takeSnapshot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to take snapshot.',
      error: error.message,
    });
  }
};

module.exports = {
  saveChannels,
  addChannel,takeSnapshot,
};
