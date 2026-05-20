const mongoose = require('mongoose');

const gbpTokenSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'singleton' },
    accessToken:  { type: String },
    refreshToken: { type: String },
    expiryDate:   { type: Number },
    accountId:    { type: String },   // accounts/XXXXX
    locationId:   { type: String },   // locations/XXXXX
    accountName:  { type: String },
    locationName: { type: String },
    cachedReviews:      { type: mongoose.Schema.Types.Mixed, default: null },
    cachedBusinessInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    reviewsCachedAt:    { type: Date },
    businessInfoCachedAt: { type: Date },
  },
  { _id: false, timestamps: true }
);

module.exports = mongoose.model('GbpToken', gbpTokenSchema);
