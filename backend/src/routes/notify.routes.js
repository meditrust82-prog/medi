const router = require('express').Router();
const https = require('https');
const Subscriber = require('../models/Subscriber');
const { protect, adminOnly } = require('../middlewares/auth');

const sendTelegram = (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
    return Promise.resolve();
  }
  const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: 'api.telegram.org', path: `/bot${token}/sendMessage`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      (res) => { res.resume(); resolve(); }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
};

// POST /api/v1/notify/newsletter  — public
router.post('/newsletter', async (req, res) => {
  try {
    const { name, phone, source } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'name and phone required' });
    // Upsert — prevent duplicates by phone
    await Subscriber.findOneAndUpdate(
      { phone },
      { name, phone, source: source || 'home_newsletter', active: true },
      { upsert: true, new: true }
    );
    await sendTelegram(
      `📬 <b>Newsletter Signup</b>\n👤 Name: ${name}\n📞 Phone: ${phone}\n🌐 Source: meditrustnepal.com`
    ).catch(() => {});
    res.json({ ok: true });
  } catch (err) {
    console.error('Newsletter error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// GET /api/v1/notify/subscribers  — admin only
router.get('/subscribers', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const [subscribers, total] = await Promise.all([
      Subscriber.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
      Subscriber.countDocuments(),
    ]);
    res.json({ subscribers, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/v1/notify/subscribers/:id  — admin only
router.delete('/subscribers/:id', protect, adminOnly, async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/v1/notify/quote  (reuse for quote alerts too)
router.post('/quote', async (req, res) => {
  try {
    const { name, phone, product, message } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'name and phone required' });
    await sendTelegram(
      `🏥 <b>New Quote Request</b>\n👤 Name: ${name}\n📞 Phone: ${phone}${product ? `\n📦 Product: ${product}` : ''}${message ? `\n💬 Message: ${message}` : ''}\n🌐 Source: meditrustnepal.com`
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Telegram notify error:', err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = { router, sendTelegram };
