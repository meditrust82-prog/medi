const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    cost: { type: Number, min: 0, default: 0 }, // admin-only: actual cost for profit calculation
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    images: [{ url: String, alt: String }],
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    specifications: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    badges: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
