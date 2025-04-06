// src/pages/PathologistHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PathologistHome.css";

const PathologistHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [complaints, setComplaints] = useState([]);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [response, setResponse] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/pathologist-login");
    } else {
      fetchComplaints();
    }
  }, [token, navigate]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pathologist/complaints", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setComplaints(data);
      } else {
        setToast({ type: "error", message: data.error || "Failed to fetch complaints" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/pathologist-login");
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!activeComplaint || !response.trim()) {
      setToast({ type: "error", message: "Please select a complaint and provide a response." });
      return;
    }

    try {
      const responseData = await fetch(`http://localhost:5000/api/pathologist/complaints/${activeComplaint._id}/response`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ response }),
      });
      const data = await responseData.json();
      if (responseData.ok) {
        setResponse("");
        setActiveComplaint(null);
        fetchComplaints();
        setToast({ type: "success", message: "Response submitted successfully!" });
      } else {
        setToast({ type: "error", message: data.error || "Failed to submit response" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  if (!token) return null;

  return (
    <div className="pathologist-home-container">
      <header className="pathologist-header">
        <h2>Welcome, {username}!</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      <div className="pathologist-content">
        <h3>Pending Complaints</h3>
        {complaints.length === 0 ? (
          <p>No complaints to review.</p>
        ) : (
          <ul className="complaints-list">
            {complaints.map((complaint) => (
              complaint.status === "pending" && (
                <li key={complaint._id} className="complaint-item" onClick={() => setActiveComplaint(complaint)}>
                  <div className="complaint-details">
                    <p>Type: {complaint.type === "suitable_crops" ? "Suitable Crops" : "Crop Diseases"}</p>
                    <p>Farmer: {complaint.farmerId.name || "Unknown"}</p>
                    <p>Contact: {complaint.contactNumber}</p>
                    {complaint.image && (
                      <img
                        src={complaint.image}
                        alt="Complaint"
                        className="complaint-image"
                        onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                      />
                    )}
                    {/* <p>Description: {complaint.description}</p> */}
                  </div>
                </li>
              )
            ))}
          </ul>
        )}
        {activeComplaint && (
          <div className="response-section">
            <h3>Respond to Complaint</h3>
            <form onSubmit={handleResponseSubmit}>
              <div className="input-group">
                <label>Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  required
                  rows="4"
                  placeholder="Enter your response (e.g., recommended crops or disease solution)"
                />
              </div>
              <button type="submit" className="submit-response-btn">Submit Response</button>
            </form>
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

export default PathologistHome;