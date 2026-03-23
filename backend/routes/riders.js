const router = require('express').Router();
const { getRiders, createRider, updateRider, deleteRider, toggleRider } = require('../controllers/riderController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/',           protect, adminOnly, getRiders);
router.post('/',          protect, adminOnly, createRider);
router.put('/:id',        protect, adminOnly, updateRider);
router.delete('/:id',     protect, adminOnly, deleteRider);
router.patch('/:id/toggle', protect, adminOnly, toggleRider);

module.exports = router;
