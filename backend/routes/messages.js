const router = require('express').Router();
const { sendMessage, getMessages, markRead, deleteMessage } = require('../controllers/messageController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', sendMessage);
router.get('/', protect, adminOnly, getMessages);
router.patch('/:id/read', protect, adminOnly, markRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;
