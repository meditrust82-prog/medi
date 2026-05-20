const router = require('express').Router();
const LegalSettings = require('../models/LegalSettings');
const { protect, adminOnly } = require('../middlewares/auth');

const getOrCreate = async () => {
  let doc = await LegalSettings.findById('singleton');
  if (!doc) doc = await LegalSettings.create({ _id: 'singleton' });
  return doc;
};

router.get('/', async (req, res) => {
  try { res.json(await getOrCreate()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const allowed = ['privacyTitle', 'privacyLastUpdated', 'privacyContent', 'termsTitle', 'termsLastUpdated', 'termsContent'];
    const update = {};
    allowed.forEach(k => { if (k in req.body) update[k] = req.body[k]; });
    const doc = await LegalSettings.findByIdAndUpdate(
      'singleton', { $set: update }, { new: true, upsert: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
