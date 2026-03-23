const Food = require('../models/Food');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

// Fields returned in list views — skip heavy/unused fields
const LIST_FIELDS = 'name description price category image isVeg isAvailable isFeatured rating';

exports.getAllFoods = async (req, res) => {
  try {
    const { category, search, isVeg } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.$text = { $search: search }; // uses text index — much faster than $regex
    if (isVeg !== undefined) filter.isVeg = isVeg === 'true';

    const foods = await Food.find(filter)
      .select(LIST_FIELDS)
      .sort({ createdAt: -1 })
      .lean(); // plain JS objects, ~40% faster than Mongoose docs

    // Cache for 30s on client, 60s on CDN/proxy — menu rarely changes
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const foods = await Food.find({ isFeatured: true, isAvailable: true })
      .select(LIST_FIELDS)
      .limit(8)
      .lean();

    // Featured items can be cached longer — 60s client, 120s stale
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFood = async (req, res) => {
  try {
    const { name, description, price, category, isVeg, isFeatured } = req.body;
    let image = '', imagePublicId = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
      imagePublicId = result.public_id;
    }
    const food = await Food.create({ name, description, price, category, isVeg, isFeatured, image, imagePublicId });
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).lean();
    if (!food) return res.status(404).json({ message: 'Food not found' });
    const update = { ...req.body };
    if (req.file) {
      if (food.imagePublicId) await cloudinary.uploader.destroy(food.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer);
      update.image = result.secure_url;
      update.imagePublicId = result.public_id;
    }
    const updated = await Food.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).lean();
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.imagePublicId) await cloudinary.uploader.destroy(food.imagePublicId);
    await Food.deleteOne({ _id: req.params.id });
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    food.isAvailable = !food.isAvailable;
    await food.save();
    res.json({ _id: food._id, isAvailable: food.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
