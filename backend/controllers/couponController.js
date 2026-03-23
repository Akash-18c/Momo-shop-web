const Coupon = require('../models/Coupon');

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// public: active, non-expired, not exhausted — for checkout page
exports.getPublicCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiry: { $gt: new Date() },
      $expr: { $lt: ['$usedCount', '$maxUses'] },
    }).select('code discount discountType minOrder expiry').sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (new Date(coupon.expiry) < new Date()) return res.status(400).json({ message: 'Coupon expired' });
    if (orderAmount < coupon.minOrder) return res.status(400).json({ message: `Minimum order ₹${coupon.minOrder} required` });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon usage limit reached' });

    const discount = coupon.discountType === 'percentage'
      ? (orderAmount * coupon.discount) / 100
      : coupon.discount;

    res.json({ discount, discountType: coupon.discountType, discountValue: coupon.discount, message: 'Coupon applied!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
