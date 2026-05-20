import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Meditrust Nepal';
const DEFAULT_DESCRIPTION = 'Meditrust Nepal — Your trusted supplier of high-quality medical equipment in Nepal. ICU ventilators, ECG machines, patient monitors, surgical instruments and more.';
const DEFAULT_KEYWORDS = 'medical equipment Nepal, hospital equipment Kathmandu, medical devices Nepal, surgical instruments Nepal, ICU equipment Nepal, diagnostic equipment Nepal';
const DEFAULT_IMAGE = `${import.meta.env.VITE_SITE_URL || 'https://meditrustnepal.com'}/logo.png`;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://meditrustnepal.com';

/**
 * SeoHead — drop this inside any page component.
 *
 * Props:
 *   title        string  — page title (appended with "| Meditrust Nepal")
 *   description  string  — meta description (150-160 chars recommended)
 *   keywords     string  — comma-separated keywords
 *   image        string  — absolute or root-relative OG image URL
 *   type         string  — og:type (default "website", use "article" for blog posts, "product" for products)
 *   schemas      array   — array of JSON-LD schema objects (auto-serialised)
 *   noindex      bool    — set true to suppress from search engines
 *   canonical    string  — override canonical URL
 */
const SeoHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  type = 'website',
  schemas = [],
  noindex = false,
  canonical: canonicalProp,
  lang = 'en',
}) => {
  const location = useLocation();
  const canonicalRaw = canonicalProp || location.pathname;
  const canonical = canonicalRaw.startsWith('http') ? canonicalRaw : `${SITE_URL}${canonicalRaw}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Medical Equipment Supplier Nepal`;
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* ── Core ─────────────────────────────────────────────── */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="ne" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'} />
      <meta name="author" content={SITE_NAME} />
      <meta name="geo.region" content="NP" />
      <meta name="geo.placename" content="Kathmandu, Nepal" />

      {/* ── Open Graph ───────────────────────────────────────── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="ne_NP" />

      {/* ── Twitter Card ─────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* ── JSON-LD Structured Data (AEO) ────────────────────── */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

/* ── Shared schema builders (call from pages) ──────────────────── */

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  description: DEFAULT_DESCRIPTION,
  foundingDate: '2009',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Naxal, Bhagwati Bahal',
    addressLocality: 'Kathmandu',
    addressRegion: 'Bagmati',
    postalCode: '44600',
    addressCountry: 'NP',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+977-9818100515',
    contactType: 'customer service',
    availableLanguage: ['English', 'Nepali'],
  },
  sameAs: [
    'https://www.facebook.com/meditrustnepal/',
    'https://www.instagram.com/meditrust_82',
  ],
});

export const buildWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const buildLocalBusinessSchema = ({ aggregateRating } = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${SITE_URL}/#localbusiness`,
  name: SITE_NAME,
  image: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
  },
  url: SITE_URL,
  telephone: '+977-9818100515',
  email: 'meditrust82@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Naxal, Bhagwati Bahal',
    addressLocality: 'Kathmandu',
    addressRegion: 'Bagmati',
    postalCode: '44600',
    addressCountry: 'NP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 27.7172,
    longitude: 85.3240,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  priceRange: '$$',
  description: DEFAULT_DESCRIPTION,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.speakable'],
  },
  ...(aggregateRating ? { aggregateRating } : {}),
});

export const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url ? `${SITE_URL}${item.url}` : undefined,
  })),
});

export const buildProductSchema = (product, { aggregateRating } = {}) => {
  const images = (product.images || []).map(img => {
    const src = img.path || img.url || img;
    return typeof src === 'string' && src.startsWith('http') ? src : `${SITE_URL}${src}`;
  }).filter(Boolean);

  const slug = product.slug || product.id;
  const productUrl = `${SITE_URL}/products/${slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    description: product.description
      ? product.description.replace(/<[^>]*>/g, '').slice(0, 500)
      : `High-quality ${product.name} available from Meditrust Nepal.`,
    image: images.length > 0 ? images : [`${SITE_URL}/logo.png`],
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    sku: `MN-${product.slug || product.id}`,
    mpn: product.slug || `MN-${product.id}`,
    category: product.category || 'Medical Equipment',
    dateModified: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined,
    offers: {
      '@type': 'Offer',
      '@id': `${productUrl}#offer`,
      url: productUrl,
      priceCurrency: 'NPR',
      price: product.price || product.offerPrice || 0,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock === false
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
    },
  };

  if (aggregateRating) schema.aggregateRating = aggregateRating;

  return schema;
};

export const buildProductFAQSchema = (product) => {
  const name = product.name || 'this product';
  const category = product.category || 'medical equipment';
  const price = product.price ? `NRS ${product.price.toLocaleString()}` : 'competitive';
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Where can I buy ${name} in Nepal?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${name} is available at Meditrust Nepal, Kathmandu's trusted medical equipment supplier. You can order online at meditrustnepal.com or call +977-9818100515.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the price of ${name} in Nepal?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The price of ${name} at Meditrust Nepal is ${price}. Contact us for bulk pricing and institutional discounts.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${name} CE and ISO certified?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, Meditrust Nepal supplies CE and ISO certified ${category} including ${name}. All products meet international quality standards.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does Meditrust Nepal provide after-sales support for ${name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, Meditrust Nepal provides installation, training, and 24/7 technical support for ${name} across Nepal including Kathmandu, Pokhara, Biratnagar, and other cities.`,
        },
      },
    ],
  };
};

export const buildFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
});

export const buildBlogPostingSchema = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt || post.title,
  image: post.image ? (post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`) : `${SITE_URL}/logo.png`,
  author: { '@type': 'Organization', name: post.author || SITE_NAME },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
  },
  datePublished: post.createdAt,
  dateModified: post.updatedAt || post.createdAt,
  url: `${SITE_URL}/blog/${post.slug || post.id}`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug || post.id}` },
});

export default SeoHead;
