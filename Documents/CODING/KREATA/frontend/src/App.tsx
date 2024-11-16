import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Cookies from 'js-cookie';
import LoginForm from './components/LoginPage';
import { User } from './types';
import './App.css';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null); // Initialize as null
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    // Check if user is logged in by looking for cookies
    const userDetails = Cookies.get('userData');
    const authToken = Cookies.get('authToken');

    if (userDetails && authToken) {
      try {
        const parsedUser = JSON.parse(userDetails);
        setLoggedInUser(parsedUser);
        setIsFirstTime(parsedUser.isFirstLogin); // Parse and set `isFirstLogin`
        setCredits(parsedUser.credits || 0); // Default to 0 credits if not set
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }

    setIsLoading(false); // Done loading
  }, []);

  const handleLogin = async (user: { username: string; password: string }) => {
    console.log('User attempting to log in:', user);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Failed to log in');

      const userData = await response.json();

      // Update state with user data
      setLoggedInUser(userData.user);
      setIsFirstTime(userData.user.isFirstLogin); // Extract `isFirstLogin` from the response
      setCredits(userData.user.credits || 0);

      // Save token in localStorage for future use
      localStorage.setItem('authToken', userData.token);

      setIsLoading(false);
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (user: { username: string; email: string; password: string; role: string }) => {
    console.log('User attempting to register:', user);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Failed to register');

      const userData = await response.json();

      // Update state with user data
      setLoggedInUser(userData.user);
      setIsFirstTime(userData.user.isFirstLogin); // Set `isFirstLogin`
      setCredits(userData.user.credits || 0);

      setIsLoading(false);
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/auth/logout', { method: 'POST', credentials: 'include' });
      localStorage.removeItem('authToken');
      setLoggedInUser(null);
      setIsFirstTime(null);
      setCredits(0);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="logged-in-container">
      {isLoading ? (
        <span>Loading...</span>
      ) : error ? (
        <p>{error}</p>
      ) : loggedInUser ? (
        <div>
          <Dashboard
            user={loggedInUser}
            onLogout={handleLogout}
            isFirstTime={isFirstTime}
            credits={credits} 
          />
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
};

export default App;
