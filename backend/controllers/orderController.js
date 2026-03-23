const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

exports.placeOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod, couponCode } = req.body;
    let totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true }).lean();
      if (coupon && new Date(coupon.expiry) > new Date() && totalAmount >= coupon.minOrder) {
        discount = coupon.discountType === 'percentage'
          ? (totalAmount * coupon.discount) / 100
          : coupon.discount;
        // increment usedCount without fetching full doc again
        await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount: totalAmount - discount,
      discount,
      couponCode,
      address,
      paymentMethod,
      statusHistory: [{ status: 'Placed' }],
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select('items totalAmount status createdAt paymentMethod discount couponCode address')
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('rider', 'name phone bikeName bikePlate')
      .lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('rider', 'name phone bikeName bikePlate')
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, $push: { statusHistory: { status } } },
      { new: true }
    ).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { rider: riderId || null },
      { new: true }
    ).populate('rider', 'name phone bikeName bikePlate').lean();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Run ALL aggregations in parallel — no sequential waiting
    const [
      totalOrders,
      revenueData,
      todayData,
      dailySales,
      popularItems,
      statusBreakdown,
    ] = await Promise.all([
      Order.countDocuments(),

      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),

      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),

      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
        {
          $group: {
            _id:      { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue:  { $sum: '$totalAmount' },
            orders:   { $sum: 1 },
            avgOrder: { $avg: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        {
          $group: {
            _id:     '$items.name',
            count:   { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;
    const todayRevenue = todayData[0]?.revenue || 0;
    const todayOrders  = todayData[0]?.count   || 0;
    const dailyAvg     = dailySales.length > 0
      ? dailySales.reduce((s, d) => s + d.revenue, 0) / dailySales.length
      : 0;

    res.json({
      totalOrders, totalRevenue, todayRevenue, todayOrders,
      dailyAvg, dailySales, popularItems, statusBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
