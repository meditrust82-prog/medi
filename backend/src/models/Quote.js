const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productSlug: { type: String },
  name:         { type: String, required: true },
  hospitalName: { type: String },
  phone:        { type: String, required: true },
  email:        { type: String },
  message:      { type: String },
  qty:          { type: Number, default: 1 },
  source:       { type: String, enum: ['product_detail', 'bulk_inquiry', 'cart', 'whatsapp', 'contact_form'], default: 'product_detail' },
  status:       { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
  adminNotes:   { type: String },
  reminderSentAt: { type: Date },
}, { timestamps: true });

quoteSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Quote', quoteSchema);
