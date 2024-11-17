import React, { useState, useRef } from 'react';
import './App.css';

interface User {
  username?: string;
  role?: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => Promise<void>;
  isFirstTime: boolean | null;
  credits: number;
}


export interface Channel {
  id: string;
  title: string;
  description: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, credits, isFirstTime, onLogout }) => {
  const [addChannel, setAddChannel] = useState<boolean>(false);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [firstLogin, setFirstLogin] = useState<boolean | null>(isFirstTime);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelUrl(e.target.value);
  };

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from reloading the page
  
    if (!channelUrl) {
      alert('Please enter a valid Channel ID.');
      return;
    }
  
    setIsAdding(true); // Show loading state while adding the channel
  
    try {
      // Call the backend API to add the channel
      const response = await fetch('http://localhost:4000/api/channels/add-channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelId: channelUrl, user }),
      });
  
      if (response.ok) {
        alert('Channel added successfully!');
        setChannelUrl(''); // Clear the input field
        setAddChannel(false); // Return to dashboard
        setFirstLogin(false); // Mark first login as complete
      } else {
        const errorData = await response.json();
        alert(`Failed to add channel: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding channel:', error);
      alert('An error occurred while adding the channel. Please try again.');
    } finally {
      setIsAdding(false); // Reset loading state
    }
  };
  
  const showAddChannel = () => {
    setAddChannel(true);
    setFirstLogin(false); // Assume adding a channel completes the first-login process
  };
 
  // Helper method for rendering the dashboard
  const renderDashboard = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Dashboard</h2>
        <p className="card-description">
          Welcome, {user.username?.split(' ')[0] || 'Guest'}!
        </p>
      </div>
      <div className="card-content">
        <p>You have {credits} Credits.</p>
        <p>This is a {user.role?.toUpperCase() || 'USER'} dashboard.</p>
      </div>
      <div className="card-footer">
        <button onClick={onLogout} className="button">
          Logout
        </button>
      </div>
    </div>
  );

  // Helper method for rendering the "Add Channel" section
  const renderAddChannelForm = () => (
    <div className="card">
      <h1>Add your Channel</h1>
      <form className="form" onSubmit={handleAddChannel}>
        <div className="form-group">
          <label htmlFor="channelId" className="label">Channel ID</label>
          <input
            id="channelId"
            type="text"
            className="input"
            value={channelUrl || ''}
            ref={inputRef}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="button" disabled={isAdding}>
          {isAdding ? 'Adding Channel...' : 'Add'}
        </button>
      </form>
      <button onClick={() => setAddChannel(false)} className="button">
        Back to Dashboard
      </button>
    </div>
  );
  

  // Render logic
  if (firstLogin) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="card-header">
            <p className="card-description">
              Welcome, {user.username?.split(' ')[0] || 'Guest'}!
            </p>
          </div>
          <div className="card-footer">
            <button onClick={showAddChannel} className="button">
              Add Channel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {addChannel ? renderAddChannelForm() : renderDashboard()}
    </div>
  );
};

export default Dashboard;
