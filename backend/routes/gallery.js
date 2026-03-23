const router = require('express').Router();
const { getImages, uploadImage, uploadImageUrl, deleteImage } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getImages);
router.post('/', protect, adminOnly, upload.single('image'), uploadImage);
router.post('/url', protect, adminOnly, uploadImageUrl);
router.delete('/:id', protect, adminOnly, deleteImage);

module.exports = router;
