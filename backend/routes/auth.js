// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Farmer = require("../models/Farmer");
const Customer = require("../models/Customer");
const GovtOfficial = require("../models/GovtOfficial");
const Pathologist = require("../models/Pathologist");
const Complaint = require("../models/Complaint");
const Application = require("../models/Application"); // New model
// const Scheme = require("../models/Scheme"); // Updated model
const multer = require("multer");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Customer Signup
router.post("/customer/signup", async (req, res) => {
  const { name, mobileNo, email, password } = req.body;
  if (!name || !mobileNo || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const customer = new Customer({ name, mobileNo, email, password });
    const savedCustomer = await customer.save();
    res.status(201).json({ message: "Customer signup successful", id: savedCustomer._id });
  } catch (error) {
    res.status(500).json({ error: "Server error during customer signup" });
  }
});

// Customer Login
router.post("/customer/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: customer._id, role: "customer" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      username: customer.name,
      role: "customer",
      email: customer.email,
      mobileNo: customer.mobileNo,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during customer login" });
  }
});

// Farmer Signup
router.post("/farmer/signup", async (req, res) => {
  const { name, mobileNo, email, password } = req.body;
  if (!name || !mobileNo || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const farmer = new Farmer({ name, mobileNo, email, password });
    const savedFarmer = await farmer.save();
    res.status(201).json({ message: "Farmer signup successful", id: savedFarmer._id });
  } catch (error) {
    res.status(500).json({ error: "Server error during farmer signup" });
  }
});

// Farmer Login
router.post("/farmer/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await farmer.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: farmer._id, role: "farmer" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      username: farmer.name,
      role: "farmer",
      email: farmer.email,
      mobileNo: farmer.mobileNo,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during farmer login" });
  }
});

// Govt Official Signup
router.post("/govt/signup", async (req, res) => {
  const { name, mobileNo, email, password, officialId } = req.body;
  if (!name || !mobileNo || !email || !password || !officialId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const existingOfficial = await GovtOfficial.findOne({ officialId });
    if (existingOfficial) {
      return res.status(400).json({ error: "Official ID already exists" });
    }
    const govtOfficial = new GovtOfficial({ name, mobileNo, email, password, officialId });
    const savedOfficial = await govtOfficial.save();
    res.status(201).json({ message: "Government Official signup successful", id: savedOfficial._id });
  } catch (error) {
    res.status(500).json({ error: "Server error during government official signup" });
  }
});

// Govt Official Login
router.post("/govt/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const govtOfficial = await GovtOfficial.findOne({ email });
    if (!govtOfficial) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await govtOfficial.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: govtOfficial._id, role: "govt" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      username: govtOfficial.name,
      role: "govt",
      email: govtOfficial.email,
      mobileNo: govtOfficial.mobileNo,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during government official login" });
  }
});

// Pathologist Signup
router.post("/pathologist/signup", async (req, res) => {
  const { name, mobileNo, email, password } = req.body;
  if (!name || !mobileNo || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const existingPathologist = await Pathologist.findOne({ email });
    if (existingPathologist) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const pathologist = new Pathologist({ name, mobileNo, email, password });
    const savedPathologist = await pathologist.save();
    res.status(201).json({ message: "Pathologist signup successful", id: savedPathologist._id });
  } catch (error) {
    res.status(500).json({ error: "Server error during pathologist signup" });
  }
});

// Pathologist Login
router.post("/pathologist/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const pathologist = await Pathologist.findOne({ email });
    if (!pathologist) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await pathologist.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: pathologist._id, role: "pathologist" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      username: pathologist.name,
      role: "pathologist",
      email: pathologist.email,
      mobileNo: pathologist.mobileNo,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during pathologist login" });
  }
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", ProductSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

// Scheme Schema
const SchemeSchema = new mongoose.Schema({
  govtOfficialId: { type: mongoose.Schema.Types.ObjectId, ref: "GovtOfficial", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["Loan", "Subsidy", "Other"], required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  eligibility: { type: String },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }], // Reference to applications
  createdAt: { type: Date, default: Date.now },
});

const Scheme = mongoose.model("Scheme", SchemeSchema);

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Authentication required" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Add Product Route with Image Upload
router.post("/farmer/products", authMiddleware, upload.single("image"), async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const image = req.file;
  if (!name || !category || !quantity || !price) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }
  try {
    let imageBase64 = null;
    if (image) {
      imageBase64 = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
    }
    const product = new Product({
      farmerId: req.user.id,
      name,
      category,
      quantity,
      price,
      description,
      image: imageBase64,
    });
    const savedProduct = await product.save();
    res.status(201).json({
      message: "Product added successfully",
      id: savedProduct._id,
      image: savedProduct.image,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while adding product" });
  }
});

// Fetch All Products (for customers)
router.get("/products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().populate("farmerId", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching products" });
  }
});

// Fetch Farmer's Own Products
router.get("/farmer/my-products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching farmer's products" });
  }
});

// Increase Product Quantity
router.patch("/farmer/products/:productId/increase-quantity", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Valid quantity is required" });
  }
  try {
    const product = await Product.findOne({ _id: productId, farmerId: req.user.id });
    if (!product) {
      return res.status(404).json({ error: "Product not found or not owned by you" });
    }
    product.quantity += quantity;
    await product.save();
    res.json({ message: "Quantity increased successfully", product });
  } catch (error) {
    res.status(500).json({ error: "Server error while increasing quantity" });
  }
});

// Place Order
router.post("/customer/orders", authMiddleware, async (req, res) => {
  const { productId, quantity, address } = req.body;
  if (!productId || !quantity || !address) {
    return res.status(400).json({ error: "Product ID, quantity, and address are required" });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient quantity available" });
    }
    const order = new Order({
      customerId: req.user.id,
      productId,
      farmerId: product.farmerId,
      quantity,
      address,
    });
    const savedOrder = await order.save();
    product.quantity -= quantity;
    await product.save();
    res.status(201).json({ message: "Order placed successfully", id: savedOrder._id });
  } catch (error) {
    res.status(500).json({ error: "Server error while placing order" });
  }
});

// Update Order Status
router.patch("/farmer/orders/:orderId/status", authMiddleware, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Status must be 'Accepted' or 'Rejected'" });
  }
  try {
    const order = await Order.findOne({ _id: orderId, farmerId: req.user.id });
    if (!order) {
      return res.status(404).json({ error: "Order not found or not owned by you" });
    }
    order.status = status;
    await order.save();
    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ error: "Server error while updating order status" });
  }
});

// Fetch Farmer Orders
router.get("/farmer/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.user.id })
      .populate("productId", "name image")
      .populate("customerId", "name mobileNo");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching orders" });
  }
});

// Fetch Customer Orders
router.get("/customer/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate("productId", "name image")
      .populate("farmerId", "name mobileNo");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching customer orders" });
  }
});

// Add Scheme Route (Govt Official Only)
router.post("/govt/schemes", authMiddleware, async (req, res) => {
  if (req.user.role !== "govt") {
    return res.status(403).json({ error: "Access denied. Government officials only." });
  }
  const { title, description, type, amount, startDate, expiryDate, eligibility } = req.body;
  if (!title || !description || !type || !amount || !startDate || !expiryDate) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }
  try {
    const scheme = new Scheme({
      govtOfficialId: req.user.id,
      title,
      description,
      type,
      amount,
      startDate,
      expiryDate,
      eligibility,
    });
    const savedScheme = await scheme.save();
    res.status(201).json({ message: "Scheme added successfully", id: savedScheme._id });
  } catch (error) {
    res.status(500).json({ error: "Server error while adding scheme" });
  }
});

// Fetch All Schemes (Visible to Farmers)
router.get("/schemes", authMiddleware, async (req, res) => {
  if (req.user.role !== "farmer") {
    return res.status(403).json({ error: "Access denied. Farmers only." });
  }
  try {
    const schemes = await Scheme.find().populate("govtOfficialId", "name");
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching schemes" });
  }
});

// Fetch Govt Official's Own Schemes
router.get("/govt/my-schemes", authMiddleware, async (req, res) => {
  if (req.user.role !== "govt") {
    return res.status(403).json({ error: "Access denied. Government officials only." });
  }
  try {
    const schemes = await Scheme.find({ govtOfficialId: req.user.id });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching official's schemes" });
  }
});

// Submit Complaint (Farmer)
router.post("/farmer/complaints", authMiddleware, upload.single("image"), async (req, res) => {
  if (req.user.role !== "farmer") {
    return res.status(403).json({ error: "Access denied. Farmers only." });
  }
  const { type, soilType, climate, description, contactNumber } = req.body;
  if (!type || !contactNumber || (type === "suitable_crops" && (!soilType || !climate)) || (type === "crop_diseases" && !description)) {
    return res.status(400).json({ error: "Required fields are missing" });
  }
  try {
    let imageBase64 = null;
    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }
    const complaint = new Complaint({
      farmerId: req.user.id,
      type,
      soilType: type === "suitable_crops" ? soilType : undefined,
      climate: type === "suitable_crops" ? climate : undefined,
      description: type === "crop_diseases" ? description : undefined,
      contactNumber,
      image: imageBase64,
    });
    const savedComplaint = await complaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", id: savedComplaint._id });
  } catch (error) {
    res.status(500).json({ error: "Server error while submitting complaint" });
  }
});

// Fetch Farmer's Complaints
router.get("/farmer/complaints", authMiddleware, async (req, res) => {
  if (req.user.role !== "farmer") {
    return res.status(403).json({ error: "Access denied. Farmers only." });
  }
  try {
    const complaints = await Complaint.find({ farmerId: req.user.id })
      .populate("farmerId", "name")
      .populate("pathologistId", "name");
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching complaints" });
  }
});

// Fetch Pathologist's Complaints
router.get("/pathologist/complaints", authMiddleware, async (req, res) => {
  if (req.user.role !== "pathologist") {
    return res.status(403).json({ error: "Access denied. Pathologists only." });
  }
  try {
    const complaints = await Complaint.find({ status: "pending" })
      .populate("farmerId", "name mobileNo");
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching complaints" });
  }
});

// Update Complaint Response (Pathologist)
router.patch("/pathologist/complaints/:complaintId/response", authMiddleware, async (req, res) => {
  if (req.user.role !== "pathologist") {
    return res.status(403).json({ error: "Access denied. Pathologists only." });
  }
  const { complaintId } = req.params;
  const { response } = req.body;
  if (!response) {
    return res.status(400).json({ error: "Response is required" });
  }
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    complaint.pathologistId = req.user.id;
    complaint.response = response;
    complaint.status = "responded";
    await complaint.save();
    res.json({ message: "Response submitted successfully", complaint });
  } catch (error) {
    res.status(500).json({ error: "Server error while updating response" });
  }
});

// Apply for Scheme (Farmer)
router.post("/farmer/applications", authMiddleware, async (req, res) => {
  if (req.user.role !== "farmer") {
    return res.status(403).json({ error: "Access denied. Farmers only." });
  }
  const { schemeId, acres } = req.body;
  if (!schemeId || !acres) {
    return res.status(400).json({ error: "Scheme ID and acres are required" });
  }
  try {
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ error: "Scheme not found" });
    }
    const existingApplication = await Application.findOne({ farmerId: req.user.id, schemeId });
    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this scheme" });
    }
    const application = new Application({
      farmerId: req.user.id,
      schemeId,
      acres,
    });
    const savedApplication = await application.save();
    // Optionally update scheme with application reference
    scheme.applications.push(savedApplication._id);
    await scheme.save();
    res.status(201).json({ message: "Application submitted successfully", id: savedApplication._id });
  } catch (error) {
    res.status(500).json({ error: "Server error while submitting application" });
  }
});

// Fetch Farmer's Applications
router.get("/farmer/applications", authMiddleware, async (req, res) => {
  if (req.user.role !== "farmer") {
    return res.status(403).json({ error: "Access denied. Farmers only." });
  }
  try {
    const applications = await Application.find({ farmerId: req.user.id })
      .populate("schemeId", "title type amount");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching applications" });
  }
});

// Fetch All Applications (Govt Official)
router.get("/govt/applications", authMiddleware, async (req, res) => {
  if (req.user.role !== "govt") {
    return res.status(403).json({ error: "Access denied. Government officials only." });
  }
  try {
    const applications = await Application.find()
      .populate("farmerId", "name mobileNo")
      .populate("schemeId", "title type amount");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching applications" });
  }
});

// Update Application Status (Govt Official)
// [Previous content remains unchanged until the Application status update route]

// Update Application Status (Govt Official)
router.patch("/govt/applications/:applicationId", authMiddleware, async (req, res) => {
  if (req.user.role !== "govt") {
    return res.status(403).json({ error: "Access denied. Government officials only." });
  }
  const { applicationId } = req.params;
  const { status } = req.body;
  if (!["Approved", "Declined"].includes(status)) {
    return res.status(400).json({ error: "Status must be 'Approved' or 'Declined'" });
  }
  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    application.status = status;
    // No response is required, so we leave it as null or existing value
    await application.save();
    res.json({ message: "Application status updated successfully", application });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Server error while updating application status" });
  }
});

// [Rest of the file remains unchanged]

module.exports = router;