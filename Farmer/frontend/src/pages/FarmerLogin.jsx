// src/components/FarmerLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FarmerLogin.css";

const FarmerLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    mobileNo: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setToast(null);
    try {
      const response = await fetch("http://localhost:5000/api/farmer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        setToast({ type: "success", message: "Login successful!" });
        setTimeout(() => navigate("/farmer-home"), 1000);
      } else {
        setError(data.error);
        setToast({ type: "error", message: data.error || "Login failed" });
      }
    } catch (error) {
      setError("Network error occurred");
      setToast({ type: "error", message: "Network error occurred" });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setToast(null);
    try {
      const response = await fetch("http://localhost:5000/api/farmer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (response.ok) {
        setSignupData({ name: "", mobileNo: "", email: "", password: "" });
        setIsLogin(true);
        setError("Signup successful! Please login with your credentials.");
        setToast({ type: "success", message: "Signup successful!" });
      } else {
        setError(data.error);
        setToast({ type: "error", message: data.error || "Signup failed" });
      }
    } catch (error) {
      setError("Network error occurred");
      setToast({ type: "error", message: "Network error occurred" });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setToast(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? "Farmer Login" : "Farmer Signup"}</h2>

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
                  type={showPassword ? "text" : "password"}
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
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#7f8c8d"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 0 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" fill="none" stroke="#7f8c8d" strokeWidth="2"/>
                    </svg>
                  )}
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
                  type={showPassword ? "text" : "password"}
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
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#7f8c8d"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 0 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" fill="none" stroke="#7f8c8d" strokeWidth="2"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <button type="submit" className="login-btn">Sign Up</button>
          </form>
        )}

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleForm} className="toggle-btn">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        <p className="customer-link">
          Are you a customer? <a href="/customer-login">Customer Login</a>
        </p>
      </div>

      {toast && (
        <div className={`toast-notification ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default FarmerLogin;