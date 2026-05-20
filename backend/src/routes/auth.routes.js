const router = require('express').Router();
const { body } = require('express-validator');
const { login, refresh, logout, me, updateProfile } = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.post('/login', [
  body('email').trim().notEmpty().withMessage('Username or email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
], login);

router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, me);
router.put('/profile', protect, adminOnly, updateProfile);

module.exports = router;
