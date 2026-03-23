const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Momo', 'Spring Rolls', 'Wings', 'Fries', 'Burger', 'Desserts', 'Beverages'],
  },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.0 },
}, { timestamps: true });

// Indexes for fast filtering/searching
foodSchema.index({ category: 1, isAvailable: 1 });
foodSchema.index({ isFeatured: 1, isAvailable: 1 });
foodSchema.index({ isVeg: 1 });
foodSchema.index({ name: 'text' }); // full-text search
foodSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Food', foodSchema);
