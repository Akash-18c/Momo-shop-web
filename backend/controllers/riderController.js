const Rider = require('../models/Rider');

exports.getRiders = async (req, res) => {
  try {
    const riders = await Rider.find().sort({ createdAt: -1 });
    res.json(riders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createRider = async (req, res) => {
  try {
    const rider = await Rider.create(req.body);
    res.status(201).json(rider);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateRider = async (req, res) => {
  try {
    const rider = await Rider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(rider);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteRider = async (req, res) => {
  try {
    await Rider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rider deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.toggleRider = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    rider.isActive = !rider.isActive;
    await rider.save();
    res.json(rider);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
