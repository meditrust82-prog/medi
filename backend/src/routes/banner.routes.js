const router = require('express').Router();
const Banner = require('../models/Banner');
const { protect, adminOnly } = require('../middlewares/auth');
const { uploadToCloudinary } = require('../utils/cloudinary');
const multerUpload = require('../utils/multer');

// ── Public: get active banners for a placement ──────────────────
router.get('/', async (req, res, next) => {
  try {
    const { placement } = req.query;
    const now = new Date();
    const filter = {
      active: true,
      $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }],
      $and: [{ $or: [{ endsAt: { $exists: false } }, { endsAt: null }, { endsAt: { $gte: now } }] }],
    };
    if (placement) filter.placement = placement;
    const banners = await Banner.find(filter).sort({ priority: -1, createdAt: -1 }).lean();
    res.json({ banners });
  } catch (err) { next(err); }
});

// ── Public: record a click ──────────────────────────────────────
router.post('/:id/click', async (req, res, next) => {
  try {
    await Banner.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Admin: full CRUD ────────────────────────────────────────────
router.use(protect, adminOnly);

router.get('/admin/all', async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ priority: -1, createdAt: -1 }).lean();
    res.json({ banners });
  } catch (err) { next(err); }
});

router.post('/', multerUpload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const uploaded = await uploadToCloudinary([req.file]);
      data.imageUrl = uploaded[0]?.url || uploaded[0]?.path || null;
    }
    if (data.active !== undefined) data.active = data.active === 'true' || data.active === true;
    if (data.priority !== undefined) data.priority = Number(data.priority) || 0;
    const banner = await Banner.create(data);
    res.status(201).json({ banner });
  } catch (err) { next(err); }
});

router.put('/:id', multerUpload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const uploaded = await uploadToCloudinary([req.file]);
      data.imageUrl = uploaded[0]?.url || uploaded[0]?.path || null;
    }
    if (data.active !== undefined) data.active = data.active === 'true' || data.active === true;
    if (data.priority !== undefined) data.priority = Number(data.priority) || 0;
    const banner = await Banner.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json({ banner });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
