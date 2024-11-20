import React, { useState } from 'react';
import { User } from '../types';

interface LoginFormProps {
  onLogin: (user: { username: string; password: string, role: string }) => void;
  onRegister: (user: { username: string; email: string  ; password: string; role: string }) => void; // Include `email`
}


const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

 
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const response = await fetch(`http://localhost:4000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isLogin ? { username, password } : { username, password, role, name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        localStorage.setItem('authToken', data.token);

        if (isLogin) {
          setLoggedInUser({
            username,
            password,
            role: data.role || 'user', 
            channels: data.channels,
          });
          console.log(data.channels)
          onLogin({ username,password, role: data.role || 'user' });
        } else {
          onRegister({ username, email, password, role });
        }
      } else {
        setMessage(data.message || `${isLogin ? 'Login' : 'Registration'} failed`);           
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open('http://localhost:4000/api/auth/google', '_self');
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setUsername('');
    setPassword('');
    setRole('');
  };

  return (
    <>
      <div className="app-container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{isLogin ? 'Login' : 'Register'}</h2>
            <p className="card-description">
              {isLogin ? 'Sign in to your account' : 'Create a new account to get started'}
            </p>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="form">
                    
              <div className="form-group">
                <label htmlFor="username" className="label">Username</label>
                <input
                  id="username"
                  type="text"
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="label">Password</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {!isLogin && (
                <>
                
            <div className="form-group">
                <label htmlFor="name" className="label">name</label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="eamil" className="label">E-mail</label>
                <input
                  id="email"
                  type="text"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>   
                
              <div className="form-group">
                  <label htmlFor="role" className="label">Role</label>
                  <select
                    id="role"
                    className="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="creator">Creator</option>
                  </select>
                </div>
                </>
                
              )}
              <button type="submit" className="button" disabled={isLoading}>
                {isLoading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>
          </div>
          <div className="card-footer">
            {message && (
              <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'}`}>
                <p className="alert-title">{isSuccess ? 'Success' : 'Error'}</p>
                <p className="alert-description">{message}</p>
              </div>
            )}
            <p className="toggle-form">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={toggleForm} className="toggle-button">
                {isLogin ? 'Register' : 'Login'}
              </button>
              <button onClick={handleGoogleLogin}>Login with Google</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
