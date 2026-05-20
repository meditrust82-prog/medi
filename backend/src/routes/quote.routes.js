const router = require('express').Router();
const Quote = require('../models/Quote');
const { protect, adminOnly } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

const quoteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many quote requests. Please wait a minute and try again.' },
});

// ── Public: create a quote lead ─────────────────────────────────
router.post('/', quoteLimiter, async (req, res, next) => {
  try {
    const { productName, productSlug, name, hospitalName, phone, email, message, qty, source } = req.body;
    if (!productName || !name || !phone) return res.status(400).json({ error: 'productName, name and phone are required' });
    const quote = await Quote.create({ productName, productSlug, name, hospitalName, phone, email, message, qty, source });
    res.status(201).json({ ok: true, quoteId: quote._id });
  } catch (err) { next(err); }
});

// ── Public: customer lookup by phone ────────────────────────────
const lookupLimiter = rateLimit({ windowMs: 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false });
router.get('/my', lookupLimiter, async (req, res, next) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'phone is required' });
    const quotes = await Quote.find({ phone: { $regex: phone.replace(/[^0-9]/g, ''), $options: 'i' } })
      .select('productName hospitalName status createdAt message')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ quotes });
  } catch (err) { next(err); }
});

// ── Admin: list / update ────────────────────────────────────────
router.use(protect, adminOnly);

router.get('/', async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const filter = status ? { status } : {};
    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
    const total = await Quote.countDocuments(filter);
    res.json({ quotes, total });
  } catch (err) { next(err); }
});

router.get('/stats', async (req, res, next) => {
  try {
    const [total, newQ, contacted, converted, lost] = await Promise.all([
      Quote.countDocuments(),
      Quote.countDocuments({ status: 'new' }),
      Quote.countDocuments({ status: 'contacted' }),
      Quote.countDocuments({ status: 'converted' }),
      Quote.countDocuments({ status: 'lost' }),
    ]);
    res.json({ total, new: newQ, contacted, converted, lost });
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    const quote = await Quote.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json({ quote });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
