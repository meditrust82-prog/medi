const router = require('express').Router();
const { body } = require('express-validator');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
} = require('../controllers/product.controller');
const { protect, adminOnly, optionalAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const upload = require('../utils/multer');
const multer = require('multer');
const Product = require('../models/Product');
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const csvUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

const productRules = [
  body('name').trim().notEmpty().isLength({ max: 200 }),
  body('slug').trim().notEmpty().matches(/^[a-z0-9-]+$/),
  body('price').isFloat({ min: 0 }),
  body('category').trim().notEmpty(),
  validate,
];

const updateRules = [
  body('name').optional().trim().notEmpty().isLength({ max: 200 }),
  body('slug').optional().trim().matches(/^[a-z0-9-]+$/),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().trim().notEmpty(),
  validate,
];

router.get('/', optionalAuth, getProducts);

// ── CSV Export ──────────────────────────────────────────────────
router.get('/export.csv', protect, adminOnly, async (req, res, next) => {
  try {
    const products = await Product.find({}).lean();
    const COLS = ['name', 'slug', 'category', 'brand', 'price', 'originalPrice', 'stock', 'description', 'metaTitle', 'metaDescription', 'metaKeywords', 'featured', 'badges'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [COLS.join(',')];
    for (const p of products) {
      rows.push(COLS.map(c => {
        if (c === 'badges') return esc((p.badges || []).join('|'));
        if (c === 'featured') return esc(p.featured ? 'true' : 'false');
        return esc(p[c] ?? '');
      }).join(','));
    }
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', `attachment; filename="products-${Date.now()}.csv"`);
    res.send(rows.join('\r\n'));
  } catch (err) { next(err); }
});

// ── Quote CSV Export ────────────────────────────────────────────
const Quote = require('../models/Quote');
router.get('/quotes-export.csv', protect, adminOnly, async (req, res, next) => {
  try {
    const quotes = await Quote.find({}).lean();
    const COLS = ['productName', 'name', 'hospitalName', 'phone', 'email', 'message', 'status', 'source', 'adminNotes', 'createdAt'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [COLS.join(',')];
    for (const q of quotes) rows.push(COLS.map(c => esc(c === 'createdAt' ? new Date(q.createdAt).toISOString() : q[c])).join(','));
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', `attachment; filename="quotes-${Date.now()}.csv"`);
    res.send(rows.join('\r\n'));
  } catch (err) { next(err); }
});

// ── CSV Import ──────────────────────────────────────────────────
router.post('/import-csv', protect, adminOnly, csvUpload.single('csv'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No CSV file uploaded' });
    const text = req.file.buffer.toString('utf8');
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return res.status(400).json({ error: 'CSV must have a header row and at least one data row' });

    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    const parseRow = (line) => {
      const vals = [];
      let inQ = false, cur = '';
      for (const ch of line) {
        if (ch === '"') { inQ = !inQ; continue; }
        if (ch === ',' && !inQ) { vals.push(cur); cur = ''; continue; }
        cur += ch;
      }
      vals.push(cur);
      return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || '').trim()]));
    };

    const results = { created: 0, updated: 0, errors: [] };
    for (let i = 1; i < lines.length; i++) {
      try {
        const row = parseRow(lines[i]);
        if (!row.name) continue;
        const slug = row.slug || slugify(row.name);
        const data = {
          name: row.name,
          slug,
          category: row.category || 'General',
          brand: row.brand || undefined,
          price: Number(row.price) || 0,
          originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
          stock: row.stock !== undefined ? Number(row.stock) : 0,
          description: row.description || undefined,
          metaTitle: row.metaTitle || undefined,
          metaDescription: row.metaDescription || undefined,
          metaKeywords: row.metaKeywords || undefined,
          featured: row.featured === 'true',
          badges: row.badges ? row.badges.split('|').map(b => b.trim()).filter(Boolean) : [],
        };
        const existing = await Product.findOne({ slug });
        if (existing) {
          await Product.findByIdAndUpdate(existing._id, { $set: data });
          results.updated++;
        } else {
          await Product.create(data);
          results.created++;
        }
      } catch (e) {
        results.errors.push(`Row ${i}: ${e.message}`);
      }
    }
    res.json({ ok: true, ...results });
  } catch (err) { next(err); }
});

router.get('/:slug', optionalAuth, getProduct);
router.post('/', protect, adminOnly, upload.array('images', 6), productRules, createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 6), updateRules, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
