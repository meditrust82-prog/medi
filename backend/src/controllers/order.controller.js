const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { listOrders, transitionOrder, audit } = require('../services/order.service');

const VALID_GATEWAYS = new Set(['khalti']);
// Payment window: 30 min — matches expireStalePayments default
const PAYMENT_EXPIRY_MS = 30 * 60 * 1000;

const createOrder = async (req, res, next) => {
  if (process.env._MONGO_TRANSACTIONS === 'false') {
    return res.status(503).json({
      error: 'Order placement is unavailable: this database tier does not support atomic transactions. Please contact support.',
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items, shippingAddress, notes, gateway } = req.body;

    // ── 1. Stock check (inside session) ─────────────────────────────────────
    const ids = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: ids } }).session(session);
    const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

    let totalPrice = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = productMap[item.product];
      if (!product) {
        const err = new Error(`Product ${item.product} not found`);
        err.status = 400;
        throw err;
      }
      // Re-check inside transaction — this is the authoritative stock read
      if (product.stock < item.quantity) {
        const err = new Error(`Insufficient stock for "${product.name}"`);
        err.status = 400;
        throw err;
      }
      totalPrice += product.price * item.quantity;
      resolvedItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.price,
        cost: product.cost || 0, // snapshot cost at time of sale
        quantity: item.quantity,
      });
    }

    // ── 2. Stock decrement (inside session) ─────────────────────────────────
    const bulkResult = await Product.bulkWrite(
      resolvedItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product, stock: { $gte: item.quantity } },
          update: { $inc: { stock: -item.quantity } },
        },
      })),
      { session }
    );

    // Guard: if any bulkWrite filter missed (concurrent depletion), abort
    if (bulkResult.modifiedCount !== resolvedItems.length) {
      const err = new Error('Stock changed during checkout. Please refresh and try again.');
      err.status = 409;
      throw err;
    }

    // ── 3. Payment state initialization (inside session) ────────────────────
    const useGateway = gateway && VALID_GATEWAYS.has(gateway) ? gateway : null;
    const initialStatus = useGateway ? 'awaiting_payment' : 'pending';
    const paymentInit = useGateway
      ? {
          gateway: useGateway,
          amount: totalPrice,
          expiresAt: new Date(Date.now() + PAYMENT_EXPIRY_MS),
        }
      : {};

    // ── 4. Order creation (inside session) ──────────────────────────────────
    const [order] = await Order.create([{
      user: req.user._id,
      items: resolvedItems,
      totalPrice,
      status: initialStatus,
      payment: paymentInit,
      shippingAddress,
      notes,
    }], { session });

    // ── All four steps committed atomically ──────────────────────────────────
    await session.commitTransaction();
    audit('order.created', order._id, {
      user: String(req.user._id),
      totalPrice,
      status: initialStatus,
      gateway: useGateway,
    });
    res.status(201).json(order);
  } catch (err) {
    // abortTransaction can itself throw (e.g. session already closed by driver)
    // Swallow that error so the original error propagates correctly
    try { await session.abortTransaction(); } catch { /* swallow */ }
    next(err);
  } finally {
    // Always release the session regardless of commit/abort outcome
    try { session.endSession(); } catch { /* swallow */ }
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Math.min(Number(limit), 50);
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(Math.min(Number(limit), 50)).lean(),
      Order.countDocuments({ user: req.user._id }),
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Math.min(Number(limit), 50)) });
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name slug').lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const result = await listOrders(req.query);
    res.json(result);
  } catch (err) { next(err); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await transitionOrder(
      req.params.id,
      req.body.status,
      String(req.user._id)
    );
    res.json(order);
  } catch (err) {
    // Pass structured status from service error through
    if (err.status) res.status(err.status).json({ error: err.message, allowed: err.allowed });
    else next(err);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
