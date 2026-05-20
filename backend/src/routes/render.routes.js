const router = require('express').Router();
const Product = require('../models/Product');

const SITE = 'https://meditrustnepal.com';
const SITE_NAME = 'Meditrust Nepal';
const DEFAULT_DESC = "Meditrust Nepal — Nepal's trusted supplier of surgical instruments, ICU equipment, patient monitors, diagnostic devices and more. CE & ISO certified products, 24/7 support.";

const escape = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const stripHtml = (html = '') => String(html).replace(/<[^>]*>/g, '').slice(0, 300);

const shell = ({ title, description, canonical, image, schemas = [], body = '' }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}"/>
  <link rel="canonical" href="${escape(canonical)}"/>
  <link rel="alternate" hreflang="en" href="${escape(canonical)}"/>
  <link rel="alternate" hreflang="ne" href="${escape(canonical)}"/>
  <link rel="alternate" hreflang="x-default" href="${escape(canonical)}"/>
  <meta property="og:title" content="${escape(title)}"/>
  <meta property="og:description" content="${escape(description)}"/>
  <meta property="og:url" content="${escape(canonical)}"/>
  <meta property="og:image" content="${escape(image || SITE + '/logo.png')}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="${SITE_NAME}"/>
  <meta property="og:locale" content="en_US"/>
  <meta property="og:locale:alternate" content="ne_NP"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${escape(title)}"/>
  <meta name="twitter:description" content="${escape(description)}"/>
  <meta name="twitter:image" content="${escape(image || SITE + '/logo.png')}"/>
  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"/>
  <meta name="geo.region" content="NP"/>
  <meta name="geo.placename" content="Kathmandu, Nepal"/>
  ${schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n  ')}
</head>
<body>
${body}
</body>
</html>`;

// GET /sitemap.xml — dynamic sitemap including all products
router.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find({}, 'slug updatedAt').lean();
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/services', priority: '0.7', changefreq: 'monthly' },
      { url: '/blog', priority: '0.8', changefreq: 'weekly' },
      { url: '/blog/icu-ventilator-price-nepal-2025', priority: '0.8', changefreq: 'monthly' },
      { url: '/blog/patient-monitor-buying-guide-nepal', priority: '0.8', changefreq: 'monthly' },
      { url: '/blog/how-to-set-up-icu-nepal', priority: '0.8', changefreq: 'monthly' },
      { url: '/blog/surgical-instruments-nepal', priority: '0.8', changefreq: 'monthly' },
      { url: '/blog/medical-equipment-maintenance-nepal', priority: '0.8', changefreq: 'monthly' },
      { url: '/kathmandu-medical-equipment-supplier', priority: '0.9', changefreq: 'monthly' },
      { url: '/bulk-inquiry', priority: '0.6', changefreq: 'monthly' },
      { url: '/my-quotes', priority: '0.4', changefreq: 'monthly' },
      { url: '/category/icu-equipment-nepal', priority: '0.9', changefreq: 'monthly' },
      { url: '/category/surgical-instruments-nepal', priority: '0.9', changefreq: 'monthly' },
      { url: '/category/patient-monitors-nepal', priority: '0.9', changefreq: 'monthly' },
      { url: '/category/diagnostic-equipment-nepal', priority: '0.9', changefreq: 'monthly' },
      { url: '/hospital-equipment-nepal', priority: '0.9', changefreq: 'monthly' },
      { url: '/clinic-equipment-nepal', priority: '0.8', changefreq: 'monthly' },
      { url: '/diagnostic-center-equipment-nepal', priority: '0.8', changefreq: 'monthly' },
      { url: '/brand/mindray', priority: '0.8', changefreq: 'monthly' },
      { url: '/brand/philips', priority: '0.8', changefreq: 'monthly' },
      { url: '/brand/ge-healthcare', priority: '0.8', changefreq: 'monthly' },
      { url: '/brand/drager', priority: '0.8', changefreq: 'monthly' },
      { url: '/brand/bionet', priority: '0.7', changefreq: 'monthly' },
    ];

    const urls = [
      ...staticPages.map(p => `  <url>
    <loc>${SITE}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
      ...products.filter(p => p.slug).map(p => `  <url>
    <loc>${SITE}/products/${p.slug}</loc>
    <lastmod>${new Date(p.updatedAt || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`),
    ];

    res.set('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`);
  } catch (err) {
    res.status(500).send('Sitemap error');
  }
});

// GET /render?path=/products/some-slug  (called only by Vercel edge middleware)
router.get('/render', async (req, res) => {
  if (req.headers['x-prerender-token'] !== 'internal') {
    return res.status(403).send('Forbidden');
  }
  const path = (req.query.path || '/products').replace(/[<>"']/g, '');

  try {
    // ── Product detail page ──────────────────────────────────────
    const productMatch = path.match(/^\/products\/([^/?#]+)$/);
    if (productMatch) {
      const slugOrId = productMatch[1];
      const product = await Product.findOne({
        $or: [{ slug: slugOrId }, { _id: slugOrId.match(/^[a-f\d]{24}$/i) ? slugOrId : null }],
      }).lean();

      if (!product) {
        return res.status(404).send(shell({
          title: 'Product Not Found | Meditrust Nepal',
          description: DEFAULT_DESC,
          canonical: `${SITE}/products`,
        }));
      }

      const slug = product.slug || product._id;
      const canonical = `${SITE}/products/${slug}`;
      const images = (product.images || []).map(i => i.url || i.path || i).filter(s => typeof s === 'string' && s.startsWith('http'));
      const image = images[0] || null;
      const desc = product.metaDescription || stripHtml(product.description) || `Buy ${product.name} from Meditrust Nepal. CE & ISO certified, competitive pricing, 24/7 support.`;
      const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${canonical}#product`,
        name: product.name,
        description: desc,
        image: images.length ? images : [`${SITE}/logo.png`],
        sku: `MN-${slug}`,
        brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
        category: product.category || 'Medical Equipment',
        dateModified: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined,
        offers: {
          '@type': 'Offer',
          '@id': `${canonical}#offer`,
          url: canonical,
          priceCurrency: 'NPR',
          price: product.price || 0,
          priceValidUntil,
          availability: (product.stock ?? 1) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', '@id': `${SITE}/#organization`, name: SITE_NAME },
        },
      };

      const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE}/products` },
          ...(product.category ? [{ '@type': 'ListItem', position: 3, name: product.category }] : []),
          { '@type': 'ListItem', position: product.category ? 4 : 3, name: product.name },
        ],
      };

      const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: `Where can I buy ${product.name} in Nepal?`, acceptedAnswer: { '@type': 'Answer', text: `${product.name} is available at Meditrust Nepal, Kathmandu. Order at meditrustnepal.com or call +977-9818100515.` } },
          { '@type': 'Question', name: `What is the price of ${product.name} in Nepal?`, acceptedAnswer: { '@type': 'Answer', text: `The price of ${product.name} at Meditrust Nepal is NRS ${product.price?.toLocaleString() || 'competitive'}. Contact us for institutional pricing.` } },
          { '@type': 'Question', name: `Is ${product.name} CE and ISO certified?`, acceptedAnswer: { '@type': 'Answer', text: `Yes, Meditrust Nepal supplies CE and ISO certified ${product.category || 'medical equipment'} including ${product.name}.` } },
        ],
      };

      const body = `
<h1>${escape(product.name)}</h1>
<p class="speakable">${escape(desc)}</p>
${product.category ? `<p>Category: ${escape(product.category)}</p>` : ''}
${product.price ? `<p>Price: NRS ${product.price.toLocaleString()}</p>` : ''}
${product.brand ? `<p>Brand: ${escape(product.brand)}</p>` : ''}
<p><a href="${SITE}/products">Back to all products</a></p>`;

      return res.send(shell({
        title: product.metaTitle || `${product.name} — Buy in Nepal | ${SITE_NAME}`,
        description: desc,
        canonical,
        image,
        schemas: [productSchema, breadcrumb, faq],
        body,
      }));
    }

    // ── Products listing (with optional category) ────────────────
    if (path === '/products' || path === '/') {
      const rawCategory = req.query.category || '';
      const CATEGORY_SEO = {
        'Surgical Instruments': { title: 'Surgical Instruments Nepal — Buy CE & ISO Certified', desc: 'Buy surgical instruments in Nepal from Meditrust Nepal. Laparoscopic tools, general surgery sets, orthopedic instruments. CE & ISO certified. Kathmandu delivery.', keywords: 'surgical instruments Nepal, buy surgical instruments Kathmandu, laparoscopic instruments Nepal' },
        'ICU Equipment': { title: 'ICU Equipment Nepal — Ventilators, Patient Monitors, Infusion Pumps', desc: 'Buy ICU equipment in Nepal — ventilators, patient monitors, infusion pumps, defibrillators. CE & ISO certified. Meditrust Nepal, Kathmandu.', keywords: 'ICU equipment Nepal, ventilator Nepal, patient monitor Nepal, infusion pump Nepal' },
        'Diagnostic Equipment': { title: 'Diagnostic Equipment Nepal — ECG, Ultrasound, X-Ray Machines', desc: 'Buy diagnostic equipment in Nepal — ECG machines, ultrasound, X-ray, pulse oximeters. CE certified. Meditrust Nepal, Kathmandu.', keywords: 'ECG machine Nepal, ultrasound machine Nepal, diagnostic equipment Nepal' },
        'Hospital Furniture': { title: 'Hospital Furniture Nepal — Beds, Stretchers, Wheelchairs', desc: 'Buy hospital furniture in Nepal — hospital beds, stretchers, wheelchairs, IV stands. CE certified. Meditrust Nepal, Kathmandu.', keywords: 'hospital furniture Nepal, hospital bed Nepal, stretcher Nepal, wheelchair Nepal' },
        'Laboratory Equipment': { title: 'Laboratory Equipment Nepal — Analysers, Microscopes, Centrifuges', desc: 'Buy laboratory equipment in Nepal — biochemistry analysers, haematology analysers, microscopes, centrifuges. CE certified.', keywords: 'laboratory equipment Nepal, biochemistry analyser Nepal, microscope Nepal' },
        'Sterilization Equipment': { title: 'Sterilization Equipment Nepal — Autoclaves, UV Sterilizers', desc: 'Buy sterilization equipment in Nepal — autoclaves, UV sterilizers, steam sterilizers. CE certified. Meditrust Nepal.', keywords: 'autoclave Nepal, sterilization equipment Nepal, UV sterilizer Nepal' },
        'Imaging Equipment': { title: 'Imaging Equipment Nepal — X-Ray, Ultrasound, C-arm', desc: 'Medical imaging equipment supplier Nepal — digital X-ray, ultrasound, C-arm. CE certified. Meditrust Nepal, Kathmandu.', keywords: 'X-ray machine Nepal, C-arm Nepal, medical imaging Nepal' },
      };
      const catMeta = rawCategory ? CATEGORY_SEO[rawCategory] : null;
      const filter = rawCategory ? { category: { $regex: `^${rawCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } } : {};
      const products = await Product.find(filter, 'name slug category price').sort('-updatedAt').limit(50).lean();
      const canonical = rawCategory ? `${SITE}/products?category=${encodeURIComponent(rawCategory)}` : `${SITE}/products`;
      const title = catMeta ? `${catMeta.title} | ${SITE_NAME}` : `Surgical & Medical Equipment Supplier Nepal | ${SITE_NAME}`;
      const description = catMeta ? catMeta.desc : DEFAULT_DESC;
      const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: rawCategory ? `${rawCategory} — Nepal` : 'Medical Equipment Nepal',
        url: canonical,
        itemListElement: products.filter(p => p.slug).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE}/products/${p.slug}`,
          name: p.name,
        })),
      };
      const body = `<h1 class="speakable">${escape(rawCategory || 'Medical Equipment Supplier Nepal')}</h1>
<p>${escape(description)}</p>
<ul>${products.filter(p => p.slug).map(p => `<li><a href="${SITE}/products/${p.slug}">${escape(p.name)}</a></li>`).join('\n')}</ul>`;

      return res.send(shell({ title, description, canonical, schemas: [itemList], body }));
    }

    // ── Static pages fallback ────────────────────────────────────
    const staticMeta = {
      '/about':    { title: `About Us | ${SITE_NAME}`, desc: `Learn about Meditrust Nepal — Kathmandu's leading medical equipment supplier since 2009.` },
      '/contact':  { title: `Contact Us | ${SITE_NAME}`, desc: 'Contact Meditrust Nepal for medical equipment inquiries, quotations, and technical support.' },
      '/services': { title: `Services | ${SITE_NAME}`, desc: 'Medical equipment installation, training, maintenance, and 24/7 technical support across Nepal.' },
      '/blog':     { title: `Blog | ${SITE_NAME}`, desc: 'Medical equipment insights, healthcare news, and product guides from Meditrust Nepal.' },
    };
    const meta = staticMeta[path];
    if (meta) {
      return res.send(shell({
        title: meta.title,
        description: meta.desc,
        canonical: `${SITE}${path}`,
        body: `<h1 class="speakable">${escape(meta.title.split('|')[0].trim())}</h1><p>${escape(meta.desc)}</p>`,
      }));
    }

    // Default fallback
    res.send(shell({
      title: `${SITE_NAME} — Medical Equipment Supplier Nepal`,
      description: DEFAULT_DESC,
      canonical: `${SITE}${path}`,
      body: `<h1 class="speakable">${SITE_NAME}</h1><p>${DEFAULT_DESC}</p>`,
    }));

  } catch (err) {
    console.error('Render error:', err.message);
    res.status(500).send('Render error');
  }
});

module.exports = router;
