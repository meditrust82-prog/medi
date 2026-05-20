const router = require('express').Router();
const { protect, adminOnly } = require('../middlewares/auth');
const gbp = require('../services/gbp.service');
const places = require('../services/places.service');

const adminGuard = [protect, adminOnly];

// ── OAuth ─────────────────────────────────────────────────────────────────────

// GET /api/v1/gbp/connect  → returns { url } for the admin to click
router.get('/connect', adminGuard, (req, res) => {
  try {
    const url = gbp.getAuthUrl();
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/gbp/callback?code=...  → called by Google after user consents
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing code' });
  try {
    await gbp.handleCallback(code);
    const frontendUrl = process.env.FRONTEND_URL || 'https://meditrustnepal.com';
    res.redirect(`${frontendUrl}/admin/dashboard?gbp=connected`);
  } catch (err) {
    console.error('GBP callback error:', err.message);
    const frontendUrl = process.env.FRONTEND_URL || 'https://meditrustnepal.com';
    res.redirect(`${frontendUrl}/admin/dashboard?gbp=error&msg=${encodeURIComponent(err.message)}`);
  }
});

// DELETE /api/v1/gbp/disconnect
router.delete('/disconnect', adminGuard, async (req, res) => {
  try {
    await gbp.disconnect();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Status ────────────────────────────────────────────────────────────────────

// GET /api/v1/gbp/status  (admin)
router.get('/status', adminGuard, async (req, res) => {
  try {
    const status = await gbp.getStatus();
    status.placesConfigured = !!(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Reviews ───────────────────────────────────────────────────────────────────

// GET /api/v1/gbp/reviews          → public (cached)
// GET /api/v1/gbp/reviews?refresh=1 → admin only, forces live fetch
router.get('/reviews', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === '1';
    if (forceRefresh) {
      const token = req.cookies?.access_token ||
        req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Authentication required' });
    }
    const data = await gbp.getReviews(forceRefresh);
    res.json(data);
  } catch (err) {
    if (err.message === 'GBP_NOT_CONNECTED') {
      // Fallback: try Google Places API
      try {
        const data = await places.getPlacesReviews(req.query.refresh === '1');
        return res.json(data);
      } catch (placesErr) {
        if (placesErr.message === 'PLACES_NOT_CONFIGURED') {
          return res.json({ reviews: [], averageRating: null, totalReviewCount: 0, notConnected: true });
        }
        return res.status(500).json({ error: placesErr.message });
      }
    }
    res.status(500).json({ error: err.message });
  }
});

// ── Business Info ─────────────────────────────────────────────────────────────

// GET /api/v1/gbp/business-info          → public (cached)
// GET /api/v1/gbp/business-info?refresh=1 → forces live fetch
router.get('/business-info', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === '1';
    const data = await gbp.getBusinessInfo(forceRefresh);
    res.json(data);
  } catch (err) {
    if (err.message === 'GBP_NOT_CONNECTED') {
      // Fallback: try Google Places API
      try {
        const data = await places.getPlacesBusinessInfo(req.query.refresh === '1');
        return res.json(data || { notConnected: true });
      } catch (placesErr) {
        return res.json({ notConnected: true });
      }
    }
    res.status(500).json({ error: err.message });
  }
});

// ── Posts ─────────────────────────────────────────────────────────────────────

// GET /api/v1/gbp/posts  (admin)
router.get('/posts', adminGuard, async (req, res) => {
  try {
    const posts = await gbp.listPosts();
    res.json({ posts });
  } catch (err) {
    if (err.message === 'GBP_NOT_CONNECTED') {
      return res.json({ posts: [], notConnected: true });
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/gbp/posts  (admin)
router.post('/posts', adminGuard, async (req, res) => {
  const { summary, callToAction, mediaUrl } = req.body;
  if (!summary || !summary.trim()) {
    return res.status(400).json({ error: 'Post summary is required' });
  }
  try {
    const post = await gbp.createPost({ summary, callToAction, mediaUrl });
    res.json({ ok: true, post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
