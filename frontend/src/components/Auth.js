import React, { useState } from 'react';
import { authService } from '../services/api';

const Auth = ({ login, register }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const userData = { username, password };
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      console.log(`Attempting to ${isLogin ? 'login' : 'register'}...`);
      
      // Use the API service
      const authFunction = isLogin ? authService.login : authService.register;
      const data = await authFunction(username, password);
      console.log('API response:', data);
      
      if (data.token) {
        if (isLogin) {
          login({ ...userData, token: data.token });
        } else {
          register({ ...userData, token: data.token });
        }
      } else {
        setError('No authentication token received');
      }
    } catch (err) {
      console.error('Auth component error:', err);
      setError('Authentication failed. Please check your connection.');
    }
  };

  return (
    <div className="form-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default Auth;