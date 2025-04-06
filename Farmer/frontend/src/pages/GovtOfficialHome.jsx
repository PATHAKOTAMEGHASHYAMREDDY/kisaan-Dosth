import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GovtOfficialHome.css";

const GovtOfficialHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [schemes, setSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeSection, setActiveSection] = useState("addScheme");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [schemeData, setSchemeData] = useState({
    title: "",
    description: "",
    type: "",
    amount: "",
    startDate: "",
    expiryDate: "",
    eligibility: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/govt-login");
    } else {
      fetchSchemes();
      fetchApplications();
    }
  }, [token, navigate]);

  const fetchSchemes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/govt/my-schemes", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSchemes(data);
      } else {
        setToast({ type: "error", message: data.error || "Failed to fetch schemes" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/govt/applications", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setApplications(data);
      } else {
        setToast({ type: "error", message: data.error || "Failed to fetch applications" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/govt-login");
  };

  const handleSchemeChange = (e) => {
    setSchemeData({ ...schemeData, [e.target.name]: e.target.value });
  };

  const handleSchemeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/govt/schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(schemeData),
      });
      const data = await response.json();
      if (response.ok) {
        setSchemeData({
          title: "",
          description: "",
          type: "",
          amount: "",
          startDate: "",
          expiryDate: "",
          eligibility: "",
        });
        fetchSchemes();
        setToast({ type: "success", message: "Scheme added successfully!" });
        setActiveSection("schemes");
      } else {
        setToast({ type: "error", message: data.error || "Failed to add scheme" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const handleApplicationStatusChange = async (applicationId, status) => {
    console.log(`Attempting to update application ${applicationId} to ${status}`);
    try {
      const response = await fetch(`http://localhost:5000/api/govt/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      console.log("API Response:", data);
      if (response.ok) {
        fetchApplications();
        setToast({ type: "success", message: `Application ${status.toLowerCase()} successfully!` });
      } else {
        setToast({ type: "error", message: data.error || "Failed to update status" });
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const showSection = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  if (!token) return null;

  return (
    <div className="govt-home-container">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Welcome, {username}!</h3>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeSection === "addScheme" ? "active" : ""}
            onClick={() => showSection("addScheme")}
          >
            Add Scheme
          </li>
          <li
            className={activeSection === "schemes" ? "active" : ""}
            onClick={() => showSection("schemes")}
          >
            My Schemes
          </li>
          <li
            className={activeSection === "applications" ? "active" : ""}
            onClick={() => showSection("applications")}
          >
            Manage Applications
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </button>

        {activeSection === "addScheme" && (
          <div className="add-scheme-section">
            <h2>Add New Scheme</h2>
            <form onSubmit={handleSchemeSubmit} className="scheme-form">
              <div className="input-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={schemeData.title}
                  onChange={handleSchemeChange}
                  required
                  placeholder="Enter scheme title"
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={schemeData.description}
                  onChange={handleSchemeChange}
                  required
                  rows="3"
                  placeholder="Enter scheme description"
                />
              </div>
              <div className="input-group">
                <label>Type</label>
                <select
                  name="type"
                  value={schemeData.type}
                  onChange={handleSchemeChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Loan">Loan</option>
                  <option value="Subsidy">Subsidy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={schemeData.amount}
                  onChange={handleSchemeChange}
                  required
                  min="1"
                  placeholder="Enter amount"
                />
              </div>
              <div className="input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={schemeData.startDate}
                  onChange={handleSchemeChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={schemeData.expiryDate}
                  onChange={handleSchemeChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Eligibility (Optional)</label>
                <textarea
                  name="eligibility"
                  value={schemeData.eligibility}
                  onChange={handleSchemeChange}
                  rows="3"
                  placeholder="Enter eligibility criteria (optional)"
                />
              </div>
              <button type="submit" className="add-btn">Add Scheme</button>
            </form>
          </div>
        )}

        {activeSection === "schemes" && (
          <div className="schemes-section">
            <h2>Your Schemes</h2>
            {schemes.length === 0 ? (
              <p>No schemes added yet.</p>
            ) : (
              <ul className="schemes-list">
                {schemes.map((scheme) => (
                  <li key={scheme._id} className="scheme-item">
                    <div className="scheme-details">
                      <h3>{scheme.title}</h3>
                      <p>Type: {scheme.type}</p>
                      <p>Amount: ₹{scheme.amount}</p>
                      <p>Description: {scheme.description}</p>
                      <p>Start Date: {new Date(scheme.startDate).toLocaleDateString()}</p>
                      <p>Expiry Date: {new Date(scheme.expiryDate).toLocaleDateString()}</p>
                      <p>Eligibility: {scheme.eligibility || "N/A"}</p>
                      <p>Created At: {new Date(scheme.createdAt).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeSection === "applications" && (
          <div className="applications-section">
            <h2>Manage Applications</h2>
            {applications.length === 0 ? (
              <p>No applications received yet.</p>
            ) : (
              <ul className="applications-list">
                {applications.map((application) => (
                  <li key={application._id} className="application-item">
                    <div className="application-details">
                      <p>Farmer: {application.farmerId.name || "N/A"}</p>
                      <p>Phone: {application.farmerId.mobileNo || "N/A"}</p>
                      <p>Scheme: {application.schemeId.title}</p>
                      <p>Acres: {application.acres}</p>
                      <p>Status: {application.status}</p>
                      {application.response && <p>Response: {application.response}</p>}
                      {application.status === "Pending" && (
                        <div className="application-actions">
                          <button
                            onClick={() => handleApplicationStatusChange(application._id, "Approved")}
                            className="accept-btn"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApplicationStatusChange(application._id, "Declined")}
                            className="reject-btn"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      <p>Applied At: {new Date(application.createdAt).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className={`toast-notification ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default GovtOfficialHome;