const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
    algorithm: 'HS256',
  });

const createRefreshToken = async (userId, meta = {}) => {
  const raw = RefreshToken.generate();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await RefreshToken.create({
    token: raw,
    user: userId,
    expiresAt,
    userAgent: meta.userAgent ? String(meta.userAgent).slice(0, 300) : undefined,
    ip: meta.ip,
  });
  return raw;
};

const SAME_SITE = process.env.NODE_ENV === 'production' ? 'none' : 'strict';

const setAccessCookie = (res, token) => {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: SAME_SITE,
    maxAge: 15 * 60 * 1000, // 15 min
  });
};

const setRefreshCookie = (res, token) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: SAME_SITE,
    path: '/api/v1/auth/refresh',
    maxAge: REFRESH_TOKEN_TTL_MS,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
};

const issueTokens = async (res, user, meta = {}) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = await createRefreshToken(user._id, meta);
  setAccessCookie(res, accessToken);
  setRefreshCookie(res, refreshToken);
  return { accessToken, refreshToken };
};

const rotateRefreshToken = async (res, oldRawToken, meta = {}) => {
  const existing = await RefreshToken.findOne({ token: oldRawToken });

  if (!existing) throw Object.assign(new Error('Invalid refresh token'), { status: 401 });

  // Token reuse detected — revoke entire family
  if (existing.isRevoked) {
    await RefreshToken.updateMany({ user: existing.user, revokedAt: null }, { revokedAt: new Date() });
    throw Object.assign(new Error('Token reuse detected. All sessions revoked.'), { status: 401 });
  }

  if (existing.isExpired) throw Object.assign(new Error('Refresh token expired'), { status: 401 });

  // Revoke old token and issue a new pair
  existing.revokedAt = new Date();
  existing.replacedBy = 'rotating';
  await existing.save();

  const user = await User.findById(existing.user);
  if (!user) throw Object.assign(new Error('User not found'), { status: 401 });

  const accessToken = signAccessToken(user._id);
  const newRawRefresh = await createRefreshToken(user._id, meta);
  existing.replacedBy = newRawRefresh;
  await existing.save();

  setAccessCookie(res, accessToken);
  setRefreshCookie(res, newRawRefresh);

  return { user, accessToken };
};

const revokeAllUserTokens = async (userId) => {
  await RefreshToken.updateMany(
    { user: userId, revokedAt: null },
    { revokedAt: new Date() }
  );
};

module.exports = {
  signAccessToken,
  issueTokens,
  rotateRefreshToken,
  revokeAllUserTokens,
  clearAuthCookies,
};
