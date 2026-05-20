import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { FaCheckCircle, FaWhatsapp, FaArrowRight } from 'react-icons/fa';

const CATEGORIES = {
  'icu-equipment-nepal': {
    title: 'ICU Equipment Nepal',
    heading: 'ICU Equipment Supplier in Nepal',
    description: 'Buy ICU equipment in Nepal — mechanical ventilators, patient monitors, infusion pumps, defibrillators, syringe pumps. CE & ISO certified. Kathmandu delivery with installation.',
    keywords: 'ICU equipment Nepal, ventilator Nepal, patient monitor Nepal, infusion pump Nepal, ICU setup Nepal, intensive care unit equipment Kathmandu',
    category: 'ICU Equipment',
    hero: 'Complete ICU Equipment for Nepal\'s Hospitals',
    subhero: 'CE & ISO certified ventilators, patient monitors, infusion pumps and defibrillators. On-site installation and biomedical training included.',
    products: ['ICU Ventilator', 'Multi-parameter Patient Monitor', 'Infusion Pump', 'Syringe Pump', 'Defibrillator', 'Central Patient Monitoring Station', 'ICU Bed', 'Suction Machine'],
    faqs: [
      { q: 'What ICU equipment does Meditrust Nepal supply?', a: 'We supply a full range of ICU equipment including invasive and non-invasive ventilators, multi-parameter patient monitors, infusion pumps, syringe pumps, defibrillators, and ICU beds. All products are CE and ISO 13485 certified.' },
      { q: 'Do you provide complete ICU setup in Nepal?', a: 'Yes. We provide turnkey ICU setup services including equipment supply, installation, commissioning, staff training, and annual maintenance contracts (AMC). We have completed 50+ ICU setups across Nepal.' },
      { q: 'What is the price of an ICU ventilator in Nepal?', a: 'ICU ventilator prices in Nepal range from NPR 8,00,000 to NPR 35,00,000 depending on the model and features. Contact us for a specific quotation.' },
    ],
  },
  'surgical-instruments-nepal': {
    title: 'Surgical Instruments Nepal',
    heading: 'Surgical Instruments Supplier in Nepal',
    description: 'Buy surgical instruments in Nepal — general surgery sets, laparoscopic instruments, orthopedic instruments, gynecological instruments. CE certified. Kathmandu delivery.',
    keywords: 'surgical instruments Nepal, laparoscopic instruments Nepal, orthopedic instruments Nepal, buy surgical instruments Kathmandu, surgical tools Nepal',
    category: 'Surgical Instruments',
    hero: 'CE Certified Surgical Instruments for Nepal',
    subhero: 'Complete surgical instrument sets for general surgery, laparoscopy, orthopedics, and gynecology. Resterilization and maintenance support included.',
    products: ['General Surgery Set', 'Laparoscopic Instrument Set', 'Orthopedic Instrument Set', 'Gynecology Instrument Set', 'Neurosurgery Instruments', 'Ophthalmic Surgical Set', 'Cardiovascular Instruments', 'ENT Instrument Set'],
    faqs: [
      { q: 'Are your surgical instruments CE certified?', a: 'Yes. All surgical instruments supplied by Meditrust Nepal carry CE marking and are manufactured to ISO 13485 standards. We provide full DDA-compliant documentation with every order.' },
      { q: 'Do you supply laparoscopic instruments in Nepal?', a: 'Yes. We supply a complete range of laparoscopic instruments including trocars, graspers, scissors, needle holders, clip appliers, and suction-irrigation sets from leading international manufacturers.' },
      { q: 'Can you supply a complete operation theatre setup?', a: 'Yes. We provide complete OT setup including surgical instruments, OT tables, surgical lights, anesthesia machines, autoclave sterilizers, and patient monitors. Contact us for a consolidated quote.' },
    ],
  },
  'patient-monitors-nepal': {
    title: 'Patient Monitors Nepal',
    heading: 'Patient Monitor Supplier in Nepal',
    description: 'Buy patient monitors in Nepal — bedside monitors, central stations, transport monitors. ECG, SpO2, NIBP, EtCO2, temperature. CE certified. Kathmandu.',
    keywords: 'patient monitor Nepal, bedside monitor Nepal, ECG monitor Nepal, multi-parameter monitor Nepal, buy patient monitor Kathmandu',
    category: 'Diagnostic Equipment',
    hero: 'Patient Monitors for Nepal\'s Hospitals & ICUs',
    subhero: 'Multi-parameter bedside monitors, central monitoring stations, and transport monitors. Full parameter sets: ECG, SpO2, NIBP, EtCO2, IBP, temperature.',
    products: ['5-Parameter Bedside Monitor', '7-Parameter ICU Monitor', 'Central Monitoring Station', 'Transport Monitor', 'Neonatal/Pediatric Monitor', 'Telemetry System', 'ECG Machine 12-lead', 'Pulse Oximeter'],
    faqs: [
      { q: 'What parameters do your patient monitors support?', a: 'Our patient monitors support ECG (3/5/12 lead), SpO2, NIBP, respiratory rate, temperature, IBP (invasive blood pressure), EtCO2, and BIS. We carry monitors from entry-level to full ICU-grade.' },
      { q: 'Do you supply central monitoring stations?', a: 'Yes. We supply central monitoring stations that can network up to 32 bedside monitors, providing real-time patient data for ICU, HDU, and ward settings.' },
      { q: 'What is the warranty on patient monitors?', a: 'All patient monitors come with a minimum 1-year warranty with on-site service. We also offer 3-year and 5-year Annual Maintenance Contracts (AMC).' },
    ],
  },
  'diagnostic-equipment-nepal': {
    title: 'Diagnostic Equipment Nepal',
    heading: 'Diagnostic Equipment Supplier in Nepal',
    description: 'Buy diagnostic equipment in Nepal — ECG machines, portable ultrasound, X-ray machines, pulse oximeters, blood gas analyzers. CE certified. Meditrust Nepal.',
    keywords: 'diagnostic equipment Nepal, ECG machine Nepal, ultrasound Nepal, X-ray machine Nepal, pulse oximeter Nepal, diagnostic equipment Kathmandu',
    category: 'Diagnostic Equipment',
    hero: 'Diagnostic Equipment for Nepal\'s Healthcare Sector',
    subhero: 'ECG machines, portable ultrasound, digital X-ray, pulse oximeters, and point-of-care diagnostic devices. Suitable for hospitals, clinics, and outreach programs.',
    products: ['12-Lead ECG Machine', 'Portable Ultrasound', 'Digital X-Ray System', 'Pulse Oximeter', 'Blood Gas Analyzer', 'Hematology Analyzer', 'Glucometer', 'SpO2 Monitor'],
    faqs: [
      { q: 'Do you supply portable ultrasound machines in Nepal?', a: 'Yes. We supply portable and handheld ultrasound machines suitable for point-of-care, emergency, and outreach settings. Models include abdominal, obstetric, cardiac, and musculoskeletal probes.' },
      { q: 'What ECG machines do you supply in Nepal?', a: 'We supply 3-channel, 6-channel, and 12-channel ECG machines from leading manufacturers. Both resting ECG and Holter monitoring systems are available.' },
      { q: 'Can I get diagnostic equipment for a small clinic?', a: 'Yes. We cater to facilities of all sizes — from large tertiary hospitals to small clinics and health posts. We help you select cost-effective equipment that meets your clinical needs.' },
    ],
  },
};

const schema = (cat) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: cat.faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export default function CategoryPage() {
  const { slug } = useParams();
  const cat = CATEGORIES[slug];

  if (!cat) return <Navigate to="/products" replace />;

  return (
    <>
      <SeoHead
        title={`${cat.title} — Meditrust Nepal`}
        description={cat.description}
        keywords={cat.keywords}
        schemas={[schema(cat)]}
        canonical={`/category/${slug}`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4">{cat.hero}</h1>
          <p className="text-primary-200 text-lg max-w-3xl mx-auto mb-8">{cat.subhero}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={`/products?category=${encodeURIComponent(cat.category)}`}
              className="bg-white text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition shadow-lg flex items-center gap-2">
              Browse All {cat.title} <FaArrowRight />
            </Link>
            <a href="https://wa.me/9779818100515" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-lg">
              <FaWhatsapp /> Get a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Products list */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Equipment We Supply</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cat.products.map(p => (
              <Link key={p} to={`/products?category=${encodeURIComponent(cat.category)}&search=${encodeURIComponent(p)}`}
                className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl p-5 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition group text-center">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FaCheckCircle className="text-primary-600 dark:text-brand-cyan" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-brand-cyan">{p}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white dark:bg-dark-surface py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {cat.faqs.map((f, i) => (
              <details key={i} className="group bg-[var(--bg-secondary)] border border-gray-100 dark:border-dark-border rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm pr-4">{f.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
                </summary>
                <p className="px-6 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-secondary)] py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Ready to get a quote?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Same-day quotation for most equipment. Hospital bulk pricing available.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/bulk-inquiry" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition">Bulk Inquiry Form</Link>
            <Link to={`/products?category=${encodeURIComponent(cat.category)}`} className="border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-dark-card transition">Browse Products</Link>
          </div>
        </div>
      </section>
    </>
  );
}
