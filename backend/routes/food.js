const router = require('express').Router();
const { getAllFoods, getFeatured, createFood, updateFood, deleteFood, toggleAvailability } = require('../controllers/foodController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getAllFoods);
router.get('/featured', getFeatured);
router.post('/', protect, adminOnly, upload.single('image'), createFood);
router.put('/:id', protect, adminOnly, upload.single('image'), updateFood);
router.delete('/:id', protect, adminOnly, deleteFood);
router.patch('/:id/toggle', protect, adminOnly, toggleAvailability);

module.exports = router;
