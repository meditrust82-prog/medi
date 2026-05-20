/**
 * Validates required environment variables at startup.
 * Fails fast with a clear message rather than silently degrading.
 */

const REQUIRED = [
  { key: 'MONGO_URI',   hint: 'MongoDB connection string (mongodb+srv://...)' },
  { key: 'JWT_SECRET',  hint: 'At least 32 random characters' },
];

// Required only in production
const REQUIRED_PROD = [
  { key: 'ALLOWED_ORIGINS', hint: 'Comma-separated list of frontend URLs' },
];

// Optional but warn if missing
const OPTIONAL_PROD = [
  { key: 'KHALTI_SECRET_KEY', hint: 'From merchant.khalti.com → API Keys (needed for payments)' },
  { key: 'GROQ_API_KEY',      hint: 'From console.groq.com → API Keys (needed for AI chat)' },
  { key: 'GBP_CLIENT_ID',          hint: 'Google Cloud OAuth2 client ID (needed for Google Business Profile API)' },
  { key: 'GBP_CLIENT_SECRET',      hint: 'Google Cloud OAuth2 client secret (needed for Google Business Profile API)' },
  { key: 'GBP_REDIRECT_URI',       hint: 'e.g. https://medi-production-5b91.up.railway.app/api/v1/gbp/callback' },
  { key: 'GOOGLE_PLACES_API_KEY',  hint: 'Google Cloud API key with Places API enabled (for reviews fallback)' },
  { key: 'GOOGLE_PLACE_ID',        hint: 'Your Google Place ID — find it at https://developers.google.com/maps/documentation/places/web-service/place-id' },
];

const validateEnv = () => {
  const missing = [];

  for (const { key, hint } of REQUIRED) {
    if (!process.env[key]) missing.push(`  ${key}  (${hint})`);
  }

  if (process.env.NODE_ENV === 'production') {
    for (const { key, hint } of REQUIRED_PROD) {
      if (!process.env[key]) missing.push(`  ${key}  (${hint})`);
    }

    // JWT_SECRET too short is a security failure
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      missing.push('  JWT_SECRET  (must be at least 32 characters)');
    }

    // Warn about optional vars
    for (const { key, hint } of OPTIONAL_PROD) {
      if (!process.env[key] || process.env[key].includes('placeholder')) {
        console.warn(`WARN: ${key} is not set — ${hint}`);
      }
    }
  }

  if (missing.length) {
    console.error('FATAL: Missing or invalid environment variables:\n' + missing.join('\n'));
    process.exit(1);
  }
};

module.exports = validateEnv;
