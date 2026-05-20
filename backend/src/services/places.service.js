const https = require('https');
const GbpToken = require('../models/GbpToken');

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const STAR_MAP = { 1: 'ONE', 2: 'TWO', 3: 'THREE', 4: 'FOUR', 5: 'FIVE' };

async function getPlacesReviews(forceRefresh = false) {
  const apiKey  = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    throw new Error('PLACES_NOT_CONFIGURED');
  }

  // Check cache in GbpToken singleton (reuse same doc, different fields)
  const doc = await GbpToken.findById('singleton');
  const cacheAge = doc?.reviewsCachedAt
    ? Date.now() - doc.reviewsCachedAt.getTime()
    : Infinity;

  if (!forceRefresh && doc?.cachedReviews && cacheAge < CACHE_TTL_MS) {
    return doc.cachedReviews;
  }

  const fields = 'name,rating,user_ratings_total,reviews,opening_hours,formatted_phone_number,website';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

  const json = await fetchJson(url);

  if (json.status !== 'OK') {
    throw new Error(`Places API error: ${json.status} — ${json.error_message || ''}`);
  }

  const place = json.result;

  const reviews = (place.reviews || []).map(r => ({
    reviewer: {
      displayName: r.author_name,
      profilePhotoUrl: r.profile_photo_url,
    },
    starRating: STAR_MAP[r.rating] || 'FIVE',
    comment: r.text,
    createTime: new Date(r.time * 1000).toISOString(),
  }));

  const data = {
    reviews,
    averageRating: place.rating || null,
    totalReviewCount: place.user_ratings_total || 0,
    source: 'places',
  };

  // Cache in DB
  await GbpToken.findByIdAndUpdate(
    'singleton',
    {
      _id: 'singleton',
      cachedReviews: data,
      reviewsCachedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  // Also cache business info
  const businessInfo = {
    title: place.name,
    phoneNumbers: place.formatted_phone_number
      ? { primaryPhone: place.formatted_phone_number }
      : null,
    websiteUri: place.website || null,
    regularHours: place.opening_hours?.weekday_text
      ? { weekdayText: place.opening_hours.weekday_text }
      : null,
    openInfo: {
      status: place.opening_hours?.open_now ? 'OPEN' : 'CLOSED',
    },
    source: 'places',
  };

  await GbpToken.findByIdAndUpdate(
    'singleton',
    {
      cachedBusinessInfo: businessInfo,
      businessInfoCachedAt: new Date(),
    },
    { upsert: true }
  );

  return data;
}

async function getPlacesBusinessInfo(forceRefresh = false) {
  const apiKey  = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) throw new Error('PLACES_NOT_CONFIGURED');

  const doc = await GbpToken.findById('singleton');
  const cacheAge = doc?.businessInfoCachedAt
    ? Date.now() - doc.businessInfoCachedAt.getTime()
    : Infinity;

  if (!forceRefresh && doc?.cachedBusinessInfo && cacheAge < CACHE_TTL_MS) {
    return doc.cachedBusinessInfo;
  }

  // Trigger full fetch (which also caches business info)
  await getPlacesReviews(true);
  const fresh = await GbpToken.findById('singleton');
  return fresh?.cachedBusinessInfo || null;
}

module.exports = { getPlacesReviews, getPlacesBusinessInfo };
