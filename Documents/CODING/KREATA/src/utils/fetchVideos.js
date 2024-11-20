const extractKeywords = require('../utils/keywordExtractor.js');



const lastTenVideos = async (channelId, apiKey) => {
    // Step 1: Get video IDs using the `search` endpoint
    const lastTenUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`;

  
    try {
      const lastTenResponse = await fetch(lastTenUrl);
      if (!lastTenResponse.ok) {
        throw new Error(`Failed to fetch videos from channel: ${lastTenResponse.statusText}`);
      }
  
      const lastTen = await lastTenResponse.json();
      const videoIds = lastTen.items.map((item) => item.id.videoId);
  
      if (videoIds.length === 0) {
        console.log('No videos found for the provided channel ID.');
        return [];
      }
  
      // Step 2: Fetch video details using the `videos` endpoint
      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${apiKey}`;
      const videoResponse = await fetch(videoUrl);
  
      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video details: ${videoResponse.statusText}`);
      }
  
      const videoData = await videoResponse.json();
      return videoData.items.map((video) => ({
        videoId: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        tags: video.snippet.tags || [],
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        commentCount: video.statistics.commentCount,
        thumbnailUrl: video.snippet.thumbnails.medium.url,
        videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
      }));
    } catch (error) {
      console.error('Error fetching last 10 videos:', error);
      return [];
    }
  };


  const topTenVideos = async (channelId, apiKey) => {
    // Step 1: Get video IDs using the `search` endpoint
    const lastTenUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=viewCount&type=video&key=${apiKey}`;

  
    try {
      const topTenResponse = await fetch(lastTenUrl);
      if (!topTenResponse.ok) {
        throw new Error(`Failed to fetch videos from channel: ${topTenResponse.statusText}`);
      }
  
      const topTen = await topTenResponse.json();
      const videoIds = topTen.items.map((item) => item.id.videoId);
  
      if (videoIds.length === 0) {
        console.log('No videos found for the provided channel ID.');
        return [];
      }
  
      // Step 2: Fetch video details using the `videos` endpoint
      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${apiKey}`;
      const videoResponse = await fetch(videoUrl);
  
      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video details: ${videoResponse.statusText}`);
      }
  
      const videoData = await videoResponse.json();
      return videoData.items.map((video) => {
        // Extract keywords from title and description (if the function exists)
        const extractedKeywords = extractKeywords(video.snippet.title, video.snippet.description);
        console.log('Video Extracted Keywords:', extractedKeywords);
  
        // Return structured video details
        return {
          videoId: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          keywords:extractedKeywords, 
          tags: video.snippet.tags || [],
          publishedAt: video.snippet.publishedAt,
          viewCount: video.statistics.viewCount,
          likeCount: video.statistics.likeCount,
          commentCount: video.statistics.commentCount,
          thumbnailUrl: video.snippet.thumbnails.medium.url,
          videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
          
        };
      });
    } catch (error) {
      console.error('Error fetching last 10 videos:', error);
      return [];
    }
  };
 
  const getTopPerformingVideos = async (accessToken, channelId) => {
    const response = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?metrics=views,likes,dislikes&dimensions=video&sort=-views&filters=channel==${channelId}&maxResults=5&access_token=${accessToken}`
    );
    const data = await response.json();
    return data;
  };
  const getChannelAnalytics = async (accessToken, channelId) => {
    const response = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?metrics=views,likes,dislikes,averageViewDuration,estimatedMinutesWatched&dimensions=day&filters=channel==${channelId}&access_token=${accessToken}`
    );
    const data = await response.json();
    return data;
  };
  

  module.exports = { lastTenVideos, topTenVideos };