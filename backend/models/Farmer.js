// models/Farmer.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  otp: {
    type: String, // Store the OTP temporarily
    default: null,
  },
  otpExpires: {
    type: Date, // Expiration time for OTP
    default: null,
  },
  isVerified: {
    type: Boolean, // Track if email is verified
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
farmerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
farmerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;