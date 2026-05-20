const Product = require('../models/Product');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const groqCall = async (apiKey, messages, max_tokens = 800, temperature = 0.5) => {
  const r = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || 'Groq error');
  return data.choices?.[0]?.message?.content || '';
};

const chat = async (req, res, next) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'AI service not configured' });
    const { messages, temperature = 0.6, max_tokens = 800 } = req.body;
    if (!Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: 'messages array is required' });
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens }),
    });
    const data = await groqRes.json();
    if (!groqRes.ok) return res.status(groqRes.status).json({ error: data.error?.message || 'Groq error' });
    res.json(data);
  } catch (err) { next(err); }
};

const recommend = async (req, res, next) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'AI service not configured' });

    const { productSlug, category, userContext } = req.body;

    // Fetch candidate products — same category first, fallback to all
    let candidates = [];
    if (category) {
      candidates = await Product.find(
        { category: { $regex: `^${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
          ...(productSlug ? { slug: { $ne: productSlug } } : {}) },
        'name slug category price description brand badges stock quantity'
      ).limit(30).lean();
    }
    if (candidates.length < 6) {
      const extra = await Product.find(
        { ...(productSlug ? { slug: { $ne: productSlug } } : {}),
          ...(candidates.length ? { _id: { $nin: candidates.map(c => c._id) } } : {}) },
        'name slug category price description brand badges stock quantity'
      ).limit(30).lean();
      candidates = [...candidates, ...extra];
    }

    if (candidates.length === 0) return res.json({ recommendations: [] });

    const catalog = candidates.slice(0, 40).map((p, i) =>
      `[${i}] ${p.name} | Category: ${p.category || 'N/A'} | Price: ${p.price ? `NPR ${p.price}` : 'POA'} | Brand: ${p.brand || 'N/A'} | ${p.badges?.join(', ') || ''}`
    ).join('\n');

    const systemMsg = `You are a medical equipment recommendation engine for Meditrust Nepal. 
Given a user's context and a product catalog, return EXACTLY 3 recommendations as a JSON array.
Each item must have: index (catalog index), reason (1 sentence why it fits the user), match (integer 0-100).
Respond with ONLY valid JSON like: [{"index":0,"reason":"...","match":92},{"index":2,"reason":"...","match":85},{"index":5,"reason":"...","match":78}]`;

    const userMsg = `User context: ${userContext || 'browsing medical equipment'}\nCurrent product category: ${category || 'general'}\n\nCatalog:\n${catalog}\n\nReturn top 3 recommendations as JSON array only.`;

    const raw = await groqCall(apiKey, [
      { role: 'system', content: systemMsg },
      { role: 'user', content: userMsg },
    ], 400, 0.3);

    // Parse JSON robustly
    let parsed = [];
    try {
      const match = raw.match(/\[[\s\S]*\]/);
      parsed = match ? JSON.parse(match[0]) : [];
    } catch { parsed = []; }

    const recommendations = parsed
      .filter(r => typeof r.index === 'number' && candidates[r.index])
      .slice(0, 3)
      .map(r => {
        const p = candidates[r.index];
        return {
          name: p.name,
          slug: p.slug,
          category: p.category,
          price: p.price,
          brand: p.brand,
          image: p.images?.[0]?.url || p.images?.[0]?.path || null,
          reason: r.reason,
          match: r.match,
        };
      });

    res.json({ recommendations });
  } catch (err) { next(err); }
};

const finder = async (req, res, next) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'AI service not configured' });

    const { query } = req.body;
    if (!query?.trim()) return res.status(400).json({ error: 'query is required' });

    const allProducts = await Product.find(
      {}, 'name slug category price description brand badges'
    ).limit(100).lean();

    const catalog = allProducts.map((p, i) =>
      `[${i}] ${p.name} | ${p.category || 'N/A'} | ${p.price ? `NPR ${p.price}` : 'POA'} | ${p.brand || ''}`
    ).join('\n');

    const systemMsg = `You are a medical equipment finder for Meditrust Nepal.
Given the user's need, return the best matching products as JSON array (max 4 items).
Each item: {"index": number, "reason": "1 sentence", "match": 0-100}
Respond with ONLY the JSON array.`;

    const raw = await groqCall(apiKey, [
      { role: 'system', content: systemMsg },
      { role: 'user', content: `User need: "${query}"\n\nCatalog:\n${catalog}\n\nReturn best matches as JSON array.` },
    ], 500, 0.3);

    let parsed = [];
    try {
      const m = raw.match(/\[[\s\S]*\]/);
      parsed = m ? JSON.parse(m[0]) : [];
    } catch { parsed = []; }

    const results = parsed
      .filter(r => typeof r.index === 'number' && allProducts[r.index])
      .slice(0, 4)
      .map(r => {
        const p = allProducts[r.index];
        return {
          name: p.name, slug: p.slug, category: p.category,
          price: p.price, brand: p.brand,
          image: p.images?.[0]?.url || p.images?.[0]?.path || null,
          reason: r.reason, match: r.match,
        };
      });

    res.json({ results });
  } catch (err) { next(err); }
};

module.exports = { chat, recommend, finder };
