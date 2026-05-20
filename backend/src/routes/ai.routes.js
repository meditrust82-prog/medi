const router = require('express').Router();
const { chat, recommend, finder } = require('../controllers/ai.controller');
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many AI requests, please slow down.' },
});

const aiSearchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many recommendation requests, please slow down.' },
});

router.post('/chat', chatLimiter, chat);
router.post('/recommend', aiSearchLimiter, recommend);
router.post('/finder', aiSearchLimiter, finder);

module.exports = router;
