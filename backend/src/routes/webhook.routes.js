const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { khaltiWebhook } = require('../controllers/webhook.controller');

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many webhook requests' },
});

router.post('/khalti', webhookLimiter, khaltiWebhook);

module.exports = router;
