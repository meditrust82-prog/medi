const mongoose = require('mongoose');

const legalSettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },

  privacyTitle:       { type: String, default: 'Privacy Policy' },
  privacyLastUpdated: { type: String, default: '' },
  privacyContent:     { type: String, default: '' },

  termsTitle:       { type: String, default: 'Terms & Conditions' },
  termsLastUpdated: { type: String, default: '' },
  termsContent:     { type: String, default: '' },
}, { _id: false, timestamps: true });

module.exports = mongoose.model('LegalSettings', legalSettingsSchema);
