import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import farmerBg from '../assets/farmer-bg.jpg'; // Placeholder image
import cropsImg from '../assets/crops.jpg';    // Placeholder image
import marketImg from '../assets/market.jpg';  // Placeholder image
import pathologistImg from '../assets/pathologist.jpg'; // Placeholder image

const Home = () => {
  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="home-header" style={{ backgroundImage: `url(${farmerBg})` }}>
        <h1>Farmers Hub</h1>
        <p>Grow, Connect, Thrive – Your Farming Journey Starts Here</p>
        <div className="login-buttons">
          <Link to="/farmer-login" className="btn farmer-btn">Farmer</Link>
          <Link to="/customer-login" className="btn customer-btn">Customer</Link>
          <Link to="/govt-login" className="btn govt-btn">Govt Official</Link>
          <Link to="/pathologist-login" className="btn pathologist-btn">Pathologist</Link> {/* New pathologist link */}
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <section className="intro">
          <h2>Welcome to Farmers Hub</h2>
          <p>
            Farmers Hub is your one-stop platform to manage crops, track market prices, connect directly with customers, and get expert advice from pathologists. Whether you’re a farmer optimizing yields, a customer seeking fresh produce, a government official managing schemes, or a pathologist providing crop health insights, we’ve got you covered.
          </p>
        </section>

        <section className="features">
          <div className="feature-card">
            <img src={cropsImg} alt="Crop Management" className="feature-img" />
            <h3>Crop Management</h3>
            <p>Monitor your fields, plan harvests, and optimize yields with our easy-to-use tools.</p>
          </div>
          <div className="feature-card">
            <img src={marketImg} alt="Market Insights" className="feature-img" />
            <h3>Market Insights</h3>
            <p>Stay updated with real-time market trends and sell your produce at the best prices.</p>
          </div>
          <div className="feature-card">
            <img src={pathologistImg} alt="Pathologist Support" className="feature-img" /> {/* Reusing cropsImg as a placeholder */}
            <h3>Pathologist Support</h3>
            <p>Get expert analysis and solutions for crop health issues from certified pathologists.</p> {/* New feature for pathologists */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2025 Farmers Hub. All rights reserved.</p>
        <p>Contact us: support@farmershub.com | +1-800-FARMERS</p>
      </footer>
    </div>
  );
};

export default Home;