import React, { useState } from 'react';
import { User, Channel } from '../types';
import GroupedBarChart from './compareChatBar';
import { motion } from "framer-motion";

interface ComparisonProps {
  onClick: (channelName: string) => void;
  user: User;
  channel: Channel;
  index: number;
  owner: boolean;
  custom: number;
  selectedChannel?: Channel;
  userChannel?: Channel;
}

const ComparisonCard: React.FC<ComparisonProps> = ({ selectedChannel, userChannel, user }) => {

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [channelUpdated, setChannelUpdated] = useState<boolean>(false);
  const [outdatedList, setOutdatedList] = useState<Channel[] | []>(user.outdatedChannels);

  const updated = (dateString: Date): boolean => {
 console.log('InputDate is: '+dateString);
    const inputDate = new Date(dateString);
    const today = new Date();
    const updateValue = 'Input Year: '+inputDate.getFullYear() +' This year: '+today.getFullYear()+' Input month: '+inputDate.getMonth()+' This Month: '+today.getMonth()+' Input Day: '+inputDate.getDate()+' Today is:'+today.getDate();
    const Updated =  inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate();
    return (
      Updated
    );

  };

  if (!selectedChannel || !userChannel) {
    return <div>Loading channel data...</div>;
  }

  const handleSnapshot = async (channelId: string | null) => {
    setIsUpdating(true);
    try {
      const response = await fetch('http://localhost:4000/api/channels/snapshot-channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          updateChannel: channelId, 
          userId: user.id,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Snapshot taken:', result);
  
        // Update `snapshotUpdatedAt` locally to reflect the change
       // selectedChannel.snapshotUpdatedAt = new Date().toISOString();
       setChannelUpdated(updated(selectedChannel.snapshotUpdatedAt));
      
      
      
      } else {
        console.error(`Failed to take snapshot: ${await response.json()}`);
      }
    } catch (error) {
      console.error('Error taking snapshot:', error);
    } finally {
      console.log(channelUpdated);
      setIsUpdating(false);
    }
  };
  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  // FIX: Ensure conditional rendering happens correctly
  if (isUpdating) {
    return <div>Updating channel data...</div>;
  }

  return (
    <>
      <GroupedBarChart userVideoData={userChannel.latestVideos} compareVideoData={selectedChannel.latestVideos} />
      <motion.div
        className="comparison-card"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        {/* Header Section */}
        <div className="comparison-header">
          <motion.div
            className="channel-info"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <motion.img
              src={userChannel.profile}
              alt={userChannel.title}
              className="channel-image"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            />
            <p className="channel-title">{userChannel.title}</p>
            <p className="channel-handle">{userChannel.handle}</p>
          </motion.div>

          <motion.p
            className="vs-label"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            VS
          </motion.p>

          <motion.div
            className="channel-info"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <motion.img
              src={selectedChannel.profile}
              alt={selectedChannel.title}
              className="channel-image"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            />
            <p className="channel-title">{selectedChannel.title}</p>
            <p className="channel-handle">{selectedChannel.handle}</p>
            <div>
            <div>{selectedChannel.subs > 1000 ? 
            
            selectedChannel.subs > 1000 && selectedChannel.subs <= 10000 ? 'Smarter':'Smartest' 
            
            : 'Smart'}</div>
  { updated(selectedChannel.snapshotUpdatedAt) ? (
    <span>Updated: {new Date(selectedChannel.snapshotUpdatedAt).toLocaleDateString()}</span>
  ) : (
    <div onClick={() => handleSnapshot(selectedChannel?.channelId)}>UPDATE</div>
  )}
</div>
        </motion.div>
        </div>
        {/* Comparison Data */}
        <div className="comparison-content">
          {[
            { label: "Subscribers", userValue: userChannel.subscriberCount, selectedValue: selectedChannel.subs },
            { label: "Views", userValue: userChannel.viewCount, selectedValue: selectedChannel.views },
            { label: "Videos", userValue: userChannel.videoCount, selectedValue: selectedChannel.videos },
            { label: "Country", userValue: userChannel.country, selectedValue: selectedChannel.country },
            {
              label: "Created",
              userValue: userChannel.publishedAt?.split("T")[0],
              selectedValue: selectedChannel.publishedAt?.split("T")[0],
            },
          ].map(({ label, userValue, selectedValue }, idx) => (
            <motion.div
              className="comparison-row"
              key={idx}
              variants={rowVariants}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * idx }}
            >
              <motion.span className="user-data"
                variants={rowVariants}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * idx }}
              >{userValue?.toLocaleString() || "-"}</motion.span>
              <motion.p
                variants={rowVariants}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * idx }}
              >{label}</motion.p>
              <motion.span className="selected-data"
                variants={rowVariants}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * idx }}
              >{!selectedChannel.owner ? selectedValue?.toLocaleString() || '-' : userValue?.toLocaleString()}</motion.span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default ComparisonCard;
