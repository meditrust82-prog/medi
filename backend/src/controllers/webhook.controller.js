const https = require('https');
const Order = require('../models/Order');
const {
  markPaidByGateway,
  markCancelledByGateway,
  audit,
} = require('../services/order.service');

// ─── Khalti lookup API (server-to-server) ──────────────────────────────────────

const KHALTI_TIMEOUT_MS = 8_000;

const lookupKhalti = (pidx, secretKey) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify({ pidx });
    const opts = {
      hostname: 'khalti.com',
      path: '/api/v2/epayment/lookup/',
      method: 'POST',
      headers: {
        Authorization: `Key ${secretKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(opts, (resp) => {
      let data = '';
      resp.on('data', (c) => { data += c; });
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (resp.statusCode !== 200)
            return reject(new Error(`Khalti lookup HTTP ${resp.statusCode}: ${parsed.detail || data}`));
          resolve(parsed);
        } catch {
          reject(new Error('Khalti lookup returned invalid JSON'));
        }
      });
    });
    req.on('error', reject);
    // Abort and reject if Khalti API stalls — prevents webhook handler hanging
    req.setTimeout(KHALTI_TIMEOUT_MS, () => {
      req.destroy(new Error(`Khalti lookup timed out after ${KHALTI_TIMEOUT_MS}ms`));
    });
    req.write(body);
    req.end();
  });

// ─── Khalti webhook handler ────────────────────────────────────────────────

const KHALTI_ALLOWED_IPS = () =>
  (process.env.KHALTI_ALLOWED_IPS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);

// Validate pidx: Khalti format is alphanumeric, max 100 chars
const isValidPidx = (v) => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(v);
// Validate MongoDB ObjectId format before hitting DB
const isValidObjectId = (v) => typeof v === 'string' && /^[a-f0-9]{24}$/i.test(v);

const khaltiWebhook = async (req, res) => {
  try {
    const secret = process.env.KHALTI_SECRET_KEY;
    if (!secret) return res.status(503).json({ error: 'Khalti not configured' });

    // ── Layer 1: IP allowlist ─────────────────────────────────────────
    const allowed = KHALTI_ALLOWED_IPS();
    if (allowed.length && !allowed.includes(req.ip)) {
      audit('webhook.blocked', 'unknown', { gateway: 'khalti', ip: req.ip });
      return res.status(403).json({ error: 'Forbidden' });
    }

    // ── Layer 2: Required fields + type validation ─────────────────────────
    const { pidx, purchase_order_id: orderId, status: callbackStatus } = req.body;

    if (!pidx || !orderId || !callbackStatus) {
      return res.status(400).json({ error: 'Missing fields: pidx, purchase_order_id, status' });
    }
    if (!isValidPidx(pidx)) {
      return res.status(400).json({ error: 'Invalid pidx format' });
    }
    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ error: 'Invalid purchase_order_id format' });
    }
    if (typeof callbackStatus !== 'string' || callbackStatus.length > 50) {
      return res.status(400).json({ error: 'Invalid status field' });
    }

    // ── Layer 3: Order exists ──────────────────────────────────────────────
    const order = await Order.findById(orderId).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // ── Layer 4: Idempotency — already processed? ───────────────────────────
    if (order.payment?.webhookEventId || order.status === 'paid' || order.status === 'cancelled') {
      return res.json({ received: true, idempotent: true });
    }

    // ── Layer 5: Server-to-server verification ─────────────────────────────
    let verification;
    try {
      verification = await lookupKhalti(pidx, secret);
    } catch (err) {
      audit('webhook.verify_failed', orderId, { gateway: 'khalti', pidx, error: err.message });
      // 502 = retryable — Khalti will resend
      return res.status(502).json({ error: 'Payment verification failed. Will retry.' });
    }

    if (verification.status !== 'Completed') {
      await markCancelledByGateway(orderId, { pidx, gateway: 'khalti', reason: verification.status });
      return res.json({ received: true });
    }

    // ── Layer 6: Exact amount match (Khalti uses paisa: 1 NPR = 100 paisa) ────
    const expectedPaisa = Math.round(order.totalPrice * 100);
    const receivedPaisa = Number(verification.total_amount);
    if (!Number.isFinite(receivedPaisa) || receivedPaisa !== expectedPaisa) {
      audit('webhook.amount_mismatch', orderId, {
        gateway: 'khalti', pidx,
        expected: expectedPaisa,
        received: receivedPaisa,
      });
      await markCancelledByGateway(orderId, { pidx, gateway: 'khalti', reason: 'amount_mismatch' });
      return res.status(400).json({ error: 'Payment amount mismatch' });
    }

    // ── Layer 7: Mark paid (idempotent — service guards concurrent calls) ──────
    await markPaidByGateway(orderId, {
      pidx,
      paymentId: verification.pidx,
      gateway: 'khalti',
    });

    return res.json({ received: true });

  } catch (err) {
    // Unexpected DB or runtime error — return 500 so Khalti retries
    audit('webhook.error', 'unknown', { gateway: 'khalti', error: err.message });
    return res.status(500).json({ error: 'Internal error. Will retry.' });
  }
};

module.exports = { khaltiWebhook };
