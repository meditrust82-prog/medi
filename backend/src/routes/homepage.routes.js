const router = require('express').Router();
const HomepageSettings = require('../models/HomepageSettings');
const { protect, adminOnly } = require('../middlewares/auth');

const getOrCreate = async () => {
  let doc = await HomepageSettings.findById('singleton');
  if (!doc) {
    doc = await HomepageSettings.create({ _id: 'singleton' });
  }
  return doc;
};

// GET /api/v1/homepage  — public
router.get('/', async (req, res) => {
  try {
    const doc = await getOrCreate();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/v1/homepage  — admin only
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const allowed = ['heroBadge', 'heroTitle', 'heroSubtitle', 'heroPrimaryBtn', 'heroSecondaryBtn', 'stats', 'trustedBy', 'whyChooseUs'];
    const update = {};
    allowed.forEach(k => { if (k in req.body) update[k] = req.body[k]; });
    const doc = await HomepageSettings.findByIdAndUpdate(
      'singleton',
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
