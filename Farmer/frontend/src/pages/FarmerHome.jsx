import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FarmerHome.css";

const FarmerHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeSection, setActiveSection] = useState("addProduct");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    description: "",
    image: null,
  });
  const [suitableCropsData, setSuitableCropsData] = useState({
    soilType: "",
    climate: "",
    contactNumber: "",
    image: null,
  });
  const [cropDiseaseData, setCropDiseaseData] = useState({
    description: "",
    contactNumber: "",
    image: null,
  });
  const [applyData, setApplyData] = useState({ schemeId: "", acres: "" });

  const soilTypeOptions = ["Sandy", "Loamy", "Clay", "Silty", "Peaty", "Chalky"];
  const climateOptions = ["Tropical", "Temperate", "Arid", "Mediterranean", "Continental", "Polar"];

  useEffect(() => {
    if (!token) {
      navigate("/farmer-login");
    } else {
      fetchProducts();
      fetchOrders();
      fetchSchemes();
      fetchComplaints();
      fetchApplications();
    }
  }, [token, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/farmer/my-products", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        setToast({ type: "error", message: data.error || "Failed to fetch products" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/farmer/orders", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        setToast({ type: "error", message: data.error || "Failed to fetch orders" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const fetchSchemes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/schemes", {
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

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/farmer/complaints", {
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

  const fetchApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/farmer/applications", {
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
    navigate("/farmer-login");
  };

  const handleProductChange = (e) => {
    if (e.target.name === "image") {
      setProductData({ ...productData, image: e.target.files[0] });
    } else {
      setProductData({ ...productData, [e.target.name]: e.target.value });
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("category", productData.category);
    formData.append("quantity", productData.quantity);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    if (productData.image) {
      formData.append("image", productData.image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/farmer/products", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setProductData({ name: "", category: "", quantity: "", price: "", description: "", image: null });
        fetchProducts();
        setToast({ type: "success", message: "Product added successfully!" });
        setActiveSection("products");
      } else {
        setToast({ type: "error", message: data.error || "Failed to add product" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    const quantityToAdd = prompt("Enter quantity to add (kg):");
    if (!quantityToAdd || isNaN(quantityToAdd) || quantityToAdd <= 0) {
      setToast({ type: "error", message: "Please enter a valid quantity." });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/farmer/products/${productId}/increase-quantity`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: parseInt(quantityToAdd) }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchProducts();
        setToast({ type: "success", message: "Quantity increased successfully!" });
      } else {
        setToast({ type: "error", message: data.error || "Failed to increase quantity" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/farmer/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchOrders();
        setToast({ type: "success", message: "Order status updated successfully!" });
      } else {
        setToast({ type: "error", message: data.error || "Failed to update status" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const handleSuitableCropsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", "suitable_crops");
    formData.append("soilType", suitableCropsData.soilType);
    formData.append("climate", suitableCropsData.climate);
    formData.append("contactNumber", suitableCropsData.contactNumber);
    if (suitableCropsData.image) {
      formData.append("image", suitableCropsData.image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/farmer/complaints", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setSuitableCropsData({ soilType: "", climate: "", contactNumber: "", image: null });
        fetchComplaints();
        setToast({ type: "success", message: "Complaint submitted successfully!" });
        setActiveSection("complaints");
      } else {
        setToast({ type: "error", message: data.error || "Failed to submit complaint" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const handleCropDiseaseSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", "crop_diseases");
    formData.append("description", cropDiseaseData.description);
    formData.append("contactNumber", cropDiseaseData.contactNumber);
    if (cropDiseaseData.image) {
      formData.append("image", cropDiseaseData.image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/farmer/complaints", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setCropDiseaseData({ description: "", contactNumber: "", image: null });
        fetchComplaints();
        setToast({ type: "success", message: "Complaint submitted successfully!" });
        setActiveSection("complaints");
      } else {
        setToast({ type: "error", message: data.error || "Failed to submit complaint" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const handleSuitableCropsChange = (e) => {
    if (e.target.name === "image") {
      setSuitableCropsData({ ...suitableCropsData, image: e.target.files[0] });
    } else {
      setSuitableCropsData({ ...suitableCropsData, [e.target.name]: e.target.value });
    }
  };

  const handleCropDiseaseChange = (e) => {
    if (e.target.name === "image") {
      setCropDiseaseData({ ...cropDiseaseData, image: e.target.files[0] });
    } else {
      setCropDiseaseData({ ...cropDiseaseData, [e.target.name]: e.target.value });
    }
  };

  const handleApplyChange = (e) => {
    setApplyData({ ...applyData, [e.target.name]: e.target.value });
  };

  const handleApplySubmit = async (e, schemeId) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/farmer/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ schemeId, acres: parseInt(applyData.acres) }),
      });
      const data = await response.json();
      if (response.ok) {
        setApplyData({ schemeId: "", acres: "" });
        fetchApplications();
        setToast({ type: "success", message: "Application submitted successfully!" });
      } else {
        setToast({ type: "error", message: data.error || "Failed to submit application" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error connecting to server" });
    }
  };

  const showSection = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  if (!token) return null;

  return (
    <div className="farmer-home-container">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Welcome, {username}!</h3>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <ul className="sidebar-menu">
          <li className={activeSection === "addProduct" ? "active" : ""} onClick={() => showSection("addProduct")}>
            Add Product
          </li>
          <li className={activeSection === "products" ? "active" : ""} onClick={() => showSection("products")}>
            My Products
          </li>
          <li className={activeSection === "orders" ? "active" : ""} onClick={() => showSection("orders")}>
            Orders
          </li>
          <li className={activeSection === "schemes" ? "active" : ""} onClick={() => showSection("schemes")}>
            Schemes
          </li>
          <li className={activeSection === "complaints" ? "active" : ""} onClick={() => showSection("complaints")}>
            Complaints
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

        {activeSection === "addProduct" && (
          <div className="add-product-section">
            <h2>Add New Product</h2>
            <form onSubmit={handleProductSubmit} className="product-form" encType="multipart/form-data">
              <div className="input-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleProductChange}
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleProductChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Grains">Grains</option>
                </select>
              </div>
              <div className="input-group">
                <label>Quantity (kg)</label>
                <input
                  type="number"
                  name="quantity"
                  value={productData.quantity}
                  onChange={handleProductChange}
                  required
                  min="1"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="input-group">
                <label>Price (per kg)</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleProductChange}
                  required
                  min="1"
                  placeholder="Enter price"
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleProductChange}
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>
              <div className="input-group">
                <label>Product Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleProductChange}
                />
              </div>
              <button type="submit" className="add-btn">Add Product</button>
            </form>
          </div>
        )}

        {activeSection === "products" && (
          <div className="products-section">
            <h2>Your Products</h2>
            {products.length === 0 ? (
              <p>No products added yet.</p>
            ) : (
              <ul className="products-list">
                {products.map((product) => (
                  <li key={product._id} className="product-item">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                    <div className="product-details">
                      <h3>{product.name} ({product.category})</h3>
                      <p>Quantity: {product.quantity} kg</p>
                      <p>Price: ₹{product.price}/kg</p>
                      <p>{product.description}</p>
                      <button
                        onClick={() => handleIncreaseQuantity(product._id)}
                        className="increase-quantity-btn"
                      >
                        Increase Quantity
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeSection === "orders" && (
          <div className="orders-section">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
              <p>No orders received yet.</p>
            ) : (
              <ul className="orders-list">
                {orders.map((order) => (
                  <li key={order._id} className="order-item">
                    {order.productId && order.productId.image ? (
                      <img
                        src={order.productId.image}
                        alt={order.productId.name}
                        className="order-image"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                    <div className="order-details">
                      <p>Product: {order.productId && order.productId.name ? order.productId.name : "Unknown"}</p>
                      <p>Customer: {order.customerId ? (order.customerId.name || "N/A") : "Missing"}</p>
                      <p>Phone: {order.customerId ? (order.customerId.mobileNo || "N/A") : "Missing"}</p>
                      <p>Quantity: {order.quantity} kg</p>
                      <p>Address: {order.address || "Not provided"}</p>
                      <p>Status: {order.status}</p>
                      {order.status === "Pending" && (
                        <div className="order-actions">
                          <button
                            onClick={() => handleStatusChange(order._id, "Accepted")}
                            className="accept-btn"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(order._id, "Rejected")}
                            className="reject-btn"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      <p>Ordered At: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeSection === "schemes" && (
          <div className="schemes-section">
            <h2>Government Schemes</h2>
            {schemes.length === 0 ? (
              <p>No schemes available yet.</p>
            ) : (
              <ul className="schemes-list">
                {schemes.map((scheme) => {
                  const application = applications.find(app => app.schemeId._id === scheme._id);
                  return (
                    <li key={scheme._id} className="scheme-item">
                      <div className="scheme-details">
                        <h3>{scheme.title}</h3>
                        <p>Type: {scheme.type}</p>
                        <p>Amount: ₹{scheme.amount}</p>
                        <p>Description: {scheme.description}</p>
                        <p>Start Date: {new Date(scheme.startDate).toLocaleDateString()}</p>
                        <p>Expiry Date: {new Date(scheme.expiryDate).toLocaleDateString()}</p>
                        <p>Eligibility: {scheme.eligibility || "N/A"}</p>
                        <p>Added By: {scheme.govtOfficialId ? scheme.govtOfficialId.name : "Unknown"}</p>
                        {application ? (
                          <p>Application Status: {application.status} {application.response && `- Response: ${application.response}`}</p>
                        ) : (
                          <form onSubmit={(e) => handleApplySubmit(e, scheme._id)} className="apply-form">
                            <div className="input-group">
                              <label>Acres</label>
                              <input
                                type="number"
                                name="acres"
                                value={applyData.acres}
                                onChange={handleApplyChange}
                                required
                                min="1"
                                placeholder="Enter acres"
                              />
                            </div>
                            <button type="submit" className="submit-complaint-btn">Apply</button>
                          </form>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {activeSection === "complaints" && (
          <div className="complaints-section">
            <h2>Raise a Complaint</h2>
            <div className="complaint-forms">
              <div className="complaint-form">
                <h3>Suitable Crops for This Season</h3>
                <form onSubmit={handleSuitableCropsSubmit} encType="multipart/form-data">
                  <div className="input-group">
                    <label>Soil Type</label>
                    <select
                      name="soilType"
                      value={suitableCropsData.soilType}
                      onChange={handleSuitableCropsChange}
                      required
                    >
                      <option value="">Select Soil Type</option>
                      {soilTypeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Climate</label>
                    <select
                      name="climate"
                      value={suitableCropsData.climate}
                      onChange={handleSuitableCropsChange}
                      required
                    >
                      <option value="">Select Climate</option>
                      {climateOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={suitableCropsData.contactNumber}
                      onChange={handleSuitableCropsChange}
                      required
                      placeholder="Enter your contact number"
                    />
                  </div>
                  <div className="input-group">
                    <label>Image (Optional)</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleSuitableCropsChange}
                    />
                  </div>
                  <button type="submit" className="submit-complaint-btn">Submit</button>
                </form>
              </div>

              <div className="complaint-form">
                <h3>Report Crop Diseases</h3>
                <form onSubmit={handleCropDiseaseSubmit} encType="multipart/form-data">
                  <div className="input-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={cropDiseaseData.description}
                      onChange={handleCropDiseaseChange}
                      required
                      rows="3"
                      placeholder="Describe the issue (e.g., symptoms, affected area)"
                    />
                  </div>
                  <div className="input-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={cropDiseaseData.contactNumber}
                      onChange={handleCropDiseaseChange}
                      required
                      placeholder="Enter your contact number"
                    />
                  </div>
                  <div className="input-group">
                    <label>Image (Required)</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleCropDiseaseChange}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-complaint-btn">Submit</button>
                </form>
              </div>
            </div>
            <h3>Your Complaints</h3>
            {complaints.length === 0 ? (
              <p>No complaints submitted yet.</p>
            ) : (
              <ul className="complaints-list">
                {complaints.map((complaint) => (
                  <li key={complaint._id} className="complaint-item">
                    <div className="complaint-details">
                      <p>Type: {complaint.type === "suitable_crops" ? "Suitable Crops" : "Crop Diseases"}</p>
                      <p>Description: {complaint.description}</p>
                      <p>Contact: {complaint.contactNumber}</p>
                      {complaint.image && (
                        <img
                          src={complaint.image}
                          alt="Complaint"
                          className="complaint-image"
                          onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                        />
                      )}
                      <p>Status: {complaint.status}</p>
                      {complaint.response && <p>Response: {complaint.response}</p>}
                      <p>Submitted: {new Date(complaint.createdAt).toLocaleString()}</p>
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

export default FarmerHome;