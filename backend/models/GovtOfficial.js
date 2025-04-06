// models/GovtOfficial.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const govtOfficialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobileNo: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  officialId: {
    type: String,
    required: true,
    unique: true, // Ensure official ID is unique
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
govtOfficialSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to check password
govtOfficialSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const GovtOfficial = mongoose.model('GovtOfficial', govtOfficialSchema);
module.exports = GovtOfficial;