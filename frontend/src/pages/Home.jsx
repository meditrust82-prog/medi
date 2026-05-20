import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SeoHead, { buildOrganizationSchema, buildWebSiteSchema, buildLocalBusinessSchema } from '../components/SeoHead';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { FaArrowRight, FaCheckCircle, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar, FaPhone, FaWhatsapp, FaChevronDown, FaMapMarkerAlt, FaBuilding, FaShoppingCart } from 'react-icons/fa';
import { ShieldCheck, Lightbulb, PhoneCall, DollarSign, Layers, Award, Scissors, Activity, ScanFace, Stethoscope, Microscope, Bed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { useCart } from '../contexts/CartContext';
import { CardBanner } from '../components/PromoBanner';

// --- Framer Motion Counter Component ---
const AnimatedCounter = ({ from = 0, text, to, animationOptions }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: '-50px' });

  useEffect(() => {
    const node = nodeRef.current;
    if (inView && node) {
      const controls = animate(from, to, {
        duration: 2,
        ease: 'easeOut',
        ...animationOptions,
        onUpdate(value) {
          node.textContent = Math.floor(value).toString() + text;
        },
      });
      return () => controls.stop();
    }
  }, [from, to, inView, text, animationOptions]);

  return <span ref={nodeRef} />;
};

// --- Animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Surgical equipment categories
const CATEGORIES = [
  { name: 'Surgical Instruments', icon: Scissors, desc: 'Scalpels, forceps, scissors & more', slug: 'surgical-instruments' },
  { name: 'Operating Room', icon: Bed, desc: 'Tables, lights, surgical suites', slug: 'operating-room' },
  { name: 'Sterilization', icon: ShieldCheck, desc: 'Autoclaves, disinfection systems', slug: 'sterilization' },
  { name: 'Patient Monitoring', icon: Activity, desc: 'Vital signs, ICU monitors', slug: 'patient-monitoring' },
  { name: 'Anesthesia', icon: Stethoscope, desc: 'Machines, ventilators, circuits', slug: 'anesthesia' },
  { name: 'Orthopedic', icon: Microscope, desc: 'Implants, drills, fixation systems', slug: 'orthopedic' },
  { name: 'Laparoscopic', icon: ScanFace, desc: 'Cameras, trocars, energy devices', slug: 'laparoscopic' },
  { name: 'Diagnostic', icon: Layers, desc: 'Ultrasound, X-ray, lab equipment', slug: 'diagnostic' },
];

const FeaturedCarousel = ({ products, addToCart, t }) => {
  const [idx, setIdx] = useState(0);
  const [cols, setCols] = useState(3);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const update = () => setCols(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIdx = Math.max(0, products.length - cols);

  const goTo = useCallback((i) => {
    const clamped = Math.max(0, Math.min(i, maxIdx));
    setIdx(clamped);
    if (trackRef.current) {
      const card = trackRef.current.children[0];
      if (card) {
        const gap = 24;
        trackRef.current.scrollTo({ left: clamped * (card.offsetWidth + gap), behavior: 'smooth' });
      }
    }
  }, [maxIdx]);

  const next = useCallback(() => goTo(idx >= maxIdx ? 0 : idx + 1), [idx, maxIdx, goTo]);
  const prev = useCallback(() => goTo(idx <= 0 ? maxIdx : idx - 1), [idx, maxIdx, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 3500);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => { timerRef.current = setInterval(next, 3500); };

  return (
    <div className="relative px-2" onMouseEnter={pause} onMouseLeave={resume}>
      <div
        ref={trackRef}
        className="flex gap-4 sm:gap-6 overflow-x-hidden scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => (
          <div
            key={product._id || product.id}
            className="flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 group transition-all transform hover:-translate-y-1 flex flex-col"
            style={{ width: `calc((100% - ${(cols - 1) * 24}px) / ${cols})`, scrollSnapAlign: 'start' }}
          >
            <Link to={`/products/${product.slug || product.id}`} className="block">
              <div className="relative h-44 bg-gray-50 overflow-hidden">
                {(product.images?.[0]?.url) ? (
                  <>
                    <img src={product.images?.[0]?.url} alt={product.images?.[0]?.alt || product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute bottom-1.5 right-1.5 bg-black/40 backdrop-blur-sm text-white text-[8px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded pointer-events-none select-none">Meditrust Nepal</span>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Activity size={40} className="text-gray-300" />
                  </div>
                )}
                {product.category && (
                  <span className="absolute top-2 left-2 text-white text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary-600">{product.category}</span>
                )}
              </div>
            </Link>
            <div className="p-4 flex-1 flex flex-col">
              <Link to={`/products/${product.slug || product.id}`}>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-primary-700 transition-colors leading-snug line-clamp-2">{product.name}</h3>
              </Link>
              {product.price && (
                <p className="text-sm sm:text-lg font-bold text-primary-700 mt-2">NRS {product.price.toLocaleString()}</p>
              )}
              <div className="mt-3 flex gap-2">
                <Link to={`/products/${product.slug || product.id}`} className="flex-1 text-center bg-primary-600 text-white py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary-700 transition-colors">
                  {t('View_Details')}
                </Link>
                <button onClick={() => addToCart(product)} className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" title={t('Add_To_Quote')}>
                  <FaShoppingCart className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Prev / Next */}
      <button onClick={prev} className="absolute -left-1 top-[45%] -translate-y-1/2 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-primary-50 transition border border-gray-100 z-10">
        <FaChevronLeft className="text-primary-600 text-sm" />
      </button>
      <button onClick={next} className="absolute -right-1 top-[45%] -translate-y-1/2 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-primary-50 transition border border-gray-100 z-10">
        <FaChevronRight className="text-primary-600 text-sm" />
      </button>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-5">
        {Array.from({ length: maxIdx + 1 }).map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-primary-600 w-6' : 'bg-gray-300 w-1.5'}`} />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hpSettings, setHpSettings] = useState(null);
  const [catalogForm, setCatalogForm] = useState({ name: '', email: '', phone: '' });
  const [catalogSubmitting, setCatalogSubmitting] = useState(false);
  const [nlForm, setNlForm] = useState({ name: '', phone: '' });
  const [nlDone, setNlDone] = useState(false);
  const { scrollY } = useScroll();
  const heroY1 = useTransform(scrollY, [0, 500], [0, 150]);
  const heroY2 = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, testimonialRes, hpRes] = await Promise.allSettled([
          api.get('/products?limit=6'),
          api.get('/testimonials', { silent: true }),
          api.get('/homepage', { silent: true }),
        ]);
        if (prodRes.status === 'fulfilled') {
          const products = prodRes.value.data.products || prodRes.value.data || [];
          setFeaturedProducts(products.slice(0, 6));
        }
        if (testimonialRes.status === 'fulfilled') {
          setTestimonials(testimonialRes.value.data.testimonials || testimonialRes.value.data || []);
        }
        if (hpRes.status === 'fulfilled') {
          setHpSettings(hpRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCatalogSubmit = useCallback((e) => {
    e.preventDefault();
    if (!catalogForm.name || !catalogForm.email || !catalogForm.phone) return;
    setCatalogSubmitting(true);
    const waMsg = encodeURIComponent(
      `*Catalog Request*\nName: ${catalogForm.name}\nEmail: ${catalogForm.email}\nPhone: ${catalogForm.phone}\n\nPlease send me the Meditrust Nepal product catalog.`
    );
    window.open(`https://wa.me/9779818100515?text=${waMsg}`, '_blank');
    setCatalogForm({ name: '', email: '', phone: '' });
    setCatalogSubmitting(false);
  }, [catalogForm]);

  const aggregateRating = testimonials.length > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: (testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length).toFixed(1),
    reviewCount: testimonials.length,
    bestRating: 5,
    worstRating: 1,
  } : null;

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    { _id: '1', name: 'Dr. Ramesh Shrestha', position: 'ICU Director', organization: 'Grande International Hospital', content: 'Meditrust Nepal supplied and commissioned our entire ICU in under 2 weeks. The Mindray ventilators have been running flawlessly for 18 months. Excellent after-sales support.', rating: 5 },
    { _id: '2', name: 'Ms. Sunita Pradhan', position: 'Biomedical Engineer', organization: 'Patan Hospital', content: 'The equipment quality and documentation for DDA compliance were both outstanding. Their technicians were professional and completed training for all our staff. Highly recommend.', rating: 5 },
    { _id: '3', name: 'Dr. Anil Gurung', position: 'Director', organization: 'Nobel Hospital Biratnagar', content: 'We sourced our complete OT setup from Meditrust Nepal. Competitive pricing, fast delivery even to Biratnagar, and their annual maintenance contract gives us peace of mind.', rating: 5 },
  ];

  const DEFAULT_WHY = [
    { icon: ShieldCheck, title: 'CE & ISO Certified', desc: 'Every product meets international medical device certifications and quality standards.' },
    { icon: Lightbulb, title: 'Expert Consultation', desc: 'Qualified biomedical engineers guide you to the right surgical solution for your needs.' },
    { icon: PhoneCall, title: '24/7 Technical Support', desc: 'Round-the-clock maintenance and servicing to keep your OR running without interruption.' },
    { icon: DollarSign, title: 'Competitive Pricing', desc: 'Direct partnerships with manufacturers mean better value for your hospital budget.' },
    { icon: Layers, title: '500+ Products', desc: 'Comprehensive catalogue covering all surgical specialties and clinical departments.' },
    { icon: Award, title: 'Genuine Brands', desc: 'Authorised distributor for globally trusted surgical equipment manufacturers.' },
  ];
  const ICON_MAP = [ShieldCheck, Lightbulb, PhoneCall, DollarSign, Layers, Award];
  const whyChooseUs = hpSettings?.whyChooseUs?.length
    ? hpSettings.whyChooseUs.map((w, i) => ({ ...w, icon: ICON_MAP[i % ICON_MAP.length] }))
    : DEFAULT_WHY;

  const DEFAULT_TRUSTED = [
    { name: 'Bir Hospital',    logo: 'https://birhospital.gov.np/uploads/sitesetting_image/376631297-namslogos.jpg', url: 'https://birhospital.gov.np/en' },
    { name: 'Nepal Mediciti', logo: 'https://www.nepalmediciti.com/assets/img/logo.png', url: 'https://www.nepalmediciti.com' },
    { name: 'Grande Hospital', logo: 'https://www.grandehospital.com/img/logo.png', url: 'https://www.grandehospital.com/en' },
    { name: 'Norvic Hospital', logo: 'https://patient.norvichospital.com/img/norvic-logo-new.jpeg', url: 'https://norvichospital.com' },
    { name: 'Patan Hospital',  logo: 'https://web.pahs.edu.np/wp-content/uploads/2023/12/pahs.png', url: 'https://web.pahs.edu.np' },
    { name: 'Mindray',         logo: 'https://logo.clearbit.com/mindray.com', url: 'https://www.mindray.com/en' },
  ];
  const trustedByList = hpSettings?.trustedBy?.length ? hpSettings.trustedBy : DEFAULT_TRUSTED;

  const DEFAULT_STATS = [
    { value: 500, suffix: '+', label: 'Surgical Products' },
    { value: 200, suffix: '+', label: 'Hospitals Served' },
    { value: 15,  suffix: '+', label: 'Years Experience' },
    { value: 24,  suffix: '/7', label: 'Support Hours' },
  ];
  const statsList = hpSettings?.stats?.length ? hpSettings.stats : DEFAULT_STATS;

  const hero = {
    badge:        hpSettings?.heroBadge        || "Nepal's Trusted Surgical Equipment Partner",
    title:        hpSettings?.heroTitle        || 'Surgical Equipment\nBuilt for Excellence',
    subtitle:     hpSettings?.heroSubtitle     || 'Supplying certified surgical instruments, operating room equipment, and medical devices to hospitals and clinics across Nepal — with expert support from day one.',
    primaryBtn:   hpSettings?.heroPrimaryBtn   || 'Browse Products',
    secondaryBtn: hpSettings?.heroSecondaryBtn || 'Request a Quote',
  };

  const trustedClients = ['Bir Hospital', 'Nepal Mediciti', 'Grande Hospital', 'Norvic Hospital', 'Patan Hospital', 'Teaching Hospital'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <SeoHead
        title="Surgical & Medical Equipment Supplier Nepal"
        description="Meditrust Nepal — Nepal's trusted supplier of surgical instruments, ICU equipment, patient monitors, diagnostic devices and more. CE & ISO certified products, 24/7 support."
        keywords="medical equipment Nepal, surgical instruments Kathmandu, ICU equipment Nepal, patient monitor Nepal, hospital equipment supplier Nepal, medical devices Nepal"
        schemas={[buildWebSiteSchema(), buildOrganizationSchema(), buildLocalBusinessSchema(aggregateRating ? { aggregateRating } : {})]}
      />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #103452 0%, #1a4270 50%, #2D57A3 100%)' }}>
        {/* Parallax Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div style={{ y: heroY1, background: '#005EEA', filter: 'blur(80px)' }} className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"></motion.div>
          <motion.div style={{ y: heroY2, background: '#005EEA', filter: 'blur(60px)' }} className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20"></motion.div>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-white">
              <motion.div variants={fadeInUp} className="inline-flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm text-blue-100 font-medium">{hero.badge}</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 sm:mb-6 font-heading">
                {hero.title.split('\n')[0]}<br />
                <span className="text-blue-300">{hero.title.split('\n')[1] || ''}</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-blue-100 mb-10 max-w-lg leading-relaxed">
                {hero.subtitle}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12">
                <Link to="/products" className="inline-flex items-center justify-center bg-white text-primary-900 px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                  {hero.primaryBtn} <FaArrowRight className="ml-2" />
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center border-2 border-white/60 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                  {hero.secondaryBtn}
                </Link>
              </motion.div>

              {/* Quick contact strip */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-6">
                <a href="tel:+977-9818100515" className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors">
                  <FaPhone className="text-xs" /> +977-9818100515
                </a>
                <a href="https://wa.me/9779818100515" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-300 hover:text-white text-sm transition-colors">
                  <FaWhatsapp /> WhatsApp
                </a>
              </motion.div>
            </motion.div>

            {/* Right — floating stat cards */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="hidden lg:flex flex-col gap-4 items-end"
            >
              <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-72 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-300" style={{ background: 'rgba(0,94,234,0.3)' }}>
                    <Scissors size={20} />
                  </div>
                  <span className="font-semibold">Surgical Instruments</span>
                </div>
                <p className="text-blue-200 text-sm">Scalpels, forceps, retractors, needle holders & 200+ more precision instruments</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-72 text-white ml-8 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-300" style={{ background: 'rgba(0,94,234,0.3)' }}>
                    <Bed size={20} />
                  </div>
                  <span className="font-semibold">Complete OR Setup</span>
                </div>
                <p className="text-blue-200 text-sm">From operating tables to surgical lights — full operating room solutions</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-72 text-white shadow-xl">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-400 text-xl flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">CE & ISO Certified Products</p>
                    <p className="text-blue-200 text-xs mt-0.5">International quality guaranteed</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden shadow-xl border border-gray-100 divide-x divide-y lg:divide-y-0 divide-gray-100"
          >
            {statsList.map((s, i) => (
              <motion.div variants={fadeInUp} key={i} className="p-4 sm:p-8 text-center bg-white hover:bg-primary-50 transition-colors">
                <h3 className="text-2xl sm:text-4xl font-bold" style={{ color: '#2D57A3' }}>
                  <AnimatedCounter from={0} to={s.value ?? s.to} text={s.suffix} />
                </h3>
                <p className="text-gray-500 mt-1 sm:mt-2 font-medium text-xs sm:text-sm">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TRUSTED BY ─── */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest text-center mb-8">Trusted By Leading Hospitals &amp; Brands</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {trustedByList.map((item) => (
              <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-10 w-auto object-contain"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-bold text-sm bg-gray-100 text-gray-600">{item.abbr}</div>
                <span className="font-medium text-xs text-gray-600 text-center leading-tight">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (moved above categories for conversion) ─── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-8">
            <motion.span variants={fadeInUp} className="text-sm font-semibold uppercase tracking-widest text-primary-600">{t('Nav_Products')}</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 font-heading">{t('Featured_Products')}</motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 mt-4 max-w-2xl mx-auto">High-demand surgical equipment trusted by Nepal's leading hospitals.</motion.p>
          </motion.div>

          {loading ? (
             <div className="flex gap-4 overflow-hidden">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse border border-gray-100 flex-shrink-0 w-64">
                   <div className="h-40 bg-gray-100"></div>
                   <div className="p-4 space-y-2">
                     <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                     <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                   </div>
                 </div>
               ))}
             </div>
          ) : featuredProducts.length > 0 ? (
            <FeaturedCarousel products={featuredProducts} addToCart={addToCart} t={t} />
          ) : null }

          <div className="text-center mt-8">
            <Link to="/products" className="inline-flex items-center gap-2 bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold shadow-md hover:shadow-xl hover:-translate-y-1 transition-all hover:bg-primary-800">
              View All Products <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PROMO BANNERS (admin-managed) ─── */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CardBanner placement="home_mid" />
        </div>
      </section>

      {/* ─── BROWSE BY CATEGORY ─── */}
      <section className="py-20" style={{ backgroundColor: '#EEF1F8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-12">
            <motion.span variants={fadeInUp} className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#2D57A3' }}>Product Range</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 font-heading">Browse by Surgical Specialty</motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 mt-4 max-w-2xl mx-auto">From laparoscopic cameras to sterilization autoclaves — we cover every department in your facility.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div variants={fadeInUp} key={cat.slug} whileHover={{ y: -5 }}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg border border-blue-100 hover:border-primary-600 transition-all group h-full"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-primary-600 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary-50"
                      style={{ background: '#EEF1F8' }}>
                      <Icon strokeWidth={1.5} size={32} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-primary-700 transition-colors">{cat.name}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{cat.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center mt-12">
            <Link to="/products" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all text-primary-600 hover:text-primary-800">
              View all products <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SHOP BY FACILITY / BRAND ─── */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-4">Shop by Facility</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Hospital Equipment Nepal', to: '/hospital-equipment-nepal' },
                  { label: 'Clinic Equipment Nepal', to: '/clinic-equipment-nepal' },
                  { label: 'Diagnostic Center Equipment Nepal', to: '/diagnostic-center-equipment-nepal' },
                  { label: 'ICU Equipment Nepal', to: '/category/icu-equipment-nepal' },
                  { label: 'Surgical Instruments Nepal', to: '/category/surgical-instruments-nepal' },
                  { label: 'Patient Monitors Nepal', to: '/category/patient-monitors-nepal' },
                  { label: 'Diagnostic Equipment Nepal', to: '/category/diagnostic-equipment-nepal' },
                ].map(l => (
                  <Link key={l.to} to={l.to} className="px-3 py-1.5 bg-blue-50 hover:bg-primary-600 hover:text-white text-primary-700 rounded-full text-xs font-semibold transition-colors border border-blue-100">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-4">Shop by Brand</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Mindray Nepal', to: '/brand/mindray' },
                  { label: 'Philips Medical Nepal', to: '/brand/philips' },
                  { label: 'GE Healthcare Nepal', to: '/brand/ge-healthcare' },
                  { label: 'Drager Nepal', to: '/brand/drager' },
                  { label: 'Bionet Nepal', to: '/brand/bionet' },
                ].map(l => (
                  <Link key={l.to} to={l.to} className="px-3 py-1.5 bg-blue-50 hover:bg-primary-600 hover:text-white text-primary-700 rounded-full text-xs font-semibold transition-colors border border-blue-100">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-20" style={{ backgroundColor: '#EEF1F8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-14">
            <motion.span variants={fadeInUp} className="text-sm font-semibold uppercase tracking-widest text-primary-600">Why Meditrust Nepal</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 font-heading">Your Complete Surgical Partner</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div variants={fadeInUp} key={idx} whileHover={{ y: -5 }} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg border border-blue-50 group transition-all">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    <Icon strokeWidth={2} size={24} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
      
      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #103452 0%, #2D57A3 100%)' }}>
        {/* Parallax accents */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-300">What Our Clients Say</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 font-heading">Trusted by 200+ Hospitals and Clinics Across Nepal</h2>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              key={currentTestimonial}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl relative"
            >
              <FaQuoteLeft className="text-blue-300 text-4xl mb-6 opacity-50" />
              <p className="text-white text-lg md:text-xl font-medium leading-relaxed mb-8">
                "{displayTestimonials[currentTestimonial]?.content}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-lg">{displayTestimonials[currentTestimonial]?.name}</h4>
                  <p className="text-blue-200 text-sm font-medium">
                    {displayTestimonials[currentTestimonial]?.position}
                    {displayTestimonials[currentTestimonial]?.organization && `, ${displayTestimonials[currentTestimonial].organization}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(displayTestimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg drop-shadow-md" />
                  ))}
                </div>
              </div>
            </motion.div>
            
            <div className="flex justify-center mt-10 gap-4">
              <button onClick={() => setCurrentTestimonial(p => (p - 1 + displayTestimonials.length) % displayTestimonials.length)}
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all border border-white/20">
                <FaChevronLeft />
              </button>
              <div className="flex items-center gap-3">
                {displayTestimonials.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentTestimonial ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/30 w-2.5 hover:bg-white/50'}`} />
                ))}
              </div>
              <button onClick={() => setCurrentTestimonial(p => (p + 1) % displayTestimonials.length)}
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all border border-white/20">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEAD GEN: DOWNLOAD CATALOG ─── */}
      <section className="py-20" style={{ backgroundColor: '#EEF1F8' }}>
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeInUp} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-blue-100 flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-2 block">Free Resources</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Download Our 2024 Product Catalogs</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Get comprehensive details on our full range of surgical instruments, ICU setups, and diagnostic equipment. Perfect for hospital procurement teams and biomedical engineers.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 font-medium"><FaCheckCircle className="text-green-500 mr-3" /> Latest Pricing Guidelines</li>
                <li className="flex items-center text-gray-700 font-medium"><FaCheckCircle className="text-green-500 mr-3" /> Detailed Technical Specifications</li>
                <li className="flex items-center text-gray-700 font-medium"><FaCheckCircle className="text-green-500 mr-3" /> Warranty & Service Policies</li>
              </ul>
            </div>
            <div className="md:w-1/2 w-full bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Request Access</h3>
              <form className="space-y-4" onSubmit={handleCatalogSubmit}>
                <input type="text" placeholder="Your Name" required value={catalogForm.name} onChange={e => setCatalogForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                <input type="email" placeholder="Official Email Address" required value={catalogForm.email} onChange={e => setCatalogForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                <input type="tel" placeholder="Phone Number" required value={catalogForm.phone} onChange={e => setCatalogForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                <button type="submit" disabled={catalogSubmitting} className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-md disabled:opacity-60">
                  {catalogSubmitting ? 'Sending...' : 'Request via WhatsApp'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── NEWSLETTER SIGNUP ─── */}
      <section className="py-20 relative overflow-hidden bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #103452 0%, #005EEA 60%, #2D57A3 100%)' }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            {/* Decorative blobs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-cyan/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

            <div className="relative z-10 grid md:grid-cols-2 gap-0">
              {/* Left — value props */}
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 w-fit">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-100 font-semibold tracking-wide uppercase">Free Updates</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight font-heading mb-4">
                  Stay Ahead in<br /><span className="text-brand-cyan">Medical Equipment</span>
                </h2>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  Join 500+ hospital procurement managers and biomedical engineers who get our monthly updates on new equipment arrivals, price changes, and exclusive offers.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: '🏥', text: 'New product arrivals — first access' },
                    { icon: '💰', text: 'Exclusive deals and seasonal discounts' },
                    { icon: '📋', text: 'Equipment guides and buying tips' },
                    { icon: '⚡', text: 'Emergency stock availability alerts' },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-blue-100 text-sm">
                      <span className="text-lg flex-shrink-0">{icon}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — form */}
              <div className="bg-white/5 backdrop-blur-sm md:border-l border-white/10 p-10 md:p-14 flex flex-col justify-center">
                {nlDone ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">You're subscribed!</h3>
                    <p className="text-blue-100 text-sm">Check your WhatsApp — we've noted your details and will send updates there.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2">Get Free Updates</h3>
                    <p className="text-blue-200 text-sm mb-6">No spam, ever. Unsubscribe anytime via WhatsApp.</p>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!nlForm.name || !nlForm.phone) return;
                        try { await api.post('/notify/newsletter', { name: nlForm.name, phone: nlForm.phone }); } catch (_) {}
                        setNlDone(true);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1.5 uppercase tracking-wide">Your Name</label>
                        <input
                          type="text"
                          required
                          value={nlForm.name}
                          onChange={e => setNlForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Dr. Ram Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/60 focus:border-brand-cyan/60 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1.5 uppercase tracking-wide">Phone / Telegram Number</label>
                        <input
                          type="tel"
                          required
                          value={nlForm.phone}
                          onChange={e => setNlForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="+977 98XXXXXXXX"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/60 focus:border-brand-cyan/60 transition"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl font-bold text-primary-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                        style={{ background: 'linear-gradient(135deg, #7CC62D 0%, #06B6D4 100%)' }}
                      >
                        Subscribe via Telegram →
                      </button>
                      <p className="text-xs text-blue-300 text-center">By subscribing, we'll reach you on WhatsApp. No spam, ever.</p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── VIDEO TESTIMONIALS ─── */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-heading mb-2">What Our Clients Say</h2>
            <p className="text-gray-500 dark:text-gray-400">Trusted by 200+ hospitals and clinics across Nepal</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Dr. Ramesh Shrestha', role: 'ICU Director, Grande International Hospital', quote: 'Meditrust Nepal supplied and commissioned our entire ICU in under 2 weeks. The Mindray ventilators have been running flawlessly for 18 months. Excellent after-sales support.', initials: 'RS', color: 'from-primary-600 to-primary-800' },
              { name: 'Ms. Sunita Pradhan', role: 'Biomedical Engineer, Patan Hospital', quote: 'The equipment quality and documentation for DDA compliance were both outstanding. Their technicians were professional and completed training for all our staff. Highly recommend.', initials: 'SP', color: 'from-green-600 to-green-800' },
              { name: 'Dr. Anil Gurung', role: 'Director, Nobel Hospital Biratnagar', quote: 'We sourced our complete OT setup from Meditrust Nepal. Competitive pricing, fast delivery even to Biratnagar, and their annual maintenance contract gives us peace of mind.', initials: 'AG', color: 'from-purple-600 to-purple-800' },
            ].map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CERTIFICATIONS & TRUST ─── */}
      <section className="py-14 bg-white dark:bg-dark-surface border-t border-b border-gray-100 dark:border-dark-border">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8">Certifications & Compliance</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { badge: 'CE', label: 'CE Marked', sub: 'European Safety Standard', color: 'from-blue-500 to-blue-700' },
              { badge: 'ISO', label: 'ISO 13485', sub: 'Medical Device Quality', color: 'from-green-500 to-green-700' },
              { badge: 'DDA', label: 'DDA Nepal', sub: 'Drug & Device Authority', color: 'from-red-500 to-red-700' },
              { badge: '200+', label: 'Hospitals Served', sub: 'Across Nepal', color: 'from-primary-600 to-primary-800' },
            ].map(({ badge, label, sub, color }) => (
              <motion.div key={label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="flex flex-col items-center text-center gap-3">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                  <span className="text-white font-black text-sm leading-tight">{badge}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {['Bir Hospital', 'TUTH', 'Patan Hospital', 'Grande Hospital', 'Norvic International', 'B.P. Koirala Institute', 'Nobel Hospital', 'Nepal Medical College'].map(h => (
              <span key={h} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border px-3 py-1.5 rounded-full">{h}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeInUp} className="rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #005EEA 0%, #2D57A3 100%)' }}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">Ready to Equip Your Facility?</h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
                Get expert consultation and a competitive quote for any medical equipment — from a single instrument to a complete setup.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="bg-white text-primary-900 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
                  Request a Complete Quote
                </Link>
                <a href="tel:+977-9818100515" className="border-2 border-white/40 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2 transform hover:-translate-y-1">
                  <FaPhone /> Call Us Now
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
