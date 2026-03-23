const router = require('express').Router();
const { createCoupon, getCoupons, getPublicCoupons, deleteCoupon, applyCoupon, updateCoupon } = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/public', protect, getPublicCoupons);
router.post('/apply', protect, applyCoupon);
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.put('/:id', protect, adminOnly, updateCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

module.exports = router;
