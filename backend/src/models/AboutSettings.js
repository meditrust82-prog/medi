const mongoose = require('mongoose');

const aboutSettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },

  heroLabel:   { type: String, default: '' },
  heroTitle:   { type: String, default: '' },
  heroDesc:    { type: String, default: '' },

  storyPara1:  { type: String, default: '' },
  storyPara2:  { type: String, default: '' },
  storyBadge:  { type: String, default: '15+' },

  missionText: { type: String, default: '' },
  visionText:  { type: String, default: '' },

  values: {
    type: [{ title: String, desc: String }],
    default: [],
  },

  team: {
    type: [{ name: String, role: String, desc: String }],
    default: [],
  },

  milestones: {
    type: [{ year: String, title: String, desc: String }],
    default: [],
  },
}, { _id: false, timestamps: true });

module.exports = mongoose.model('AboutSettings', aboutSettingsSchema);
