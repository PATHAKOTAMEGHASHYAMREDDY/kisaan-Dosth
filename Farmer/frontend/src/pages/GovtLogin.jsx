// src/components/GovtLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GovtLogin.css';

const GovtLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    mobileNo: '',
    email: '',
    password: '',
    officialId: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/govt/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Government Official Login successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        navigate('/govt-dashboard'); // Redirects to GovtOfficialHome
      } else {
        setError(data.error);
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Login error:', error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/govt/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Government Official Signup successful:', data);
        setSignupData({
          name: '',
          mobileNo: '',
          email: '',
          password: '',
          officialId: ''
        });
        setIsLogin(true);
        setError('Signup successful! Please login with your credentials.');
      } else {
        setError(data.error);
        console.error('Signup failed:', data.error);
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Signup error:', error);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Government Official Login' : 'Government Official Signup'}</h2>
      
      {error && <p className="error-message" style={{color: isLogin && error.includes('successful') ? 'green' : 'red'}}>{error}</p>}
      
      {isLogin ? (
        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit} className="login-form">
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={signupData.name}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobileNo"
              value={signupData.mobileNo}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Official ID</label>
            <input
              type="text"
              name="officialId"
              value={signupData.officialId}
              onChange={handleSignupChange}
              required
              placeholder="Enter government-issued ID"
            />
          </div>
          <button type="submit" className="login-btn">Sign Up</button>
        </form>
      )}

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button 
          onClick={toggleForm} 
          className="toggle-btn"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
      <p>
        Are you a farmer? <a href="/farmer-login">Farmer Login</a> | 
        Are you a customer? <a href="/customer-login">Customer Login</a>
      </p>
    </div>
  );
};

export default GovtLogin;