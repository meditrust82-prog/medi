const User = require('../models/User');
const {
  issueTokens,
  rotateRefreshToken,
  revokeAllUserTokens,
  clearAuthCookies,
} = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password });
    await issueTokens(res, user, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const DUMMY_HASH = '$2a$12$dummyhashusedtopreventsideChannel000000000000000000000000';

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const identifier = (email || '').toLowerCase().trim();
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    }).select('+password +loginAttempts +lockUntil');

    // Always run bcrypt to prevent user-enumeration via timing
    const candidate = user ? user.password : DUMMY_HASH;
    const passwordMatch = await require('bcryptjs').compare(password, candidate);

    if (!user || !passwordMatch) {
      if (user) await user.incLoginAttempts();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Account locked?
    if (user.isLocked()) {
      const retryAfterSec = Math.ceil((user.lockUntil - Date.now()) / 1000);
      res.set('Retry-After', retryAfterSec);
      return res.status(423).json({
        error: `Account locked due to too many failed attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minute(s).`,
      });
    }

    // Success — reset counter
    await user.resetLoginAttempts();

    await issueTokens(res, user, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const rawToken = req.cookies?.refresh_token;
    if (!rawToken) return res.status(401).json({ error: 'No refresh token' });

    const { user } = await rotateRefreshToken(res, rawToken, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    if (req.user?._id) await revokeAllUserTokens(req.user._id);
    clearAuthCookies(res);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

const me = (req, res) => res.json({ user: req.user });

const updateProfile = async (req, res, next) => {
  try {
    const { name, username, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name.trim().slice(0, 100);

    if (username !== undefined) {
      const u = username.trim().toLowerCase().slice(0, 50);
      if (u && u !== user.username) {
        const exists = await User.findOne({ username: u });
        if (exists) return res.status(400).json({ error: 'Username already taken' });
        user.username = u;
      }
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) return res.status(400).json({ error: 'Email already in use' });
      user.email = email.toLowerCase().trim();
    }

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: 'Current password is required to set a new password' });
      const valid = await user.comparePassword(currentPassword);
      if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
      if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });
      user.password = newPassword;
    }

    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout, me, updateProfile };
