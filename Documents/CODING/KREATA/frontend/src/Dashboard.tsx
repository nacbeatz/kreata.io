import React, { useState, useRef,useEffect } from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import ChannelCard from "./components/ChannelCard";
import Modal from "./components/channelOverlayModal";
import { User, Channel } from './types';
import * as d3 from "d3";
import { channel } from 'diagnostics_channel';
import ComparisonCard from './components/comparisonCard';

interface DashboardProps {
  user: User;
  onLogout: () => Promise<void>;
  isFirstTime: boolean | null;
  credits: number;
  title?: string;


}

const Dashboard: React.FC<DashboardProps> = ({ user, isFirstTime, onLogout}) => {


  const [addChannel, setAddChannel] = useState<boolean>(false);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [updateChannel, setUpdateChannel] = useState<string | null>(
    user.channels && user.channels.length > 0 ? user.channels[0]?.channelId : null
  );
  const [channelName, setChannelName] = useState<string | null>(null);
  const [showChannels, setShowChannels] = useState<boolean | null>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [firstLogin, setFirstLogin] = useState<boolean | null>(!isFirstTime);
  const [hasChannel, setHasChannel] = useState<boolean | null>(user.hasChannel);
  const [userPlan, setUserPlan] = useState<string | null>(user.userPlan);
  const [mostViewed, setmostViewed] = useState<User | null>(user.channels[0].latestVideos);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef(null);

  useEffect(() => {
    
    if(hasChannel && user.channels[0]?.channelId){
      setUpdateChannel(user.channels[0].channelId);
    }
  }, [])

   // Render the D3 chart inside a useEffect
   useEffect(() => {
    const svgWidth = 600;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Clear existing chart (if re-rendering)
    d3.select(chartRef.current).select("svg").remove();

    // Create SVG container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Chart area group
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(mostViewed.map((d) => d.title))
      .range([0, width])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(mostViewed, (d) => d.viewCount) || 0])
      .range([height, 0]);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    chart.append("g").call(yAxis);

    // Bars
    chart
      .selectAll(".bar")
      .data(mostViewed)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.title) || 0)
      .attr("y", (d) => yScale(d.viewCount))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.viewCount))
      .attr("fill", "steelblue");

    // Add labels to bars
    chart
      .selectAll(".label")
      .data(mostViewed)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => (xScale(d.title) || 0) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.viewCount) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text((d) => d.viewCount.toLocaleString());
  }, [mostViewed]);
   
  const handleSelectedChannel = (channel: Channel) => {
    setSelectedChannel(channel); 
    setIsModalOpen(true);
  };
  
  // Enhanced animation variants

  const channelCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
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
  
  
  const imageVariants = {
    hover: {
      scale: 1.15,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
    }
  };

  const formInputVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      rotateX: -30
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelUrl(e.target.value);
  };



  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelUrl) {
      alert('Please enter a valid Channel ID.');
      return;
    }
    setIsAdding(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/channels/add-channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelId: channelUrl, userId: user.id, userEmail: user.email  }),
      });
    
      if (response.ok) {
        setChannelUrl('');
        setAddChannel(false);
        setFirstLogin(false);
      } else {
        const errorData = await response.json();
        console.error(`Failed to add channel: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding channel:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSnapshot = async (channelId : string | null) => {

    let updateChannel = channelId ;
    try {
      const response = await fetch('http://localhost:4000/api/channels/snapshot-channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          updateChannel, 
          userId: user.id 
        }),
      });
    
      if (response.ok) {
        const result = await response.json();
        console.log('Snapshot taken:', result);
        setIsUpdating(false);
      } else {
        const errorData = await response.json();
        console.error(`Failed to take snapshot: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error taking snapshot:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const showAddChannel = () => {
    setFirstLogin(false);
    setAddChannel(true);
  };

  const handleShowChannels = () => {
    setShowChannels(true);
    setAddChannel(false);
  };
  const handleShowDashboard = () => {
    setHasChannel(true) ;
    setShowChannels(false);
  };
  
  //Modal GOES HERE

  const renderDashboard = () => (
    <motion.div 
      className='Dashboard-container'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={pageTransition}
    >
  

  {showChannels && (
  
    <motion.button
            onClick={handleShowDashboard}
            className="back-button"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            Back
          </motion.button>
          )}

      {hasChannel ? (
        showChannels ? (

          <>
  <AnimatePresence>
      {isModalOpen && selectedChannel && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close the modal
          channel={selectedChannel} // Pass the selected channel
        />
      )}
    </AnimatePresence>

          <motion.div 
          className='channels-container'
          variants={containerVariants}
          layout
        >
          {user.channels?.map((channel, index) => (
            <ChannelCard
              key={channel.title}
              channel={channel}
              custom={index}
              owner={true}
              index={index}
              onClick={() => handleSelectedChannel(channel)}
              user={user} 
              selectedChannel={selectedChannel} 
              userChannel={user}
            />
          ))}
          {user.referenceChannels?.map((channel, index) => (
            <ChannelCard
              key={channel.title}
              custom={index}
              owner={false}
              channel={channel}
              index={index}
              onClick={() => handleSelectedChannel(channel)}
              userChannel={user}
              
            />
          ))}
        </motion.div>
        


        </>
        ) : (
          <>
          <motion.div 
            className="card"
            variants={containerVariants}
            layout
          >
            <motion.div 
              className="card-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="card-title">Dashboard</h2>
              <motion.p 
                className="card-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome, {user.username?.split(' ')[0] || 'Guest'}!
              </motion.p>
            </motion.div>
            <motion.div 
              className="card-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
        <p>
          You have {user.channels?.length ?? 0} PRO channel
          {user.channels?.length > 1 ? "s" : ""}.
        </p>

              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                This is a {userPlan?.toUpperCase() || 'FREE'} Plan.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                You have {user.credits} Credits Left
              </motion.p>
            </motion.div>
            <motion.button
              onClick={handleShowChannels}
              className="button"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              View Channels
            </motion.button>
            <motion.div 
              className="card-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                onClick={onLogout}
                className="button"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                Logout
              </motion.button>

              <motion.button
                onClick={showAddChannel}
                className={`button ${userPlan === 'free' && user.credits <= 2 ? 'disabled' : ''}`}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                disabled={userPlan === 'free' && user.credits <= 2}
              >
                Add Channel
              </motion.button>
              <div onClick={() => handleSnapshot(updateChannel)}>Update</div>
            </motion.div>

   
          </motion.div>
          <div className="chart-container" ref={chartRef} style={{ marginTop: "2rem" }}></div>
          </>
        )
      ) : (
        <motion.div
          variants={containerVariants}
          className="card"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Sorry! You have no channel yet
          </motion.p>
          <motion.button
                onClick={showAddChannel}
                className={`button ${userPlan === 'free' && user.credits <= 2 ? 'disabled' : ''}`}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                disabled={userPlan === 'free' && user.credits <= 2}
              >
                Add Channel
              </motion.button>


        </motion.div>
      )}
    </motion.div>
  );

  const renderAddChannelForm = () => (
    <motion.div 
      className="card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={pageTransition}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Add your Channel
      </motion.h1>
      <motion.form 
        className="form" 
        onSubmit={handleAddChannel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="form-group"
          variants={formInputVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.label 
            htmlFor="channelId" 
            className="label"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Channel ID
          </motion.label>
          <motion.input
            id="channelId"
            type="text"
            className="input"
            value={channelUrl || ''}
            ref={inputRef}
            onChange={handleInputChange}
            required
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileFocus={{ 
              scale: 1.02,
              boxShadow: "0px 0px 8px rgba(0,0,0,0.2)"
            }}
          />
        </motion.div>
        <motion.button
          type="submit"
          className="button"
          disabled={isAdding}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          {isAdding ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Adding Channel...
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Add
            </motion.span>
          )}
        </motion.button>
      </motion.form>
      <motion.button
        onClick={() => setAddChannel(false)}
        className="button"
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        Back to Dashboard
      </motion.button>
    </motion.div>
  );

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {firstLogin ? (
          <motion.div
            key="first-login"
            className="card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={pageTransition}
          >
            <motion.div 
              className="card-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.p 
                className="card-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome, {user.username?.split(' ')[0] || 'Guest'}!
              </motion.p>
            </motion.div>
            <motion.div 
              className="card-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={showAddChannel}
                className="button"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                Add Channel
              </motion.button>
              </motion.div>
            <motion.div 
              className="card-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={showAddChannel}
                className="button"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                Add Channel
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {selectedChannel ? (
             <>
                <motion.button
                  className="back-button"
                  onClick={() => setSelectedChannel(null)}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  ← Back
                </motion.button>
                <motion.div
  key="channel-detail"
  className="card channel-detail"
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={pageTransition}
>
  {selectedChannel && (
    <ComparisonCard selectedChannel={selectedChannel} userChannel={user?.channels[0]} user={user} />
  )}
</motion.div>

              </>
            ) 
            : 
            (
              addChannel ? renderAddChannelForm() : renderDashboard()
            )}
          </AnimatePresence>
        )}
      </AnimatePresence>
     
      {/* Loading Overlay */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            className="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="loading-spinner"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;