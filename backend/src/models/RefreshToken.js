const mongoose = require('mongoose');
const crypto = require('crypto');

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expiresAt: { type: Date, required: true },
    replacedBy: { type: String, default: null },
    revokedAt: { type: Date, default: null },
    userAgent: { type: String, maxlength: 300 },
    ip:        { type: String, maxlength: 45 },
  },
  { timestamps: true }
);

// TTL index — MongoDB auto-deletes expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expiresAt;
});

refreshTokenSchema.virtual('isRevoked').get(function () {
  return !!this.revokedAt;
});

refreshTokenSchema.virtual('isActive').get(function () {
  return !this.isRevoked && !this.isExpired;
});

refreshTokenSchema.statics.generate = function () {
  return crypto.randomBytes(40).toString('hex');
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
