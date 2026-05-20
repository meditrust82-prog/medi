const mongoose = require('mongoose');

const homepageSettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },

  // Hero section
  heroBadge:     { type: String, default: "Nepal's Trusted Surgical Equipment Partner" },
  heroTitle:     { type: String, default: 'Surgical Equipment\nBuilt for Excellence' },
  heroSubtitle:  { type: String, default: 'Supplying certified surgical instruments, operating room equipment, and medical devices to hospitals and clinics across Nepal — with expert support from day one.' },
  heroPrimaryBtn:   { type: String, default: 'Browse Products' },
  heroSecondaryBtn: { type: String, default: 'Request a Quote' },

  // Stats bar
  stats: {
    type: [{
      value: { type: Number },
      suffix: { type: String },
      label: { type: String },
    }],
    default: [
      { value: 500, suffix: '+', label: 'Surgical Products' },
      { value: 200, suffix: '+', label: 'Hospitals Served' },
      { value: 15,  suffix: '+', label: 'Years Experience' },
      { value: 24,  suffix: '/7', label: 'Support Hours' },
    ],
  },

  // Trusted by logos
  trustedBy: {
    type: [{
      name: { type: String },
      logo: { type: String },
      url:  { type: String },
    }],
    default: [
      { name: 'Bir Hospital',      logo: 'https://birhospital.gov.np/uploads/sitesetting_image/376631297-namslogos.jpg', url: 'https://birhospital.gov.np/en' },
      { name: 'Nepal Mediciti',    logo: 'https://www.nepalmediciti.com/assets/img/logo.png',  url: 'https://www.nepalmediciti.com' },
      { name: 'Grande Hospital',   logo: 'https://www.grandehospital.com/img/logo.png',         url: 'https://www.grandehospital.com/en' },
      { name: 'Norvic Hospital',   logo: 'https://patient.norvichospital.com/img/norvic-logo-new.jpeg', url: 'https://norvichospital.com' },
      { name: 'Patan Hospital',    logo: 'https://web.pahs.edu.np/wp-content/uploads/2023/12/pahs.png', url: 'https://web.pahs.edu.np' },
      { name: 'Mindray',           logo: 'https://logo.clearbit.com/mindray.com',               url: 'https://www.mindray.com/en' },
    ],
  },

  // Why Choose Us cards
  whyChooseUs: {
    type: [{
      title: { type: String },
      desc:  { type: String },
    }],
    default: [
      { title: 'CE & ISO Certified',       desc: 'Every product meets international quality and safety standards.' },
      { title: 'Expert Technical Support', desc: '24/7 after-sales support, training, and maintenance services.' },
      { title: 'Competitive Pricing',      desc: 'Best prices with flexible payment and bulk order discounts.' },
      { title: 'Nepal-wide Delivery',      desc: 'Fast, reliable delivery to all provinces and districts.' },
      { title: 'Trusted Since 2009',       desc: 'Over 15 years supplying Nepal\'s hospitals and clinics.' },
      { title: 'Genuine Products',         desc: 'Authorized distributor for all major medical equipment brands.' },
    ],
  },
}, { _id: false, timestamps: true });

module.exports = mongoose.model('HomepageSettings', homepageSettingsSchema);
