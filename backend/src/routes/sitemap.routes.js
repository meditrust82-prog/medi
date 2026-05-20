const router = require('express').Router();
const Product = require('../models/Product');

const SITE = 'https://meditrustnepal.com';

const url = (loc, priority = '0.7', freq = 'weekly', lastmod) =>
  `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;

router.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find({}, 'slug category updatedAt').lean();

    const today = new Date().toISOString().split('T')[0];
    const CATEGORIES = [
      'Surgical Instruments', 'ICU Equipment', 'Diagnostic Equipment',
      'Hospital Furniture', 'Laboratory Equipment', 'Sterilization Equipment', 'Imaging Equipment',
    ];
    const categoryUrls = CATEGORIES.map(cat =>
      url(`${SITE}/products?category=${encodeURIComponent(cat)}`, '0.85', 'weekly', today)
    );
    const staticUrls = [
      url(`${SITE}/products`, '0.9', 'daily', today),
      url(`${SITE}/about`, '0.7', 'monthly', today),
      url(`${SITE}/services`, '0.7', 'monthly', today),
      url(`${SITE}/contact`, '0.8', 'monthly', today),
      url(`${SITE}/blog`, '0.8', 'weekly', today),
      url(`${SITE}/projects`, '0.6', 'monthly', today),
      url(`${SITE}/blog/icu-ventilator-price-nepal-2025`, '0.8', 'monthly', today),
      url(`${SITE}/blog/patient-monitor-buying-guide-nepal`, '0.8', 'monthly', today),
      url(`${SITE}/blog/how-to-set-up-icu-nepal`, '0.8', 'monthly', today),
      url(`${SITE}/blog/surgical-instruments-nepal`, '0.8', 'monthly', today),
      url(`${SITE}/blog/medical-equipment-maintenance-nepal`, '0.8', 'monthly', today),
      url(`${SITE}/kathmandu-medical-equipment-supplier`, '0.9', 'monthly', today),
      url(`${SITE}/bulk-inquiry`, '0.6', 'monthly', today),
      url(`${SITE}/my-quotes`, '0.4', 'monthly', today),
      url(`${SITE}/category/icu-equipment-nepal`, '0.9', 'monthly', today),
      url(`${SITE}/category/surgical-instruments-nepal`, '0.9', 'monthly', today),
      url(`${SITE}/category/patient-monitors-nepal`, '0.9', 'monthly', today),
      url(`${SITE}/category/diagnostic-equipment-nepal`, '0.9', 'monthly', today),
      url(`${SITE}/hospital-equipment-nepal`, '0.9', 'monthly', today),
      url(`${SITE}/clinic-equipment-nepal`, '0.8', 'monthly', today),
      url(`${SITE}/diagnostic-center-equipment-nepal`, '0.8', 'monthly', today),
      url(`${SITE}/brand/mindray`, '0.8', 'monthly', today),
      url(`${SITE}/brand/philips`, '0.8', 'monthly', today),
      url(`${SITE}/brand/ge-healthcare`, '0.8', 'monthly', today),
      url(`${SITE}/brand/drager`, '0.8', 'monthly', today),
      url(`${SITE}/brand/bionet`, '0.7', 'monthly', today),
    ];

    const productUrls = products.filter(p => p.slug).map(p =>
      url(
        `${SITE}/products/${p.slug}`,
        '0.8',
        'weekly',
        p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : undefined
      )
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...categoryUrls, ...productUrls].join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Failed to generate sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart
Disallow: /compare

Sitemap: ${SITE}/sitemap.xml

User-agent: GPTBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /`);
});

module.exports = router;
