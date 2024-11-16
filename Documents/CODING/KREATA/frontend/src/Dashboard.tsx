import React, { useState, useEffect, useRef } from 'react';
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

const Dashboard: React.FC<DashboardProps> = ({ user, credits, isFirstTime, onLogout }) => {
  const [addChannel, setAddChannel] = useState<boolean>(false);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [firstLogin, setFirstLogin] = useState<boolean | null>(isFirstTime);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelUrl(e.target.value);
  };

  const handleAddChannel = (e: React.ChangeEvent<HTMLInputElement>) => {
    alert(channelUrl);
    setAddChannel(false);
    setFirstLogin(false); 
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
      <form className="form">
                    
                    <div className="form-group">
                      <label htmlFor="username" className="label">Channel ID</label>
                      <input
                        id="username"
                        type="text"
                        className="input"
                        value={channelUrl !== null ? channelUrl : ''} 
                        ref={inputRef}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  <button type="submit" className="button" disabled={isAdding}>
                {isAdding ? 'Adding Channel' : 'Add'}
              </button>
      </form>              
      {/* Replace this placeholder with an actual form */}
   
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
