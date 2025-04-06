// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FarmerLogin from './pages/FarmerLogin';
import CustomerLogin from './pages/CustomerLogin';
import GovtLogin from './pages/GovtLogin';
import PathologistLogin from './pages/PathologistLogin';
import FarmerHome from './pages/FarmerHome';
import CustomerHome from './pages/CustomerHome';
import GovtOfficialHome from './pages/GovtOfficialHome';
import PathologistHome from './pages/PathologistHome'; // New import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmer-login" element={<FarmerLogin />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/govt-login" element={<GovtLogin />} />
        <Route path="/pathologist-login" element={<PathologistLogin />} />
        <Route path="/farmer-home" element={<FarmerHome />} />
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route path="/govt-dashboard" element={<GovtOfficialHome />} />
        <Route path="/pathologist-home" element={<PathologistHome />} /> {/* Updated route */}
      </Routes>
    </Router>
  );
}

export default App;