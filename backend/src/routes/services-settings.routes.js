const router = require('express').Router();
const ServicesSettings = require('../models/ServicesSettings');
const { protect, adminOnly } = require('../middlewares/auth');

const getOrCreate = async () => {
  let doc = await ServicesSettings.findById('singleton');
  if (!doc) doc = await ServicesSettings.create({ _id: 'singleton' });
  return doc;
};

router.get('/', async (req, res) => {
  try { res.json(await getOrCreate()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const allowed = ['heroLabel', 'heroTitle', 'heroDesc', 'services'];
    const update = {};
    allowed.forEach(k => { if (k in req.body) update[k] = req.body[k]; });
    const doc = await ServicesSettings.findByIdAndUpdate(
      'singleton', { $set: update }, { new: true, upsert: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
