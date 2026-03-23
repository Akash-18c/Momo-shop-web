const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  phone:      { type: String, required: true },
  bikeName:   { type: String, required: true },
  bikePlate:  { type: String, required: true, uppercase: true },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Rider', riderSchema);
