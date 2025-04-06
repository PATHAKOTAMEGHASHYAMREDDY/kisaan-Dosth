const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme", required: true },
  acres: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Declined"], default: "Pending" },
  response: { type: String, default: null }, // Added response field
  createdAt: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;