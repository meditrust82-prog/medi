const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  phone:   { type: String, required: true, trim: true },
  source:  { type: String, default: 'home_newsletter' },
  active:  { type: Boolean, default: true },
}, { timestamps: true });

subscriberSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
