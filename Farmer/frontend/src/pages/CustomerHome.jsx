// src/pages/CustomerHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CustomerHome.css";

const CustomerHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("products"); // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [address, setAddress] = useState("");
  const [currentProductId, setCurrentProductId] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/customer-login");
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [token, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        console.error("Failed to fetch products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customer/my-orders", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        console.error("Failed to fetch orders:", data.error);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/customer-login");
  };

  const handleOrderClick = (productId, quantity) => {
    setCurrentProductId(productId);
    setCurrentQuantity(quantity);
    setShowOrderForm(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/customer/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: currentProductId,
          quantity: currentQuantity,
          address,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowOrderForm(false);
        setAddress("");
        fetchProducts();
        fetchOrders();
        setActiveSection("orders"); // Switch to orders after placing an order
      } else {
        alert(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error connecting to server");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showSection = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  if (!token) return null;

  return (
    <div className="customer-home-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Welcome, {username}!</h3>
          <button className="sidebar-close" onClick={toggleSidebar}>✕</button>
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeSection === "products" ? "active" : ""}
            onClick={() => showSection("products")}
          >
            Available Products
          </li>
          <li
            className={activeSection === "orders" ? "active" : ""}
            onClick={() => showSection("orders")}
          >
            My Orders
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <button className="hamburger" onClick={toggleSidebar}>
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </button>

        {/* Products Section */}
        {activeSection === "products" && (
          <div className="products-section">
            <h2>Available Products</h2>
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products available.</p>
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
                      <h3>{product.name}</h3>
                      <p>Farmer: {product.farmerId ? product.farmerId.name : "Unknown"}</p>
                      <p>Category: {product.category}</p>
                      <p>Quantity: {product.quantity} kg</p>
                      <p>Price: ₹{product.price}/kg</p>
                      <p>{product.description}</p>
                      <div className="order-section">
                        <input
                          type="number"
                          min="1"
                          max={product.quantity}
                          defaultValue="1"
                          id={`quantity-${product._id}`}
                          className="quantity-input"
                        />
                        <button
                          onClick={() => {
                            const quantity = document.getElementById(`quantity-${product._id}`).value;
                            handleOrderClick(product._id, parseInt(quantity));
                          }}
                          className="order-btn"
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Orders Section */}
        {activeSection === "orders" && (
          <div className="orders-section">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
              <p>No orders placed yet.</p>
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
                    <div>
                      <p>Product: {order.productId ? order.productId.name : "Unknown"}</p>
                      <p>Farmer: {order.farmerId && order.farmerId.name ? order.farmerId.name : "Unknown"}</p>
                      <p>Phone: {order.farmerId && order.farmerId.mobileNo ? order.farmerId.mobileNo : "N/A"}</p>
                      <p>Quantity: {order.quantity} kg</p>
                      <p>Address: {order.address || "Not provided"}</p>
                      <p>Status: {order.status}</p>
                      <p>Ordered At: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Order Form Overlay */}
        {showOrderForm && (
          <div className="order-form-overlay">
            <div className="order-form">
              <h3>Enter Delivery Address</h3>
              <form onSubmit={handleOrderSubmit}>
                <div className="input-group">
                  <label>Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    rows="4"
                    required
                  />
                </div>
                <button type="submit" className="submit-order-btn">Submit Order</button>
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;