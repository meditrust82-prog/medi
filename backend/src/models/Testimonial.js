const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true, maxlength: 100 },
    position:     { type: String, trim: true, maxlength: 100 },
    organization: { type: String, trim: true, maxlength: 100 },
    content:      { type: String, required: true, trim: true, maxlength: 1000 },
    rating:       { type: Number, min: 1, max: 5, default: 5 },
    photoUrl:     { type: String, trim: true },
    source:       { type: String, enum: ['google', 'direct', 'email', 'other'], default: 'google' },
    visible:      { type: Boolean, default: true },
    order:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.index({ visible: 1, order: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
