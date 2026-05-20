const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, trim: true, unique: true },
  excerpt:     { type: String, trim: true },
  content:     { type: String },
  image:       { type: String },
  author:      { type: String, default: 'Meditrust Nepal' },
  category:    { type: String, trim: true },
  tags:        [{ type: String }],
  published:   { type: Boolean, default: true },
  metaTitle:   { type: String },
  metaDesc:    { type: String },
}, { timestamps: true });

blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1, createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
