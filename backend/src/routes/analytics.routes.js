const router = require('express').Router();
const { getDashboardAnalytics } = require('../controllers/analytics.controller');
const { protect, adminOnly } = require('../middlewares/auth');

// Admin-only analytics
router.get('/dashboard', protect, adminOnly, getDashboardAnalytics);

module.exports = router;
