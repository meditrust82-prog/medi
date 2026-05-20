const mongoose = require('mongoose');

const servicesSettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },

  heroLabel:    { type: String, default: '' },
  heroTitle:    { type: String, default: '' },
  heroDesc:     { type: String, default: '' },

  services: {
    type: [{
      title:       { type: String },
      subtitle:    { type: String },
      description: { type: String },
      features:    [{ type: String }],
    }],
    default: [],
  },
}, { _id: false, timestamps: true });

module.exports = mongoose.model('ServicesSettings', servicesSettingsSchema);
