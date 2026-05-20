const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const { uploadToCloudinary } = require('../utils/cloudinary');

const ALLOWED_SORT_FIELDS = new Set(['-createdAt', 'createdAt', '-price', 'price', '-name', 'name', '-updatedAt']);
const ALLOWED_FIELDS = ['name', 'slug', 'description', 'specifications', 'price', 'originalPrice', 'cost', 'stock', 'category', 'brand', 'featured', 'images', 'metaTitle', 'metaDescription', 'metaKeywords', 'badges'];
const pick = (data) => Object.fromEntries(ALLOWED_FIELDS.filter(k => k in data).map(k => [k, data[k]]));

// Strip internal fields and replace exact stock with an inStock boolean for public consumers.
const sanitizePublic = (p) => {
  if (!p) return p;
  const { __v, stock, ...rest } = p;
  return { ...rest, inStock: (stock ?? 0) > 0 };
};

const listProducts = async (query, adminView = false) => {
  const { category, search, featured, page = 1 } = query;
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 100);
  const sort = ALLOWED_SORT_FIELDS.has(query.sort) ? query.sort : '-createdAt';
  const filter = {};

  if (category) {
    const cat = String(category).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.category = { $regex: `^${cat}$`, $options: 'i' };
  }
  if (featured === 'true') filter.featured = true;
  if (search) {
    const term = String(search).slice(0, 200).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { category: { $regex: term, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * limit;
  const selectFields = adminView ? '' : '-cost'; // hide cost from public
  const [products, total] = await Promise.all([
    Product.find(filter).select(selectFields).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const out = adminView ? products : products.map(sanitizePublic);
  return { products: out, total, page: Number(page), pages: Math.ceil(total / limit) };
};

const findBySlug = async (slug, adminView = false) => {
  const selectFields = adminView ? '' : '-cost';
  const product = await Product.findOne({ slug }).select(selectFields).lean();
  return adminView ? product : sanitizePublic(product);
};

const createProduct = async (data, files) => {
  const safe = pick(data);
  if (files?.length) {
    safe.images = await uploadToCloudinary(files);
  }
  return Product.create(safe);
};

const updateProduct = async (id, data, files) => {
  const safe = pick(data);
  if (files?.length) {
    safe.images = await uploadToCloudinary(files);
  }
  const update = { $set: safe };
  if (!('originalPrice' in safe)) update.$unset = { originalPrice: '' };
  return Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
};

const deleteProduct = async (id) => Product.findByIdAndDelete(id);

module.exports = { listProducts, findBySlug, createProduct, updateProduct, deleteProduct };
