const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const aiRoutes = require('./routes/ai.routes');
const webhookRoutes = require('./routes/webhook.routes');
const sitemapRoutes = require('./routes/sitemap.routes');
const gbpRoutes = require('./routes/gbp.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const renderRoutes = require('./routes/render.routes');
const bannerRoutes = require('./routes/banner.routes');
const { router: notifyRoutes } = require('./routes/notify.routes');
const homepageRoutes = require('./routes/homepage.routes');
const servicesSettingsRoutes = require('./routes/services-settings.routes');
const legalRoutes = require('./routes/legal.routes');
const aboutRoutes = require('./routes/about.routes');
const blogRoutes = require('./routes/blog.routes');

const app = express();

// Trust first proxy (Railway/Render/Vercel sit behind one)
app.set('trust proxy', 1);

// Gzip compression
app.use(compression());

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https://res.cloudinary.com', 'https:', 'http:'],
      connectSrc: ["'self'"],
      fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
      frameSrc:   ["'none'"],
      objectSrc:  ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (isLocalhost || process.env.NODE_ENV !== 'production') return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// NoSQL injection — strip $ and . from req.body, req.params, req.query
app.use(mongoSanitize());

// HTTP Parameter Pollution — last value wins for duplicates, whitelist array params
app.use(hpp({ whitelist: ['category', 'status', 'sort', 'badges'] }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Rate limiters ────────────────────────────────────────────────────────────
const limiter = (max, windowMinutes = 15) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });

// Repeater / slow-down: starts delaying after 3 login attempts
const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  delayMs: (used) => (used - 3) * 500, // +500ms per attempt after 3rd
});

app.use('/api', limiter(200));                              // global fallback
app.use('/api/v1/auth/login', limiter(10, 15));             // hard cap: 10 / 15 min
app.use('/api/v1/auth/login', loginSlowDown);               // soft: progressive delay
app.use('/api/v1/auth/refresh', limiter(30, 15));           // 30 refreshes / 15 min
app.use('/api/v1/orders', limiter(20, 15));                 // 20 order actions / 15 min

// ─── Sitemap (no auth, no rate limit) ────────────────────────────────────────
app.use('/', sitemapRoutes);

// ─── Versioned routes ────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/gbp', gbpRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/quotes', require('./routes/quote.routes'));
app.use('/api/v1/notify', notifyRoutes);
app.use('/api/v1/homepage', homepageRoutes);
app.use('/api/v1/services-settings', servicesSettingsRoutes);
app.use('/api/v1/legal', legalRoutes);
app.use('/api/v1/about-settings', aboutRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/', renderRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', version: 'v1' }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use(errorHandler);

module.exports = app;
