import React, { useState, useEffect, useRef } from 'react';

interface Channel {
  id: {
    channelId: string;
  };
  snippet: {
    title: string;
    description: string;
  };
  statistics?: {
    subscriberCount: string;
    viewCount: string;
  };
}

const apiKey = 'AIzaSyCotuERGb3NbjuaY32yi-HmYVgk5v0Mbsg';

const ContentCreatorsDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('Rwanda');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);

  const chartRef = useRef(null);
  const myChartInstance = useRef(null);

  useEffect(() => {
    searchForRwandanChannels();
  }, []);

  const searchForRwandanChannels = async (nextPageToken = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&type=channel&key=${apiKey}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch channels');
      const data: { items: Channel[] } = await response.json();

      // Add explicit type for `item`
      const rwandanChannels = data.items.filter((item: Channel) => 
        item.snippet.title.includes('Rwanda') || item.snippet.description.includes('Rwanda')
      );

      // Add explicit type for `channel`
      const channelDetails = await Promise.all(rwandanChannels.map((channel: Channel) => 
        fetchChannelDetails(channel.id.channelId)
      ));

      setChannels(channelDetails);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching channels');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChannelDetails = async (channelId: string) => {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`);
      if (!response.ok) throw new Error('Failed to fetch channel details');
      const data = await response.json();
      return data.items[0];
    } catch (error) {
      console.error('Error fetching channel details:', error);
      throw error;
    }
  };

  return (
    <div>
      {/* Render content here */}
    </div>
  );
};

export default ContentCreatorsDashboard;
