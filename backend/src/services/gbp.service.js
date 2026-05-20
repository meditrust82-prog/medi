const { google } = require('googleapis');
const GbpToken = require('../models/GbpToken');

const SCOPES = [
  'https://www.googleapis.com/auth/business.manage',
];

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GBP_CLIENT_ID,
    process.env.GBP_CLIENT_SECRET,
    process.env.GBP_REDIRECT_URI
  );
}

async function getTokenDoc() {
  return GbpToken.findById('singleton');
}

async function getAuthenticatedClient() {
  const doc = await getTokenDoc();
  if (!doc || !doc.refreshToken) {
    throw new Error('GBP_NOT_CONNECTED');
  }
  const auth = createOAuth2Client();
  auth.setCredentials({
    access_token:  doc.accessToken,
    refresh_token: doc.refreshToken,
    expiry_date:   doc.expiryDate,
  });
  const { credentials } = await auth.refreshAccessToken();
  auth.setCredentials(credentials);
  await GbpToken.findByIdAndUpdate('singleton', {
    accessToken: credentials.access_token,
    expiryDate:  credentials.expiry_date,
  }, { upsert: true });
  return { auth, doc: await getTokenDoc() };
}

// ── OAuth ─────────────────────────────────────────────────────────────────────

function getAuthUrl() {
  const auth = createOAuth2Client();
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });
}

async function handleCallback(code) {
  const auth = createOAuth2Client();
  const { tokens } = await auth.getToken(code);
  auth.setCredentials(tokens);

  await GbpToken.findByIdAndUpdate(
    'singleton',
    {
      _id: 'singleton',
      accessToken:  tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate:   tokens.expiry_date,
    },
    { upsert: true, new: true }
  );

  await syncAccountAndLocation(auth);
  return { ok: true };
}

async function disconnect() {
  await GbpToken.findByIdAndDelete('singleton');
  return { ok: true };
}

// ── Account & Location discovery ──────────────────────────────────────────────

async function syncAccountAndLocation(auth) {
  try {
    const mybusiness = google.mybusinessaccountmanagement({ version: 'v1', auth });
    const accRes = await mybusiness.accounts.list();
    const account = accRes.data.accounts?.[0];
    if (!account) return;

    const accountId = account.name; // "accounts/XXXXX"

    const locApi = google.mybusinessbusinessinformation({ version: 'v1', auth });
    const locRes = await locApi.locations.list({
      parent: accountId,
      readMask: 'name,title',
    });
    const location = locRes.data.locations?.[0];
    const locationId   = location?.name || null;   // "locations/XXXXX"
    const locationName = location?.title || null;

    await GbpToken.findByIdAndUpdate('singleton', {
      accountId,
      locationId,
      accountName: account.accountName,
      locationName,
    }, { upsert: true });
  } catch (err) {
    console.error('GBP syncAccountAndLocation error:', err.message);
  }
}

// ── Reviews ───────────────────────────────────────────────────────────────────

async function getReviews(forceRefresh = false) {
  const doc = await getTokenDoc();
  if (!doc) throw new Error('GBP_NOT_CONNECTED');

  const cacheAge = doc.reviewsCachedAt ? Date.now() - doc.reviewsCachedAt.getTime() : Infinity;
  if (!forceRefresh && doc.cachedReviews && cacheAge < CACHE_TTL_MS) {
    return doc.cachedReviews;
  }

  const { auth } = await getAuthenticatedClient();
  const freshDoc = await getTokenDoc();
  if (!freshDoc.locationId) throw new Error('GBP_NO_LOCATION');

  const reviewsApi = google.mybusinessreviews({ version: 'v4', auth });
  const res = await reviewsApi.accounts.locations.reviews.list({
    parent: `${freshDoc.accountId}/${freshDoc.locationId}`,
    pageSize: 50,
  });

  const data = {
    reviews:         res.data.reviews || [],
    averageRating:   res.data.averageRating,
    totalReviewCount: res.data.totalReviewCount,
  };

  await GbpToken.findByIdAndUpdate('singleton', {
    cachedReviews: data,
    reviewsCachedAt: new Date(),
  });

  return data;
}

// ── Business Info ─────────────────────────────────────────────────────────────

async function getBusinessInfo(forceRefresh = false) {
  const doc = await getTokenDoc();
  if (!doc) throw new Error('GBP_NOT_CONNECTED');

  const cacheAge = doc.businessInfoCachedAt
    ? Date.now() - doc.businessInfoCachedAt.getTime()
    : Infinity;
  if (!forceRefresh && doc.cachedBusinessInfo && cacheAge < CACHE_TTL_MS) {
    return doc.cachedBusinessInfo;
  }

  const { auth } = await getAuthenticatedClient();
  const freshDoc = await getTokenDoc();
  if (!freshDoc.locationId) throw new Error('GBP_NO_LOCATION');

  const locApi = google.mybusinessbusinessinformation({ version: 'v1', auth });
  const res = await locApi.locations.get({
    name: freshDoc.locationId,
    readMask: 'name,title,phoneNumbers,regularHours,specialHours,websiteUri,profile,openInfo',
  });

  const data = res.data;
  await GbpToken.findByIdAndUpdate('singleton', {
    cachedBusinessInfo: data,
    businessInfoCachedAt: new Date(),
  });

  return data;
}

// ── Posts ─────────────────────────────────────────────────────────────────────

async function createPost({ summary, callToAction, mediaUrl }) {
  const { auth } = await getAuthenticatedClient();
  const doc = await getTokenDoc();
  if (!doc.locationId) throw new Error('GBP_NO_LOCATION');

  const postsApi = google.mybusinesslocalpostmanagement({ version: 'v1', auth });

  const localPost = {
    summary,
    topicType: 'STANDARD',
  };

  if (callToAction?.actionType && callToAction?.url) {
    localPost.callToAction = {
      actionType: callToAction.actionType, // LEARN_MORE, ORDER, SHOP, SIGN_UP, CALL
      url: callToAction.url,
    };
  }

  if (mediaUrl) {
    localPost.media = [{
      mediaFormat: 'PHOTO',
      sourceUrl: mediaUrl,
    }];
  }

  const res = await postsApi.locations.localPosts.create({
    parent: doc.locationId,
    requestBody: localPost,
  });

  return res.data;
}

async function listPosts() {
  const { auth } = await getAuthenticatedClient();
  const doc = await getTokenDoc();
  if (!doc.locationId) throw new Error('GBP_NO_LOCATION');

  const postsApi = google.mybusinesslocalpostmanagement({ version: 'v1', auth });
  const res = await postsApi.locations.localPosts.list({
    parent: doc.locationId,
  });

  return res.data.localPosts || [];
}

// ── Status ────────────────────────────────────────────────────────────────────

async function getStatus() {
  const doc = await getTokenDoc();
  return {
    connected:    !!(doc && doc.refreshToken),
    accountId:    doc?.accountId || null,
    locationId:   doc?.locationId || null,
    accountName:  doc?.accountName || null,
    locationName: doc?.locationName || null,
    reviewsCachedAt:      doc?.reviewsCachedAt || null,
    businessInfoCachedAt: doc?.businessInfoCachedAt || null,
  };
}

module.exports = {
  getAuthUrl,
  handleCallback,
  disconnect,
  getReviews,
  getBusinessInfo,
  createPost,
  listPosts,
  getStatus,
  syncAccountAndLocation,
};
