const router = require('express').Router();
const { body, param } = require('express-validator');
const {
  createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus,
} = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// 'paid' is intentionally excluded — only the payment gateway may set it
const ORDER_STATUSES = ['awaiting_payment', 'confirmed', 'shipped', 'delivered', 'cancelled'];

router.post('/', protect, [
  body('items').isArray({ min: 1, max: 50 }).withMessage('items must be a non-empty array (max 50)'),
  body('items.*.product').isMongoId().withMessage('Each item must have a valid product ID'),
  body('items.*.quantity').isInt({ min: 1, max: 9999 }).withMessage('Quantity must be between 1 and 9999'),
  body('shippingAddress.name').trim().notEmpty().isLength({ max: 100 }),
  body('shippingAddress.phone').trim().notEmpty().isLength({ max: 30 }),
  body('shippingAddress.addressLine').trim().notEmpty().isLength({ max: 300 }),
  body('shippingAddress.city').trim().notEmpty().isLength({ max: 100 }),
  body('notes').optional().isString().isLength({ max: 500 }),
  body('gateway').optional().isIn(['khalti']).withMessage('gateway must be khalti'),
  validate,
], createOrder);

router.get('/my', protect, getMyOrders);
router.get('/:id', protect, [param('id').isMongoId(), validate], getOrder);
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, [
  param('id').isMongoId(),
  body('status').isIn(ORDER_STATUSES).withMessage(`status must be one of: ${ORDER_STATUSES.join(', ')}`),
  validate,
], updateOrderStatus);

module.exports = router;
