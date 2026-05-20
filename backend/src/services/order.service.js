const Order = require('../models/Order');

// ─── State machine ───────────────────────────────────────────────────────────────────

//  pending → awaiting_payment → paid → confirmed → shipped → delivered
//  Any non-terminal state → cancelled
//
//  RULES:
//  - 'paid' is ONLY set by the payment webhook (never via PATCH /status)
//  - 'delivered' is terminal: no further transitions
//  - 'cancelled' is terminal
const STATE_MACHINE = {
  pending:          ['awaiting_payment', 'cancelled'],
  awaiting_payment: ['cancelled'],           // ← webhook moves this to 'paid'
  paid:             ['confirmed'],           // admin confirms after payment
  confirmed:        ['shipped',   'cancelled'],
  shipped:          ['delivered'],
  delivered:        [],
  cancelled:        [],
};

const canTransition = (from, to) => (STATE_MACHINE[from] ?? []).includes(to);

// ─── Audit log helper ───────────────────────────────────────────────────────────────

const audit = (event, orderId, meta = {}) => {
  const entry = {
    ts: new Date().toISOString(),
    event,
    orderId: String(orderId),
    ...meta,
  };
  // Structured JSON line — piped to Railway/Render log aggregation
  // Replace with a proper logger (pino/winston) when needed
  console.log(JSON.stringify(entry));
};

// ─── Pure service functions (no req/res) ───────────────────────────────────────────

/**
 * List all orders (admin). Returns plain data, not an HTTP response.
 */
const listOrders = async ({ status, page = 1, limit = 20 } = {}) => {
  const filter = status ? { status } : {};
  const safLimit = Math.min(Number(limit), 100);
  const skip = (Number(page) - 1) * safLimit;
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(safLimit)
      .lean(),
    Order.countDocuments(filter),
  ]);
  return { orders, total, page: Number(page), pages: Math.ceil(total / safLimit) };
};

/**
 * Transition an order to a new status.
 * 'paid' is blocked — only the payment webhook may set it.
 * Returns the updated order doc.
 * Throws a structured error on invalid transition.
 */
const transitionOrder = async (orderId, toStatus, actor = 'admin') => {
  if (toStatus === 'paid') {
    throw Object.assign(
      new Error('Payment status is set by the payment gateway only'),
      { status: 400 }
    );
  }

  const order = await Order.findById(orderId);
  if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });

  if (!canTransition(order.status, toStatus)) {
    throw Object.assign(
      new Error(`Invalid transition: ${order.status} → ${toStatus}`),
      { status: 400, allowed: STATE_MACHINE[order.status] }
    );
  }

  const prevStatus = order.status;
  order.status = toStatus;
  await order.save();

  audit('order.status_changed', orderId, { from: prevStatus, to: toStatus, actor });
  return order;
};

/**
 * Mark an order as paid by the payment gateway.
 * Idempotent: if already paid with the same webhookEventId, returns existing doc.
 */
const markPaidByGateway = async (orderId, { pidx, paymentId, gateway }) => {
  const updated = await Order.findOneAndUpdate(
    {
      _id: orderId,
      'payment.webhookEventId': null,
      status: { $ne: 'paid' },
    },
    {
      status: 'paid',
      'payment.paidAt':         new Date(),
      'payment.paymentId':      paymentId,
      'payment.webhookEventId': pidx,
    },
    { new: true }
  );

  if (updated) {
    audit('payment.success', orderId, { gateway, pidx, paymentId });
  }
  return updated; // null = already processed (idempotent replay)
};

/**
 * Mark an order as cancelled due to a failed/mismatched payment.
 * Idempotent: only transitions if not already terminal.
 */
const markCancelledByGateway = async (orderId, { pidx, gateway, reason }) => {
  const updated = await Order.findOneAndUpdate(
    {
      _id: orderId,
      'payment.webhookEventId': null,
      status: { $nin: ['paid', 'cancelled', 'delivered'] },
    },
    {
      status: 'cancelled',
      'payment.webhookEventId': pidx,
    },
    { new: true }
  );

  if (updated) {
    audit('payment.failed', orderId, { gateway, pidx, reason });
  }
  return updated;
};

/**
 * Cleanup: expire orders stuck in awaiting_payment beyond their deadline.
 * Call this from a simple setInterval or a cron route — no queue needed.
 * Default window: 30 minutes.
 */
const expireStalePayments = async (windowMinutes = 30) => {
  const cutoff = new Date(Date.now() - windowMinutes * 60 * 1000);
  const result = await Order.updateMany(
    {
      status: 'awaiting_payment',
      // Use payment.expiresAt if set, otherwise fall back to createdAt
      $or: [
        { 'payment.expiresAt': { $lt: new Date() } },
        { 'payment.expiresAt': null, createdAt: { $lt: cutoff } },
      ],
    },
    { status: 'cancelled' }
  );
  if (result.modifiedCount > 0) {
    audit('payment.expired_batch', 'batch', {
      expired: result.modifiedCount,
      windowMinutes,
    });
  }
  return result.modifiedCount;
};

module.exports = {
  STATE_MACHINE,
  canTransition,
  audit,
  listOrders,
  transitionOrder,
  markPaidByGateway,
  markCancelledByGateway,
  expireStalePayments,
};
