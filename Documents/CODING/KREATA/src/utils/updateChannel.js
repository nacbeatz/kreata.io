const takeSnapshot = async (channelId, userId, apiKey) => {
    try {
      const channel = await Channel.findOne({ channelId });
  
      if (!channel) {
        console.error('Channel not found in the database.');
        return;
      }
  
      // Fetch the latest 10 videos
      const lastTenUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`;
      const lastTenResponse = await fetch(lastTenUrl);
  
      if (!lastTenResponse.ok) {
        throw new Error(`Failed to fetch videos: ${lastTenResponse.statusText}`);
      }
  
      const lastTen = await lastTenResponse.json();
      const videoIds = lastTen.items.map((item) => item.id.videoId);
  
      if (videoIds.length === 0) {
        console.log('No videos found for the provided channel ID.');
        return;
      }
  
      // Fetch video details
      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${apiKey}`;
      const videoResponse = await fetch(videoUrl);
  
      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video details: ${videoResponse.statusText}`);
      }
  
      const videos = await videoResponse.json();
  
      // Extract details for most-viewed videos
      const mostViewedVideos = videos.items.map((video) => ({
        videoId: video.id,
        title: video.snippet.title,
        viewCount: parseInt(video.statistics.viewCount, 10) || 0,
        likeCount: parseInt(video.statistics.likeCount, 10) || 0,
        commentCount: parseInt(video.statistics.commentCount, 10) || 0,
        shareCount: parseInt(video.statistics.shareCount || 0, 10),
        ctr: parseFloat(video.statistics.impressionClickThroughRate || 0),
      }));
  
      // Fetch channel analytics data
      const analyticsUrl = `https://www.googleapis.com/youtube/v3/analytics?dimensions=day&metrics=views,comments,favoritesAdded,favoritesRemoved,likes,dislikes,shares,estimatedMinutesWatched,impressions,impressionClickThroughRate,averageViewDuration,subscribersGained,subscribersLost&ids=channel==${channelId}&key=${apiKey}`;
      const analyticsResponse = await fetch(analyticsUrl);
  
      if (!analyticsResponse.ok) {
        throw new Error(`Failed to fetch channel analytics: ${analyticsResponse.statusText}`);
      }
  
      const analytics = await analyticsResponse.json();
  
      const metrics = {
        views: analytics.views || 0,
        comments: analytics.comments || 0,
        favoritesAdded: analytics.favoritesAdded || 0,
        favoritesRemoved: analytics.favoritesRemoved || 0,
        likes: analytics.likes || 0,
        dislikes: analytics.dislikes || 0,
        shares: analytics.shares || 0,
        estimatedMinutesWatched: analytics.estimatedMinutesWatched || 0,
        impressions: analytics.impressions || 0,
        impressionClickThroughRate: parseFloat(analytics.impressionClickThroughRate || 0),
        averageViewDuration: parseInt(analytics.averageViewDuration || 0, 10),
        subscribersGained: analytics.subscribersGained || 0,
        subscribersLost: analytics.subscribersLost || 0,
      };
  
      // Fetch additional details like RPM and category (mocked here, adjust based on actual API)
      const fetchedRPM = 2.5; // Placeholder for RPM (replace with actual API logic if available)
      const fetchedCategory = channel.category || 'Unknown';
  
      // Create snapshot
      const snapshot = {
        subscriberCount: channel.subscriberCount,
        viewCount: channel.viewCount,
        videoCount: channel.videoCount,
        rpm: fetchedRPM,
        category: fetchedCategory,
        mostViewedVideos,
        metrics,
        takenAt: new Date(),
        takenBy: channelId,
      };
  
      // Save snapshot to the channel
      channel.snapshots.push(snapshot);
      await channel.save();
  
      console.log('Snapshot saved successfully!');
      return snapshot;
    } catch (error) {
      console.error('Error in takeSnapshot:', error);
    }
  };
  



  const takeSnapshots = async (req, res) => {
    const { updateChannel, userId } = req.body;
  
    try {
      // Check if a snapshot document for this user and channel exists
      const existingSnapshot = await Snapshots.findOne({
        channelId: updateChannel,
        userId: userId,
      });
  
      // Fetch the latest 10 videos
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
          message: 'No videos found for the channel.'
        });
      }
  
      // Fetch video details
      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${process.env.YT_DATA_API_KEY}`;
      const videoResponse = await fetch(videoUrl);
  
      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video details: ${videoResponse.statusText}`);
      }
  
      const videos = await videoResponse.json();
  
      // Extract details for most-viewed videos
      const mostViewedVideos = videos.items.map((video) => ({
        videoId: video.id,
        title: video.snippet.title,
        viewCount: parseInt(video.statistics.viewCount, 10) || 0,
        likeCount: parseInt(video.statistics.likeCount, 10) || 0,
        commentCount: parseInt(video.statistics.commentCount, 10) || 0,
        shareCount: parseInt(video.statistics.shareCount || 0, 10),
        ctr: parseFloat(video.statistics.impressionClickThroughRate || 0),
      }));
  
      // Fetch channel analytics data
      const startDate = '2024-01-01';
      const endDate = new Date().toISOString().split('T')[0]; 
      const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&metrics=views,comments,favoritesAdded,favoritesRemoved,likes,dislikes,shares,estimatedMinutesWatched,impressions,impressionClickThroughRate,averageViewDuration,subscribersGained,subscribersLost&ids=channel==${updateChannel}&startDate=${startDate}&endDate=${endDate}&key=${process.env.YT_DATA_API_KEY}`;
      const analyticsResponse = await fetch(analyticsUrl);
  
      if (!analyticsResponse.ok) {
        throw new Error(`Failed to fetch channel analytics: ${analyticsResponse.statusText}`);
      }
  
      const analytics = await analyticsResponse.json();
  
      const channelMetrics = {
        views: analytics.views || 0,
        comments: analytics.comments || 0,
        favoritesAdded: analytics.favoritesAdded || 0,
        favoritesRemoved: analytics.favoritesRemoved || 0,
        likes: analytics.likes || 0,
        dislikes: analytics.dislikes || 0,
        shares: analytics.shares || 0,
        estimatedMinutesWatched: analytics.estimatedMinutesWatched || 0,
        impressions: analytics.impressions || 0,
        impressionClickThroughRate: parseFloat(analytics.impressionClickThroughRate || 0),
        averageViewDuration: parseInt(analytics.averageViewDuration || 0, 10),
        subscribersGained: analytics.subscribersGained || 0,
        subscribersLost: analytics.subscribersLost || 0,
      };
  
      // Prepare snapshot data
      const snapshot = {
        subscriberCount: existingSnapshot ? existingSnapshot.subscriberCount : 0,
        viewCount: existingSnapshot ? existingSnapshot.viewCount : 0,
        videoCount: existingSnapshot ? existingSnapshot.videoCount : 0,
        rpm: 2.5, // Placeholder
        category: existingSnapshot ? existingSnapshot.category : 'Unknown',
        mostViewedVideos,
        channelMetrics,
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
          snapshotData: [snapshot], // Use the new snapshot
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
  