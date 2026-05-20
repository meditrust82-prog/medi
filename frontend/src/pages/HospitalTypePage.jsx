import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { FaCheckCircle, FaWhatsapp, FaArrowRight } from 'react-icons/fa';

const PAGES = {
  'hospital-equipment-nepal': {
    title: 'Hospital Equipment Supplier Nepal',
    heading: 'Complete Hospital Equipment Setup in Nepal',
    description: 'Hospital equipment supplier in Nepal. Full setups for ICUs, OTs, wards, emergency departments. CE certified. Meditrust Nepal, Kathmandu.',
    keywords: 'hospital equipment Nepal, hospital setup Nepal, hospital equipment supplier Kathmandu, ICU OT equipment Nepal',
    hero: 'Equip Your Hospital from ICU to OT',
    subhero: 'Meditrust Nepal supplies complete hospital equipment packages — ICU ventilators, OT tables, patient monitors, surgical instruments, and more. Single supplier, pan-Nepal delivery and installation.',
    departments: [
      { name: 'ICU / HDU', items: ['Mechanical Ventilators', 'Patient Monitors', 'Infusion Pumps', 'Defibrillators', 'ICU Beds'] },
      { name: 'Operation Theatre', items: ['OT Tables', 'Surgical Lights', 'Anesthesia Machines', 'Diathermy Units', 'Surgical Instruments'] },
      { name: 'Emergency', items: ['Crash Carts', 'Defibrillators', 'Transport Ventilators', 'Pulse Oximeters', 'Suction Machines'] },
      { name: 'Ward & Rooms', items: ['Hospital Beds', 'IV Poles', 'Overbed Tables', 'Wheelchairs', 'Stretchers'] },
      { name: 'Laboratory', items: ['Hematology Analyzers', 'Biochemistry Analyzers', 'Centrifuges', 'Microscopes', 'Autoclaves'] },
      { name: 'Radiology', items: ['Digital X-Ray', 'Portable Ultrasound', 'C-Arm Fluoroscopy', 'CR Systems'] },
    ],
    whyUs: ['Single-source procurement reduces paperwork', 'Bulk pricing for complete department setups', 'On-site installation and biomedical training', 'Annual Maintenance Contracts (AMC) available', 'DDA-compliant documentation with every order', 'Nepal-wide service network'],
  },
  'clinic-equipment-nepal': {
    title: 'Clinic Equipment Nepal',
    heading: 'Medical Equipment for Clinics in Nepal',
    description: 'Medical equipment for clinics in Nepal. Diagnostic devices, examination tables, ECG machines, ultrasound, sterilization. Affordable CE certified equipment.',
    keywords: 'clinic equipment Nepal, medical equipment for clinic Nepal, diagnostic equipment clinic Nepal, ECG machine clinic Nepal',
    hero: 'Right-Sized Equipment for Nepal\'s Clinics',
    subhero: 'Meditrust Nepal supplies affordable, CE certified equipment for general practice clinics, specialist clinics, and outpatient departments. Fast delivery, minimal setup time.',
    departments: [
      { name: 'Consultation Room', items: ['Examination Table', 'BP Machine', 'Pulse Oximeter', 'Glucometer', 'Thermometer'] },
      { name: 'Diagnostics', items: ['ECG Machine', 'Portable Ultrasound', 'Hemoglobin Meter', 'Urine Analyzer', 'Spirometer'] },
      { name: 'Minor OT', items: ['Minor OT Table', 'Surgical Light', 'Cautery Unit', 'Basic Surgical Instruments'] },
      { name: 'Sterilization', items: ['Autoclave', 'UV Sterilizer', 'Ultrasonic Cleaner', 'Sterilization Pouches'] },
      { name: 'Waiting Area', items: ['Waiting Chairs', 'Stretcher', 'Wheelchair', 'IV Stand'] },
    ],
    whyUs: ['Affordable pricing without compromising quality', 'CE certified — suitable for DDA registration', 'Installation in under 1 day for most equipment', 'Training included for clinical staff', 'One-year warranty on all equipment', 'Installment options available for bulk purchases'],
  },
  'diagnostic-center-equipment-nepal': {
    title: 'Diagnostic Center Equipment Nepal',
    heading: 'Diagnostic Center Equipment Supplier Nepal',
    description: 'Equipment for diagnostic centers and labs in Nepal. Biochemistry analyzers, hematology analyzers, ultrasound, digital X-ray, ECG. CE certified. Meditrust Nepal.',
    keywords: 'diagnostic center equipment Nepal, lab equipment Nepal, biochemistry analyzer Nepal, hematology analyzer Nepal, diagnostic equipment Kathmandu',
    hero: 'Complete Equipment for Diagnostic Centers & Labs',
    subhero: 'From hematology and biochemistry analyzers to digital X-ray and ultrasound — Meditrust Nepal equips diagnostic centers across Nepal with CE certified instruments.',
    departments: [
      { name: 'Pathology Lab', items: ['Hematology Analyzer', 'Biochemistry Analyzer', 'ESR Analyzer', 'Coagulation Analyzer', 'Microscope'] },
      { name: 'Microbiology', items: ['Incubator', 'Centrifuge', 'Autoclave', 'Laminar Flow Hood', 'ELISA Reader'] },
      { name: 'Imaging', items: ['Digital X-Ray', 'Portable Ultrasound', 'C-Arm', 'Bone Densitometer'] },
      { name: 'Cardiac', items: ['12-Lead ECG Machine', 'Holter Monitor', 'Stress Test System'] },
      { name: 'Support', items: ['Lab Refrigerator', 'Water Bath', 'Vortex Mixer', 'Lab Centrifuge', 'Pipettes & Consumables'] },
    ],
    whyUs: ['Reagent compatibility confirmed before purchase', 'Installation + calibration included', 'Training for lab technicians', 'Reagent and consumable supply chain support', 'CE and ISO certified instruments', 'Annual calibration and maintenance contracts'],
  },
};

export default function HospitalTypePage() {
  const { slug } = useParams();
  const page = PAGES[slug];
  if (!page) return <Navigate to="/products" replace />;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Meditrust Nepal',
    description: page.description,
    url: `https://meditrustnepal.com/${slug}`,
    telephone: '+977-9818100515',
    address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
  };

  return (
    <>
      <SeoHead
        title={`${page.title} — Meditrust Nepal`}
        description={page.description}
        keywords={page.keywords}
        schemas={[schema]}
        canonical={`/${slug}`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4 leading-tight">{page.hero}</h1>
          <p className="text-primary-200 text-lg max-w-3xl mx-auto mb-8">{page.subhero}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`https://wa.me/9779818100515?text=${encodeURIComponent(`Hello Meditrust Nepal! 👋\n\n*Equipment Inquiry*\n📍 Source: ${page.heading} — meditrustnepal.com\n\n🏥 Facility Name: [your hospital/clinic name]\n📞 Contact Person: [your name]\n🔧 Equipment Needed: [list equipment]\n📍 Location: [your city/district]\n\nPlease provide a quotation.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-lg">
              <FaWhatsapp /> WhatsApp Us
            </a>
            <Link to="/bulk-inquiry"
              className="flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition shadow-lg">
              Bulk Inquiry Form <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Equipment by Department</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {page.departments.map(dept => (
              <div key={dept.name} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-dark-border">{dept.name}</h3>
                <ul className="space-y-1.5">
                  {dept.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaCheckCircle className="text-green-500 flex-shrink-0 text-xs" />
                      <Link to={`/products?search=${encodeURIComponent(item)}`} className="hover:text-primary-600 dark:hover:text-brand-cyan transition">{item}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-14 bg-white dark:bg-dark-surface">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Choose Meditrust Nepal?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {page.whyUs.map(w => (
              <div key={w} className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300 text-sm">{w}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-secondary)] py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Get a consolidated quote today</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Send us your equipment list and we'll respond within hours with pricing and availability.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/bulk-inquiry" className="bg-primary-600 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-primary-700 transition">Submit Equipment List</Link>
            <Link to="/products" className="border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 px-7 py-3.5 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-dark-card transition">Browse Equipment</Link>
          </div>
        </div>
      </section>
    </>
  );
}
