const svc = require('../services/product.service');

const getProducts = async (req, res, next) => {
  try {
    const adminView = req.user?.role === 'admin';
    const result = await svc.listProducts(req.query, adminView);
    res.set('Cache-Control', adminView ? 'private' : 'public, max-age=10');
    res.json(result);
  } catch (err) { next(err); }
};

const getProduct = async (req, res, next) => {
  try {
    const adminView = req.user?.role === 'admin';
    const product = await svc.findBySlug(req.params.slug, adminView);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.set('Cache-Control', adminView ? 'private' : 'public, max-age=120');
    res.json(product);
  } catch (err) { next(err); }
};

const parseBody = (body) => {
  const b = body.badges;
  const parsed = { ...body, badges: b ? (Array.isArray(b) ? b : [b]) : [] };
  if (parsed.price !== undefined && parsed.price !== '') parsed.price = Number(parsed.price);
  if (parsed.stock !== undefined && parsed.stock !== '') parsed.stock = Number(parsed.stock);
  if (parsed.originalPrice !== undefined && parsed.originalPrice !== '') {
    parsed.originalPrice = Number(parsed.originalPrice);
  } else {
    delete parsed.originalPrice;
  }
  if (parsed.cost !== undefined && parsed.cost !== '') {
    parsed.cost = Number(parsed.cost);
  } else {
    delete parsed.cost;
  }
  return parsed;
};

const createProduct = async (req, res, next) => {
  try {
    const product = await svc.createProduct(parseBody(req.body), req.files);
    res.status(201).json(product);
  } catch (err) { next(err); }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await svc.updateProduct(req.params.id, parseBody(req.body), req.files);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await svc.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) { next(err); }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
