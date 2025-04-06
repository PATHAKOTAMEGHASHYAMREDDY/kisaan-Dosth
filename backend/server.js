// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const app = express();
// app.use(cors()); // Allows frontend to communicate with backend
// app.use(express.json()); // Parses JSON requests

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("MongoDB connection error:", err));

// // Define a Message Schema
// const messageSchema = new mongoose.Schema({
//     message: String,
//     encryptedMessage: String,
//     timestamp: { type: Date, default: Date.now }
// });

// const Message = mongoose.model("Message", messageSchema);

// // Test Route
// app.get("/", (req, res) => {
//     res.send("Backend is running with MongoDB!");
// });

// // API to Encrypt and Store Message
// app.post("/encrypt-message", async (req, res) => {
//     const { message } = req.body;

//     // Replace this with actual AES encryption logic
//     const encryptedMessage = `encrypted_${message}`;

//     try {
//         const newMessage = new Message({ message, encryptedMessage });
//         await newMessage.save();
//         res.json({ encryptedMessage });
//     } catch (error) {
//         console.error("Error saving message:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // API to Retrieve All Messages
// app.get("/messages", async (req, res) => {
//     try {
//         const messages = await Message.find().sort({ timestamp: -1 });
//         res.json(messages);
//     } catch (error) {
//         console.error("Error fetching messages:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // Start the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// // server.js
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const app = express();
// app.use(cors()); // Allows frontend to communicate with backend
// app.use(express.json()); // Parses JSON requests

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Import Routes
// const authRoutes = require("./routes/auth");

// // Define a Message Schema (keeping your existing schema)
// const messageSchema = new mongoose.Schema({
//   message: String,
//   encryptedMessage: String,
//   timestamp: { type: Date, default: Date.now },
// });

// const Message = mongoose.model("Message", messageSchema);

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Backend is running with MongoDB!");
// });

// // Existing Message Routes
// app.post("/encrypt-message", async (req, res) => {
//   const { message } = req.body;
//   const encryptedMessage = `encrypted_${message}`; // Replace with actual encryption logic

//   try {
//     const newMessage = new Message({ message, encryptedMessage });
//     await newMessage.save();
//     res.json({ encryptedMessage });
//   } catch (error) {
//     console.error("Error saving message:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/messages", async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ timestamp: -1 });
//     res.json(messages);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Add Authentication Routes
// app.use("/api/farmer", authRoutes);

// // Start the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.js
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB (removed deprecated options)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Import Routes
// const authRoutes = require("./routes/auth");

// // Define a Message Schema
// const messageSchema = new mongoose.Schema({
//   message: String,
//   encryptedMessage: String,
//   timestamp: { type: Date, default: Date.now },
// });

// const Message = mongoose.model("Message", messageSchema);

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Backend is running with MongoDB!");
// });

// // Message Routes
// app.post("/encrypt-message", async (req, res) => {
//   const { message } = req.body;
//   const encryptedMessage = `encrypted_${message}`;

//   try {
//     const newMessage = new Message({ message, encryptedMessage });
//     await newMessage.save();
//     res.json({ encryptedMessage });
//   } catch (error) {
//     console.error("Error saving message:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/messages", async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ timestamp: -1 });
//     res.json(messages);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Authentication Routes
// app.use("/api/farmer", authRoutes);

// // Start the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.js



// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection with more detailed error handling
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     process.exit(1); // Exit process if connection fails
//   }
// };

// connectDB();

// // Import Routes
// const authRoutes = require("./routes/auth");

// // Message Schema
// const messageSchema = new mongoose.Schema({
//   message: String,
//   encryptedMessage: String,
//   timestamp: { type: Date, default: Date.now },
// });

// const Message = mongoose.model("Message", messageSchema);

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Backend is running with MongoDB!");
// });

// // Message Routes
// app.post("/encrypt-message", async (req, res) => {
//   const { message } = req.body;
//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   const encryptedMessage = `encrypted_${message}`;

//   try {
//     const newMessage = new Message({ message, encryptedMessage });
//     const savedMessage = await newMessage.save();
//     console.log("Message saved:", savedMessage);
//     res.json({ encryptedMessage, id: savedMessage._id });
//   } catch (error) {
//     console.error("Error saving message:", error.message);
//     res.status(500).json({ error: "Failed to save message" });
//   }
// });

// app.get("/messages", async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ timestamp: -1 });
//     console.log("Messages fetched:", messages.length);
//     res.json(messages);
//   } catch (error) {
//     console.error("Error fetching messages:", error.message);
//     res.status(500).json({ error: "Failed to fetch messages" });
//   }
// });

// // Authentication Routes
// app.use("/api", authRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Server error:", err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend communication

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});