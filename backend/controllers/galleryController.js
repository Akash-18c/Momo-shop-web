const Gallery = require('../models/Gallery');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

exports.getImages = async (req, res) => {
  try {
    const images = await Gallery.find()
      .select('imageUrl caption createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Gallery changes rarely — cache 60s, stale 5 min
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const result = await uploadToCloudinary(req.file.buffer);
    const image = await Gallery.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      caption: req.body.caption || '',
    });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadImageUrl = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'Image URL is required' });
    const image = await Gallery.create({ imageUrl, publicId: '', caption: caption || '' });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id).lean();
    if (!image) return res.status(404).json({ message: 'Image not found' });
    if (image.publicId) await cloudinary.uploader.destroy(image.publicId);
    await Gallery.deleteOne({ _id: req.params.id });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
