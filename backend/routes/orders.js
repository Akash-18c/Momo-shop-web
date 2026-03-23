const router = require('express').Router();
const { placeOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, assignRider, getDashboardStats } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, placeOrder);
router.get('/my', protect, getUserOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/admin/stats', protect, adminOnly, getDashboardStats);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.patch('/:id/rider', protect, adminOnly, assignRider);

module.exports = router;
