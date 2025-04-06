// models/Complaint.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  pathologistId: { type: mongoose.Schema.Types.ObjectId, ref: "Pathologist", default: null },
  type: { type: String, enum: ["suitable_crops", "crop_diseases"], required: true },
  soilType: { type: String }, // For suitable_crops
  climate: { type: String }, // For suitable_crops
  diseaseSymptoms: { type: String }, // For crop_diseases, replacing description
  contactNumber: { type: String, required: true },
  image: { type: String },
  response: { type: String, default: null },
  status: { type: String, enum: ["pending", "responded"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);
module.exports = Complaint;