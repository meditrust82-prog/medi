import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { FaCheckCircle, FaPhone, FaWhatsapp, FaMapMarkerAlt, FaShieldAlt, FaTruck, FaTools, FaHospital } from 'react-icons/fa';

const CATEGORIES = [
  { name: 'ICU Ventilators', slug: 'ICU Equipment', desc: 'Invasive & non-invasive mechanical ventilators from leading brands. Suitable for ICU, HDU, neonatal care.' },
  { name: 'Patient Monitors', slug: 'Diagnostic Equipment', desc: 'Multi-parameter bedside monitors, central stations, transport monitors. ECG, SpO2, NIBP, EtCO2.' },
  { name: 'Surgical Instruments', slug: 'Surgical Instruments', desc: 'CE-certified surgical instrument sets — general surgery, laparoscopic, orthopedic, gynecological.' },
  { name: 'Hospital Furniture', slug: 'Hospital Furniture', desc: 'Electric ICU beds, examination tables, stretchers, IV poles, overbed tables.' },
  { name: 'Diagnostic Equipment', slug: 'Diagnostic Equipment', desc: 'ECG machines, portable ultrasound, pulse oximeters, blood gas analyzers, glucometers.' },
  { name: 'Sterilization Equipment', slug: 'Sterilization Equipment', desc: 'Autoclaves, ultrasonic cleaners, UV sterilizers, sterilization pouches and wraps.' },
];

const HOSPITALS = [
  'Bir Hospital', 'Tribhuvan University Teaching Hospital', 'Patan Hospital',
  'B.P. Koirala Institute', 'Kathmandu Medical College', 'Nepal Medical College',
  'Nobel Hospital', 'Grande International Hospital', 'Norvic International Hospital',
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Meditrust Nepal',
  description: 'Medical equipment supplier in Kathmandu, Nepal. Supplying ICU ventilators, patient monitors, surgical instruments, hospital furniture and diagnostic equipment.',
  url: 'https://meditrustnepal.com',
  telephone: '+977-9818100515',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressRegion: 'Bagmati Province',
    addressCountry: 'NP',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 27.7172, longitude: 85.3240 },
  openingHours: 'Mo-Sa 09:00-18:00',
  priceRange: '$$',
  areaServed: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Bharatpur', 'Butwal', 'Nepalgunj'],
};

const KathmanduMedicalEquipment = () => {
  return (
    <>
      <SeoHead
        title="Medical Equipment Supplier in Kathmandu Nepal — Meditrust Nepal"
        description="Nepal's leading medical equipment supplier in Kathmandu. Buy ICU ventilators, patient monitors, surgical instruments, hospital furniture. CE & ISO certified. Call +977-9818100515."
        keywords="medical equipment supplier Kathmandu, hospital equipment Nepal, buy medical equipment Nepal, ICU equipment Kathmandu, surgical instruments Kathmandu, patient monitor Nepal"
        schemas={[schema]}
        canonical="/kathmandu-medical-equipment-supplier"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <FaMapMarkerAlt className="text-brand-cyan text-sm" />
            <span className="text-white/80 text-sm font-medium">Kathmandu, Nepal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4 leading-tight">
            Medical Equipment Supplier<br />in Kathmandu, Nepal
          </h1>
          <p className="text-primary-200 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Meditrust Nepal supplies CE & ISO certified medical equipment to 200+ hospitals and clinics across Nepal. ICU setups, surgical instruments, diagnostic devices — all with installation, training & after-sales support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/9779818100515" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-lg">
              <FaWhatsapp className="text-xl" /> WhatsApp Us
            </a>
            <a href="tel:+977-9818100515"
              className="flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition shadow-lg">
              <FaPhone /> +977-9818100515
            </a>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: FaHospital, value: '200+', label: 'Hospitals Supplied' },
              { icon: FaShieldAlt, value: 'CE & ISO', label: 'Certified Products' },
              { icon: FaTruck, value: 'Nepal-wide', label: 'Delivery & Installation' },
              { icon: FaTools, value: '24/7', label: 'After-Sales Support' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="text-3xl text-primary-600" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment categories */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">Medical Equipment We Supply in Kathmandu</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-10">All products are CE marked, ISO 13485 certified, and come with DDA-compliant documentation</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl p-6 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition group">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-brand-cyan mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{cat.desc}</p>
                <p className="mt-4 text-xs font-semibold text-primary-600 dark:text-brand-cyan">Browse {cat.name} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-white dark:bg-dark-surface py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Why Hospitals in Kathmandu Choose Meditrust Nepal</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'CE & ISO Certified Products', body: 'Every product carries CE marking and ISO 13485 certification. Full DDA-compliant documentation provided with each purchase.' },
              { title: 'Same-Day Response in Kathmandu', body: 'Critical equipment failures in the Kathmandu Valley receive same-day technician response. We maintain a local spare parts warehouse.' },
              { title: 'On-Site Installation & Training', body: '2–3 day biomedical training for your clinical staff included with major equipment purchases. We commission and validate on-site.' },
              { title: 'Preventive Maintenance Contracts', body: 'Annual PMC keeps your equipment running at peak performance. Quarterly visits, calibration, filter changes, and software updates.' },
              { title: 'Bulk & Institutional Pricing', body: 'Special pricing for hospitals purchasing multiple units or complete department setups. Use our Bulk Inquiry form for a consolidated quote.' },
              { title: 'Nepal-wide Service Network', body: 'Service centers in Kathmandu, Pokhara, Biratnagar, Bharatpur, and Butwal. Remote area support via certified partner technicians.' },
            ].map(({ title, body }) => (
              <div key={title} className="flex gap-4">
                <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospitals served */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Trusted by Leading Hospitals in Nepal</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Our equipment is installed and running in Nepal's top healthcare institutions</p>
          <div className="flex flex-wrap justify-center gap-3">
            {HOSPITALS.map(h => (
              <span key={h} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white dark:bg-dark-surface">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Get a Quote for Your Hospital Today</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Same-day quotation for most standard equipment. Consolidated quotes available for complete department setups.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/bulk-inquiry" className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition shadow-md">
              Submit Bulk Inquiry
            </Link>
            <Link to="/products" className="border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-dark-card transition">
              Browse All Equipment
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400">Or call us directly: <a href="tel:+977-9818100515" className="text-primary-600 font-semibold">+977-9818100515</a></p>
        </div>
      </section>
    </>
  );
};

export default KathmanduMedicalEquipment;
