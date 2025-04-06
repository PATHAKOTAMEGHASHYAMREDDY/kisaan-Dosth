// src/pages/PathologistLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PathologistLogin.css'; // New CSS file for styling

const PathologistLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    mobileNo: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/pathologist/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        navigate('/pathologist-home'); // Navigate to pathologist home page (to be created)
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/pathologist/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (response.ok) {
        setSignupData({ name: '', mobileNo: '', email: '', password: '' });
        setIsLogin(true);
        setError('Signup successful! Please login.');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Network error occurred');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Pathologist Login' : 'Pathologist Signup'}</h2>

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
                placeholder="Enter your email"
              />
            </div>
            <div className="input-group password-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  placeholder="Enter your password"
                />
                <span
                  className="eye-icon"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
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
                placeholder="Enter your full name"
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
                placeholder="Enter your mobile number"
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
                placeholder="Enter your email"
              />
            </div>
            <div className="input-group password-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  placeholder="Enter your password"
                />
                <span
                  className="eye-icon"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
            </div>
            <button type="submit" className="login-btn">Sign Up</button>
          </form>
        )}

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleForm} className="toggle-btn">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
        <p className="farmer-link">
           <a href="/farmer-login">Farmer Login</a><br />
           <a href="/customer-login">Customer Login</a>
        </p>
      </div>

      {error && (
        <div className={`toast-notification ${error.includes('successful') ? 'toast-success' : 'toast-error'}`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default PathologistLogin;