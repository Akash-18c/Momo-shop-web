const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    image: String,
  }],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  address: {
    name: String,
    phone: String,
    street: String,
    city: String,
    pincode: String,
  },
  paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  status: {
    type: String,
    enum: ['Placed', 'Accepted', 'Preparing', 'On the Way', 'Arriving Soon', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },
  statusHistory: [{
    status: String,
    time: { type: Date, default: Date.now },
  }],
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', default: null },
}, { timestamps: true });

// Indexes for fast lookups
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
