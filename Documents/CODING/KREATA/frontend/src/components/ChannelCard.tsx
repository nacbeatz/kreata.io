// ChannelCard.js
import React from "react";
import { motion } from "framer-motion";
import { User, Channel } from '../types';

interface ChannelCardProps {
    user : User;
    channel: Channel;
    index: number;
    onClick: (channelName: string) => void;
    owner: boolean;
    custom:number;
    selectedChannel: Channel | null; 
    userChannel:Channel | null;
  }

const channelCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index:number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1, // Staggered animation for each card
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  }),
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, index, onClick, owner }) => {

    return (
      <motion.div
        className="card"
        custom={index}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        variants={channelCardVariants}
        onClick={() => onClick(channel.name)}
      >
        <motion.div
          className="card-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >

          <div className="image-container">
            <motion.img
              src={channel.profile}
              alt={channel.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
            />
            { owner &&<div className="pro-channel">Pro</div>}
          </div>
          <motion.h2
            className="card-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            {channel.title}
          </motion.h2>
          <motion.p
            className="card-description"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            {channel.handle}
          </motion.p>
        
        </motion.div>
        {!owner &&<div className="channel-stats">
          <span>{channel.videoMade} Vid</span> | 
          <span>{channel.gainedViews} Views</span> | 
          <span>{channel.gainedSub} Subs</span>
          </div>}


      </motion.div>
    );
  };
  
  
  

export default ChannelCard;
