import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import api from '../api';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa';

const BRANDS = {
  mindray: {
    name: 'Mindray',
    description: 'Mindray medical equipment supplier in Nepal. Patient monitors, ultrasound, ventilators, anesthesia machines, hematology analyzers. Authorized distributor.',
    keywords: 'Mindray Nepal, Mindray patient monitor Nepal, Mindray ultrasound Nepal, Mindray ventilator Nepal, buy Mindray Nepal',
    about: 'Mindray is a leading global medical device manufacturer headquartered in Shenzhen, China. Meditrust Nepal is an authorized distributor of Mindray equipment across Nepal, providing installation, training, and after-sales support.',
    products: ['Mindray Patient Monitor', 'Mindray Ultrasound', 'Mindray Ventilator', 'Mindray Hematology Analyzer', 'Mindray Anesthesia Machine'],
  },
  philips: {
    name: 'Philips',
    description: 'Philips medical equipment supplier in Nepal. Patient monitoring, diagnostic imaging, defibrillators. Meditrust Nepal.',
    keywords: 'Philips Nepal, Philips patient monitor Nepal, Philips defibrillator Nepal, buy Philips medical equipment Nepal',
    about: 'Philips Healthcare is a world leader in medical imaging, patient monitoring, and cardiac care. Meditrust Nepal supplies Philips medical equipment with full installation and service support across Nepal.',
    products: ['Philips Patient Monitor', 'Philips Defibrillator', 'Philips ECG Machine', 'Philips Ultrasound'],
  },
  'ge-healthcare': {
    name: 'GE Healthcare',
    description: 'GE Healthcare medical equipment supplier in Nepal. Ultrasound, patient monitors, anesthesia, imaging. Meditrust Nepal.',
    keywords: 'GE Healthcare Nepal, GE ultrasound Nepal, GE patient monitor Nepal, GE anesthesia machine Nepal',
    about: 'GE Healthcare is a global leader in medical imaging, monitoring, and diagnostics. Meditrust Nepal supplies GE Healthcare equipment to hospitals and clinics across Nepal.',
    products: ['GE Ultrasound Machine', 'GE Patient Monitor', 'GE Anesthesia Machine', 'GE ECG Machine'],
  },
  drager: {
    name: 'Dräger',
    description: 'Dräger medical equipment supplier in Nepal. ICU ventilators, anesthesia machines, neonatal equipment. Meditrust Nepal.',
    keywords: 'Drager Nepal, Drager ventilator Nepal, Drager anesthesia machine Nepal, buy Drager Nepal',
    about: 'Dräger is a German manufacturer renowned for ventilators, anesthesia systems, and neonatal care equipment. Meditrust Nepal supplies Dräger products with full technical support.',
    products: ['Dräger ICU Ventilator', 'Dräger Anesthesia Machine', 'Dräger Neonatal Warmer', 'Dräger Patient Monitor'],
  },
  bionet: {
    name: 'Bionet',
    description: 'Bionet medical equipment Nepal. ECG machines, fetal monitors, patient monitors. Affordable CE certified. Meditrust Nepal.',
    keywords: 'Bionet Nepal, Bionet ECG machine Nepal, Bionet fetal monitor Nepal',
    about: 'Bionet is a Korean medical device manufacturer known for affordable, CE-certified ECG machines and fetal monitors. Popular in Nepal for smaller clinics and health posts.',
    products: ['Bionet ECG Machine', 'Bionet Fetal Monitor', 'Bionet Patient Monitor'],
  },
};

const schema = (brand) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `${brand.name} Medical Equipment Nepal`,
  description: brand.description,
});

export default function BrandPage() {
  const { slug } = useParams();
  const brand = BRANDS[slug];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brand) return;
    api.get('/products', { params: { search: brand.name, limit: 12 } })
      .then(r => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (!brand) return <Navigate to="/products" replace />;

  return (
    <>
      <SeoHead
        title={`${brand.name} Medical Equipment Nepal — Meditrust Nepal`}
        description={brand.description}
        keywords={brand.keywords}
        schemas={[schema(brand)]}
        canonical={`/brand/${slug}`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-3">Authorized Supplier</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4">{brand.name} in Nepal</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">{brand.about}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`https://wa.me/9779818100515?text=${encodeURIComponent(`Hello Meditrust Nepal! 👋\n\n*${brand.name} Equipment Inquiry*\n📍 Source: Brand Page — meditrustnepal.com/brand/${slug}\n\n🏥 Hospital/Clinic Name: [your facility]\n📞 Contact Person: [your name]\n🔧 ${brand.name} Equipment Needed: [product name]\n📍 Location: [your city]\n\nPlease provide pricing and availability.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-7 py-3.5 rounded-xl font-bold transition shadow-lg">
              <FaWhatsapp /> Get a Quote
            </a>
            <Link to={`/products?search=${encodeURIComponent(brand.name)}`}
              className="flex items-center gap-2 bg-white text-gray-900 px-7 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition shadow-lg">
              Browse All {brand.name} <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Common products */}
      <section className="bg-[var(--bg-secondary)] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Popular {brand.name} Equipment</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {brand.products.map(p => (
              <Link key={p} to={`/products?search=${encodeURIComponent(p)}`}
                className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-xl p-4 text-sm font-medium text-gray-900 dark:text-white hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition">
                {p}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live products from DB */}
      <section className="py-12 bg-white dark:bg-dark-surface">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{brand.name} Products Available Now</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-100 dark:bg-dark-card rounded-xl animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No {brand.name} products in catalogue right now.</p>
              <a href={`https://wa.me/9779818100515?text=${encodeURIComponent(`Hello Meditrust Nepal! 👋\n\n*${brand.name} Stock Inquiry*\n📍 Source: Brand Page — meditrustnepal.com/brand/${slug}\n\nI am looking for ${brand.name} equipment. Do you have stock available? Please share pricing and lead time.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition">
                <FaWhatsapp /> Ask for Availability
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(p => {
                const img = optimizeCloudinaryUrl(p.allImages?.[0] || p.image, { width: 300 });
                return (
                  <Link key={p.slug || p._id} to={`/products/${p.slug || p._id}`}
                    className="group bg-[var(--bg-secondary)] border border-gray-100 dark:border-dark-border rounded-xl overflow-hidden hover:shadow-md transition">
                    <div className="h-32 bg-gray-100 dark:bg-dark-card overflow-hidden">
                      {img
                        ? <img src={img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">📦</div>
                      }
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">{p.name}</p>
                      {p.price && <p className="text-xs text-primary-600 dark:text-brand-cyan font-bold mt-1">NPR {p.price.toLocaleString()}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-secondary)] py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Need a specific {brand.name} model?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">We can source any {brand.name} model for Nepal. Contact us with your specifications.</p>
          <Link to="/bulk-inquiry" className="bg-primary-600 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-primary-700 transition">Send Specifications</Link>
        </div>
      </section>
    </>
  );
}
