const router = require('express').Router();
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middlewares/auth');

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// GET /api/v1/blogs  — public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).select('-content').lean(),
      Blog.countDocuments(filter),
    ]);
    res.json({ blogs, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/v1/blogs/all  — admin (includes unpublished)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    res.json({ blogs, total: blogs.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/v1/blogs/:slug  — public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true }).lean();
    if (!blog) return res.status(404).json({ error: 'Post not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/v1/blogs  — admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, image, author, category, tags, published, metaTitle, metaDesc } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const slug = slugify(title);
    const blog = await Blog.create({ title, slug, excerpt, content, image, author, category, tags, published, metaTitle, metaDesc });
    res.status(201).json(blog);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'A post with this title already exists' });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/v1/blogs/:id  — admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, image, author, category, tags, published, metaTitle, metaDesc } = req.body;
    const update = { excerpt, content, image, author, category, tags, published, metaTitle, metaDesc };
    if (title) { update.title = title; update.slug = slugify(title); }
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!blog) return res.status(404).json({ error: 'Post not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/v1/blogs/:id  — admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
