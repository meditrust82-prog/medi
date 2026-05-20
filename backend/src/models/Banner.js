const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title:       { type: String, required: true, maxlength: 120 },
  subtitle:    { type: String, maxlength: 240 },
  imageUrl:    { type: String },
  linkUrl:     { type: String, maxlength: 500 },
  linkLabel:   { type: String, maxlength: 60, default: 'Learn More' },
  bgColor:     { type: String, default: '#005EEA' },
  textColor:   { type: String, default: '#ffffff' },
  placement:   {
    type: String,
    enum: ['announcement', 'home_hero', 'home_mid', 'products_sidebar', 'products_inline', 'product_detail'],
    required: true,
  },
  priority:    { type: Number, default: 0 },
  clicks:      { type: Number, default: 0 },
  active:      { type: Boolean, default: true },
  startsAt:    { type: Date },
  endsAt:      { type: Date },
}, { timestamps: true });

bannerSchema.index({ placement: 1, active: 1, priority: -1 });

module.exports = mongoose.model('Banner', bannerSchema);
