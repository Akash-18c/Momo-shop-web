const router = require('express').Router();
const { createCoupon, getCoupons, getPublicCoupons, deleteCoupon, applyCoupon } = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/public', protect, getPublicCoupons);   // logged-in users see available coupons
router.post('/apply', protect, applyCoupon);
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

module.exports = router;
