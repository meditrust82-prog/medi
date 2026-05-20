import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SeoHead, { buildBreadcrumbSchema, buildFAQSchema } from '../components/SeoHead';
import { FaSearch, FaTh, FaList, FaArrowRight, FaShoppingCart, FaExchangeAlt, FaTimes, FaSort, FaCheck, FaChevronDown, FaChevronUp, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../api';
import { useCart } from '../contexts/CartContext';
import { useCompare } from '../contexts/CompareContext';
import { useTheme } from '../contexts/ThemeContext';
import Breadcrumb from '../components/ui/Breadcrumb';
import AIProductFinder from '../components/AIProductFinder';
import { useWishlist } from '../contexts/WishlistContext';
import { SidebarBanner, InlineBanner } from '../components/PromoBanner';
import { optimizeCloudinaryUrl, cloudinaryPlaceholder } from '../utils/cloudinary';

const BlurImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const placeholder = cloudinaryPlaceholder(src);
  return (
    <div className="relative w-full h-full">
      {placeholder && !loaded && (
        <img src={placeholder} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

const CardImageSlider = ({ images: rawImages, name, category }) => {
  const images = (rawImages || []).map(u => optimizeCloudinaryUrl(u, { width: 480 }));
  const [idx, setIdx] = useState(0);
  const imgs = images?.length ? images : [];
  const prev = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i - 1 + imgs.length) % imgs.length); };
  const next = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i + 1) % imgs.length); };
  return (
    <div className="relative h-32 sm:h-48 bg-gray-100 overflow-hidden">
      {imgs.length > 0 ? (
        <>
          <BlurImage src={imgs[idx]} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <span className="absolute bottom-1.5 right-1.5 bg-black/40 backdrop-blur-sm text-white text-[8px] sm:text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded pointer-events-none select-none">
            Meditrust Nepal
          </span>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
          <svg className="w-10 h-10 sm:w-16 sm:h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      )}
      {category && (
        <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full leading-tight">{category}</span>
      )}
      {imgs.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity opacity-0 group-hover:opacity-100">‹</button>
          <button onClick={next} className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity opacity-0 group-hover:opacity-100">›</button>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.map((_, i) => (
              <span key={i} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }} className={`block w-1.5 h-1.5 rounded-full cursor-pointer transition-colors ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'name', label: 'Name A–Z' },
  { value: '-name', label: 'Name Z–A' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-createdAt', label: 'Newest First' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  // searchInput tracks the live text field; search in URL is the committed value
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const { addToCart } = useCart();
  const { toggleCompare, compareList } = useCompare();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  // Category sidebar: collapsed when something is selected, expanded otherwise
  const [catExpanded, setCatExpanded] = useState(!searchParams.get('category'));

  // All filter/page state lives in the URL — no duplication
  const search = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const isComparing = (id) => compareList.some(p => p.id === id);

  const debounceRef = useRef(null);

  // Keep the search input in sync when URL changes externally (back/forward)
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // Debounced instant search: commit to URL after 400ms of inactivity
  const handleSearchInput = useCallback((val) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = {};
      if (activeCategory) next.category = activeCategory;
      if (val.trim()) next.search = val.trim();
      if (sort) next.sort = sort;
      Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
      setSearchParams(next);
    }, 400);
  }, [activeCategory, sort, setSearchParams]);

  // Cleanup debounce on unmount
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    toast.success(
      <div className="flex items-center gap-2">
        <FaCheck className="text-green-500" />
        <span><strong>{product.name}</strong> added to quote</span>
        <Link to="/cart" className="text-primary-600 font-semibold underline ml-1">View Cart</Link>
      </div>,
      { autoClose: 3000 }
    );
  }, [addToCart]);

  // Derive unique categories from products
  useEffect(() => {
    api.get('/products', { params: { limit: 100 } }).then(res => {
      const prods = res.data.products || res.data || [];
      const seen = new Set();
      const cats = [];
      prods.forEach(p => {
        if (p.category && !seen.has(p.category)) {
          seen.add(p.category);
          cats.push({ name: p.category, slug: p.category.toLowerCase().replace(/\s+/g, '-') });
        }
      });
      setCategories(cats);
    }).catch(console.error);
  }, []);

  const doFetchProducts = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const params = { page, limit: 20 };
      if (activeCategory) params.category = activeCategory;
      if (search) params.search = search;
      if (sort) params.sort = sort;
      const res = await api.get('/products', { params });
      setProducts(res.data.products || res.data || []);
      // Backend returns { total, page, pages } — map into shared pagination state
      if (res.data.total !== undefined) {
        setPagination({
          total: res.data.total,
          page: res.data.page || page,
          pages: res.data.pages || Math.ceil(res.data.total / 20),
        });
      } else if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setFetchError(true);
      // Do NOT clear products — preserve the last known list so users can still see & order
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search, sort, page]);

  useEffect(() => {
    doFetchProducts();
  }, [doFetchProducts]);

  const updateParams = (overrides) => {
    const next = {};
    if (activeCategory) next.category = activeCategory;
    if (search) next.search = search;
    if (sort) next.sort = sort;
    if (page > 1) next.page = String(page);
    Object.assign(next, overrides);
    // Remove falsy values
    Object.keys(next).forEach(k => { if (!next[k] || next[k] === '1') delete next[k]; });
    setSearchParams(next);
  };

  const handleCategoryChange = (name) => {
    updateParams({ category: name || undefined, page: undefined });
    // selecting a specific category → collapse; clearing → expand
    setCatExpanded(!name);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput || undefined, page: undefined });
  };

  const handleSort = (value) => {
    updateParams({ sort: value || undefined, page: undefined });
  };

  const handlePage = (newPage) => {
    updateParams({ page: newPage > 1 ? String(newPage) : undefined });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = search || activeCategory || sort;
  // activeCategory in URL is the raw category name (matches backend)
  const activeCategoryName = activeCategory || '';

  // ── Per-category SEO metadata ────────────────────────────────────────────
  const CATEGORY_SEO = {
    'Surgical Instruments': {
      title: 'Surgical Instruments Nepal — Buy CE & ISO Certified',
      description: 'Buy surgical instruments in Nepal from Meditrust Nepal. Laparoscopic tools, general surgery sets, orthopedic instruments, cardiovascular instruments. CE & ISO certified. Kathmandu delivery.',
      keywords: 'surgical instruments Nepal, buy surgical instruments Kathmandu, laparoscopic instruments Nepal, orthopedic surgical tools Nepal, surgical equipment supplier Nepal',
      faq: [
        { q: 'Where can I buy surgical instruments in Nepal?', a: 'Meditrust Nepal supplies CE and ISO certified surgical instruments in Kathmandu and across Nepal. Call +977-9818100515 or visit meditrustnepal.com.' },
        { q: 'What types of surgical instruments does Meditrust Nepal supply?', a: 'We supply laparoscopic instruments, general surgery sets, orthopedic instruments, cardiovascular instruments, ENT instruments, ophthalmic tools, and more.' },
        { q: 'Are the surgical instruments CE and ISO certified?', a: 'Yes. All surgical instruments from Meditrust Nepal are CE marked and ISO 13485 certified, meeting international medical device quality standards.' },
      ],
      seoText: 'Meditrust Nepal is Nepal\'s leading supplier of surgical instruments for hospitals, clinics, and surgical centres. Our range includes laparoscopic instruments, general surgery sets, orthopedic instruments, cardiovascular tools, ENT instruments, and ophthalmic equipment — all CE and ISO 13485 certified. We serve 200+ hospitals across Kathmandu, Pokhara, Biratnagar, and all major cities in Nepal. Competitive pricing, installation support, and 24/7 after-sales service included.',
    },
    'ICU Equipment': {
      title: 'ICU Equipment Nepal — Ventilators, Patient Monitors, Infusion Pumps',
      description: 'Buy ICU equipment in Nepal — ventilators, patient monitors, infusion pumps, defibrillators, syringe pumps. CE & ISO certified. Meditrust Nepal, Kathmandu. 24/7 technical support.',
      keywords: 'ICU equipment Nepal, ventilator Nepal price, patient monitor Nepal, infusion pump Nepal, ICU ventilator Kathmandu, critical care equipment Nepal',
      faq: [
        { q: 'Where can I buy ICU ventilators in Nepal?', a: 'Meditrust Nepal supplies CE certified ICU ventilators with full installation, training, and 24/7 technical support across Nepal. Call +977-9818100515.' },
        { q: 'What is the price of a patient monitor in Nepal?', a: 'Patient monitor prices in Nepal vary by specification. Contact Meditrust Nepal at +977-9818100515 for the latest pricing and institutional discounts.' },
        { q: 'Does Meditrust Nepal supply infusion pumps and syringe pumps?', a: 'Yes. We supply volumetric infusion pumps, syringe pumps, and peristaltic pumps from internationally certified manufacturers.' },
      ],
      seoText: 'Meditrust Nepal supplies a full range of ICU and critical care equipment for hospitals across Nepal. Our ICU product line includes mechanical ventilators, multi-parameter patient monitors, infusion pumps, syringe pumps, defibrillators, pulse oximeters, and BiPAP/CPAP machines — all CE and ISO certified. We provide complete installation, staff training, preventive maintenance contracts, and 24/7 emergency technical support.',
    },
    'Diagnostic Equipment': {
      title: 'Diagnostic Equipment Nepal — ECG, Ultrasound, X-Ray Machines',
      description: 'Buy diagnostic equipment in Nepal — ECG machines, ultrasound, X-ray, spirometers, pulse oximeters. CE certified. Meditrust Nepal, Kathmandu. Competitive prices and 24/7 support.',
      keywords: 'diagnostic equipment Nepal, ECG machine Nepal price, ultrasound machine Nepal, X-ray machine Kathmandu, diagnostic devices Nepal, medical diagnostic supplier Nepal',
      faq: [
        { q: 'Where can I buy an ECG machine in Nepal?', a: 'Meditrust Nepal supplies 3-channel, 6-channel, and 12-channel ECG machines in Nepal. Call +977-9818100515 for pricing and specifications.' },
        { q: 'What diagnostic equipment does Meditrust Nepal supply?', a: 'We supply ECG machines, portable ultrasound, X-ray machines, spirometers, pulse oximeters, glucometers, and other diagnostic devices.' },
        { q: 'Does Meditrust Nepal provide after-sales support for diagnostic equipment?', a: 'Yes. We provide installation, calibration, and preventive maintenance for all diagnostic equipment we supply across Nepal.' },
      ],
      seoText: 'Meditrust Nepal supplies diagnostic equipment to hospitals, diagnostic centres, and clinics across Nepal. Our diagnostic range includes 12-lead ECG machines, portable ultrasound machines, digital X-ray systems, spirometers, pulse oximeters, patient monitoring systems, and laboratory diagnostic equipment — all internationally certified. We offer competitive pricing, institutional discounts, and complete after-sales technical support.',
    },
    'Hospital Furniture': {
      title: 'Hospital Furniture Nepal — Beds, Stretchers, Wheelchairs',
      description: 'Buy hospital furniture in Nepal — hospital beds, stretchers, wheelchairs, IV stands, examination tables. CE certified. Meditrust Nepal, Kathmandu. Bulk pricing available.',
      keywords: 'hospital furniture Nepal, hospital bed Nepal price, stretcher Nepal, wheelchair Nepal, IV stand Kathmandu, hospital equipment furniture Nepal',
      faq: [
        { q: 'Where can I buy hospital beds in Nepal?', a: 'Meditrust Nepal supplies manual, semi-electric, and fully electric hospital beds across Nepal. Bulk pricing available for hospitals. Call +977-9818100515.' },
        { q: 'What hospital furniture does Meditrust Nepal supply?', a: 'We supply hospital beds, ICU beds, stretchers, wheelchairs, IV stands, examination tables, overbed tables, bedside lockers, and waiting room chairs.' },
      ],
      seoText: 'Meditrust Nepal supplies hospital furniture and patient care equipment to healthcare facilities across Nepal. Our hospital furniture range includes manual and electric hospital beds, ICU beds with pressure mattresses, patient trolleys, stretchers, wheelchairs, IV stands, examination couches, overbed tables, and hospital waiting area furniture — all meeting international quality standards with bulk pricing for hospital projects.',
    },
    'Laboratory Equipment': {
      title: 'Laboratory Equipment Nepal — Analysers, Microscopes, Centrifuges',
      description: 'Buy laboratory equipment in Nepal — biochemistry analysers, haematology analysers, microscopes, centrifuges, incubators. CE certified. Meditrust Nepal, Kathmandu.',
      keywords: 'laboratory equipment Nepal, lab equipment Kathmandu, biochemistry analyser Nepal, haematology analyser Nepal, microscope Nepal price, centrifuge Nepal',
      faq: [
        { q: 'Where can I buy laboratory analysers in Nepal?', a: 'Meditrust Nepal supplies biochemistry analysers, haematology analysers, urine analysers, and electrolyte analysers across Nepal with full installation and calibration.' },
        { q: 'What laboratory equipment does Meditrust Nepal supply?', a: 'We supply biochemistry analysers, haematology analysers, microscopes, centrifuges, incubators, refrigerators, autoclaves, and other lab equipment.' },
      ],
      seoText: 'Meditrust Nepal is a trusted supplier of clinical laboratory equipment for hospitals, diagnostic labs, and research centres across Nepal. Our lab product range includes biochemistry analysers, haematology analysers, urine analysers, laboratory microscopes, centrifuges, incubators, biological safety cabinets, and sterilization equipment — all CE certified with full calibration, installation, and preventive maintenance services.',
    },
    'Sterilization Equipment': {
      title: 'Sterilization Equipment Nepal — Autoclaves, UV Sterilizers',
      description: 'Buy sterilization equipment in Nepal — autoclaves, UV sterilizers, steam sterilizers, dry heat ovens. CE certified. Meditrust Nepal, Kathmandu. Hospital and clinic supply.',
      keywords: 'autoclave Nepal price, sterilization equipment Nepal, steam sterilizer Nepal, UV sterilizer Kathmandu, hospital sterilization Nepal',
      faq: [
        { q: 'Where can I buy an autoclave in Nepal?', a: 'Meditrust Nepal supplies bench-top and floor-standing autoclaves across Nepal. Call +977-9818100515 for specifications and pricing.' },
        { q: 'What sterilization equipment does Meditrust Nepal supply?', a: 'We supply steam autoclaves, UV sterilizers, dry heat sterilizers, EO sterilizers, and washer-disinfectors for hospitals and clinics.' },
      ],
      seoText: 'Meditrust Nepal supplies sterilization and infection control equipment to hospitals, surgical centres, and dental clinics across Nepal. Our sterilization range includes pre-vacuum and gravity autoclaves, UV sterilization cabinets, dry heat sterilizers, and washer-disinfectors — all validated to international sterilization standards with full validation documentation and service contracts.',
    },
    'Imaging Equipment': {
      title: 'Imaging Equipment Nepal — X-Ray, Ultrasound, CT Scan Supplies',
      description: 'Medical imaging equipment supplier in Nepal — digital X-ray, ultrasound, C-arm, portable imaging. CE certified. Meditrust Nepal, Kathmandu. Installation and service included.',
      keywords: 'medical imaging Nepal, X-ray machine Nepal, C-arm Nepal, portable ultrasound Nepal, digital radiography Nepal, imaging equipment Kathmandu',
      faq: [
        { q: 'Where can I buy an X-ray machine in Nepal?', a: 'Meditrust Nepal supplies digital and analog X-ray machines, portable X-ray units, and dental X-ray equipment across Nepal with full installation.' },
        { q: 'Does Meditrust Nepal supply C-arm machines?', a: 'Yes. We supply C-arm fluoroscopy systems for orthopaedic, vascular, and surgical procedures with full commissioning and training.' },
      ],
      seoText: 'Meditrust Nepal supplies medical imaging equipment to hospitals and radiology centres across Nepal. Our imaging product line includes digital X-ray systems, portable X-ray units, colour Doppler ultrasound machines, C-arm fluoroscopy systems, and related imaging accessories — all CE certified with full installation, radiation safety compliance, and ongoing maintenance contracts.',
    },
  };

  const catSeo = CATEGORY_SEO[activeCategoryName] || null;

  return (
    <>
      <SeoHead
        title={catSeo ? catSeo.title : 'Medical Equipment Nepal — Surgical, ICU, Diagnostic Devices'}
        description={catSeo ? catSeo.description : 'Browse 500+ CE & ISO certified medical equipment — surgical instruments, ICU ventilators, patient monitors, ECG machines, diagnostic devices, hospital furniture and more from Meditrust Nepal, Kathmandu.'}
        keywords={catSeo ? catSeo.keywords : 'medical equipment Nepal, surgical instruments Nepal, ICU equipment Kathmandu, patient monitor Nepal, ECG machine Nepal, hospital equipment supplier Nepal, buy medical devices Nepal'}
        canonical={activeCategoryName ? `/products?category=${encodeURIComponent(activeCategoryName)}` : '/products'}
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Products', url: '/products' },
            ...(activeCategoryName ? [{ name: activeCategoryName }] : []),
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `https://meditrustnepal.com/products${activeCategoryName ? `?category=${encodeURIComponent(activeCategoryName)}` : ''}#collection`,
            name: activeCategoryName ? `${activeCategoryName} — Meditrust Nepal` : 'Medical Equipment — Meditrust Nepal',
            description: catSeo ? catSeo.description : 'Browse our comprehensive range of certified medical equipment for hospitals and clinics across Nepal.',
            url: `https://meditrustnepal.com/products${activeCategoryName ? `?category=${encodeURIComponent(activeCategoryName)}` : ''}`,
            provider: { '@type': 'Organization', '@id': 'https://meditrustnepal.com/#organization', name: 'Meditrust Nepal' },
          },
          ...(products.length > 0 ? [{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: activeCategoryName ? `${activeCategoryName} — Nepal` : 'Medical Equipment Nepal',
            numberOfItems: pagination.total || products.length,
            itemListElement: products.slice(0, 10).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name,
              url: `https://meditrustnepal.com/products/${p.slug || p.id}`,
            })),
          }] : []),
          buildFAQSchema(
            catSeo ? catSeo.faq : [
              { q: 'Where can I buy medical equipment in Nepal?', a: 'Meditrust Nepal supplies CE & ISO certified medical equipment across Nepal. Browse our full catalogue at meditrustnepal.com/products or call +977-9818100515.' },
              { q: 'Does Meditrust Nepal sell ICU equipment?', a: 'Yes. Meditrust Nepal supplies ICU ventilators, patient monitors, infusion pumps, syringe pumps and other critical care equipment with full installation and after-sales support.' },
              { q: 'What brands of medical equipment does Meditrust Nepal carry?', a: 'Meditrust Nepal carries internationally certified brands of surgical instruments, diagnostic devices, laboratory equipment, and hospital furniture — all CE and ISO certified.' },
              { q: 'Can I get a quotation for medical equipment from Meditrust Nepal?', a: 'Yes. Request a free quotation via the contact form at meditrustnepal.com/contact or WhatsApp +977-9818100515.' },
            ]
          ),
        ]}
      />

      <section className="py-6 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t('Nav_Products') },
            ...(activeCategoryName ? [{ label: activeCategoryName }] : []),
          ]} />

          {/* Mobile category strip — horizontal scrollable pills (hidden on lg) */}
          <div className="lg:hidden mb-4 -mx-3 px-3">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => handleCategoryChange('')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  activeCategory === ''
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    activeCategory === cat.name
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar — desktop only */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
              <AIProductFinder />
              {/* Category accordion */}
              <div className={`rounded-xl shadow-sm border p-5 transition-colors ${isDark ? 'bg-dark-surface border-dark-border' : 'bg-white border-gray-100'}`}>
                {/* Header row — always visible, toggles the list */}
                <button
                  onClick={() => setCatExpanded(prev => !prev)}
                  className="w-full flex items-center justify-between mb-1 group"
                >
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('Filter_By_Category')}
                  </span>
                  <span className={`text-xs transition-transform duration-200 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`}>
                    {catExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>

                {/* Selected category pill — visible when collapsed & something is active */}
                {!catExpanded && activeCategory && (
                  <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-[10px] bg-brand-cyan/10 border border-brand-cyan/30">
                    <FaCheck className="text-brand-cyan text-xs flex-shrink-0" />
                    <span className="text-brand-cyan text-sm font-semibold flex-1 truncate">
                      {activeCategory}
                    </span>
                    <button
                      onClick={() => handleCategoryChange('')}
                      className="text-brand-cyan/60 hover:text-brand-red transition-colors flex-shrink-0"
                      title="Clear selection"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                )}

                {/* Expandable category list */}
                {catExpanded && (
                  <ul className="space-y-0.5 mt-3">
                    <li>
                      <button
                        onClick={() => handleCategoryChange('')}
                        className={`w-full text-left px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all flex items-center gap-2 ${
                          activeCategory === ''
                            ? 'bg-brand-cyan/10 text-brand-cyan'
                            : isDark
                              ? 'text-gray-300 hover:bg-dark-card hover:text-white'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {activeCategory === '' && <FaCheck className="text-brand-cyan text-xs flex-shrink-0" />}
                        <span>{t('All_Categories')}</span>
                      </button>
                    </li>
                    {categories.map((cat) => {
                      const isActive = activeCategory === cat.name;
                      return (
                        <li key={cat.name}>
                          <button
                            onClick={() => handleCategoryChange(cat.name)}
                            className={`w-full text-left px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all flex items-center gap-2 ${
                              isActive
                                ? 'bg-brand-cyan/10 text-brand-cyan'
                                : isDark
                                  ? 'text-gray-300 hover:bg-dark-card hover:text-white'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {isActive
                              ? <FaCheck className="text-brand-cyan text-xs flex-shrink-0" />
                              : cat.icon
                                ? <img src={cat.icon} alt="" loading="lazy" className="w-4 h-4 object-contain flex-shrink-0" />
                                : <span className="w-4 flex-shrink-0" />
                            }
                            <span className="flex-1 truncate">{cat.name}</span>
                            {cat._count?.products > 0 && (
                              <span className={`text-xs ml-auto flex-shrink-0 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`}>
                                {cat._count.products}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* CTA */}
              <div className="rounded-xl p-6 mt-6 text-white" style={{ background: 'linear-gradient(135deg, #7CC62D 0%, #06B6D4 100%)' }}>
                <h3 className="font-semibold mb-2">{t('Need_Help_Choosing')}</h3>
                <p className="text-white/80 text-sm mb-4">{t('Help_Choosing_Desc')}</p>
                <Link to="/contact" className="bg-white text-brand-cyan px-4 py-2 rounded-[10px] text-sm font-semibold inline-block hover:bg-gray-50 transition-colors">
                  {t('Contact_Us')}
                </Link>
              </div>
              <SidebarBanner placement="products_sidebar" />
              </div>{/* end sticky wrapper */}
            </div>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* Search + Sort bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      placeholder={t('Search_Products')}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    {t('Search')}
                  </button>
                </form>

                {/* Sort */}
                <div className="relative">
                  <FaSort className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <select
                    value={sort}
                    onChange={(e) => handleSort(e.target.value)}
                    className="pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white appearance-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs text-gray-500 font-medium">{t('Active_Filters')}:</span>
                  {search && (
                    <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
                      "{search}"
                      <button onClick={() => { setSearchInput(''); updateParams({ search: undefined, page: undefined }); }} className="ml-1 hover:text-primary-900">
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  )}
                  {activeCategoryName && (
                    <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
                      {activeCategoryName}
                      <button onClick={() => handleCategoryChange('')} className="ml-1 hover:text-primary-900">
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  )}
                  {sort && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                      {SORT_OPTIONS.find(o => o.value === sort)?.label}
                      <button onClick={() => handleSort('')} className="ml-1 hover:text-gray-900">
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  )}
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium underline underline-offset-2 ml-1">
                    {t('Clear_All_Filters')}
                  </button>
                </div>
              )}

              {/* Error recovery banner */}
              {fetchError && (
                <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
                  <span className="text-lg">⚠️</span>
                  <span className="flex-1">Products could not be refreshed. The list below may be outdated.</span>
                  <button
                    onClick={doFetchProducts}
                    className="flex-shrink-0 bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 text-sm">
                  {loading
                    ? t('Loading...')
                    : `${pagination.total || products.length} ${t('Products_Count_Label')}`}
                  {activeCategoryName && !loading && (
                    <span className="text-gray-400 ml-1">
                      {t('In_Category')} <span className="text-gray-600 font-medium">{activeCategoryName}</span>
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    aria-label="Grid view"
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    aria-label="List view"
                  >
                    <FaList />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-3 sm:gap-6`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                      <div className="h-32 sm:h-48 bg-gray-200"></div>
                      <div className="p-3 sm:p-5">
                        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-3 sm:gap-6`}>
                  {products.map((product, pIdx) => viewMode === 'grid' ? (
                    <React.Fragment key={product.id}>
                      {pIdx === 6 && <InlineBanner placement="products_inline" />}
                      <Link to={`/products/${product.slug || product.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover group border border-gray-100 flex flex-col cursor-pointer">
                        <div className="relative">
                          <CardImageSlider images={product.allImages} name={product.name} category={product.category} />
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="absolute top-2 right-2 z-10 text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>
                          )}
                        </div>
                        <div className="p-3 sm:p-5 flex flex-col flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-sm sm:text-base line-clamp-2 leading-snug">{product.name}</h3>
                          {product.description && (
                            <p className="text-gray-500 text-xs sm:text-sm line-clamp-1 mt-1 sm:mt-2">{product.description}</p>
                          )}
                          {product.price && (
                            <div className="mt-1 sm:mt-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm sm:text-lg font-bold text-primary-700">NRS {product.price.toLocaleString()}</p>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-xs sm:text-sm text-gray-400 line-through">NRS {product.originalPrice.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="mt-auto pt-2 flex gap-1.5 sm:gap-2">
                            <span className="flex-1 text-center bg-primary-600 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium">
                              {t('View_Details')}
                            </span>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(product); }}
                              className={`flex justify-center items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isComparing(product.id) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                              title={isComparing(product.id) ? t('Remove_From_Compare') : t('Add_To_Compare')}
                            >
                              <FaExchangeAlt className="text-xs sm:text-sm" />
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                              className="flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
                              title={t('Add_To_Cart')}
                            >
                              <FaShoppingCart className="text-xs sm:text-sm" />
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                              className={`flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                                isWishlisted(product.slug) ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400'
                              }`}
                              title="Save to wishlist"
                            >
                              {isWishlisted(product.slug) ? <FaHeart className="text-xs sm:text-sm" /> : <FaRegHeart className="text-xs sm:text-sm" />}
                            </button>
                          </div>
                        </div>
                      </Link>
                    </React.Fragment>
                  ) : (
                      <Link key={product.id} to={`/products/${product.slug || product.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover group border border-gray-100 flex cursor-pointer">
                        <div className="relative w-44 sm:w-48 h-40 bg-gray-100 overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <>
                              <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <span className="absolute bottom-1.5 right-1.5 bg-black/40 backdrop-blur-sm text-white text-[8px] sm:text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded pointer-events-none select-none">
                                Meditrust Nepal
                              </span>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                              <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="absolute top-2 left-2 text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>
                          )}
                        </div>
                        <div className="p-4 sm:p-5 flex-1">
                          {product.category && <span className="text-primary-600 text-xs font-medium">{product.category}</span>}
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mt-1">{product.name}</h3>
                          {product.description && (
                            <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p>
                          )}
                          {product.price && (
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                              <p className="text-lg font-bold text-primary-700">NRS {product.price.toLocaleString()}</p>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through">NRS {product.originalPrice.toLocaleString()}</span>
                              )}
                            </div>
                          )}
                          <div className="mt-3 flex gap-3 items-center">
                            <Link to={`/products/${product.slug || product.id}`} className="text-primary-600 text-sm font-medium flex items-center hover:underline">
                              {t('View_Details')} <FaArrowRight className="ml-1 text-xs" />
                            </Link>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(product); }}
                              className={`text-sm font-medium flex items-center transition-colors ${isComparing(product.id) ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              <FaExchangeAlt className="mr-1" /> {t('Compare')}
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                              className="text-green-600 text-sm font-medium flex items-center hover:text-green-700"
                            >
                              <FaShoppingCart className="mr-1" /> {t('Add_To_Quote')}
                            </button>
                          </div>
                        </div>
                      </Link>
                  ))}
                </div>
              ) : fetchError ? (
                <div className="text-center py-16 bg-white rounded-xl border border-amber-100">
                  <div className="text-5xl mb-4">📡</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Problem</h3>
                  <p className="text-gray-500 mb-2 text-sm px-4">We couldn't load products right now. Please check your internet and try again.</p>
                  <p className="text-gray-400 text-xs mb-6 px-4">You can also contact us directly to place an order.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center px-6">
                    <button
                      onClick={doFetchProducts}
                      className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Try Again
                    </button>
                    <a
                      href="tel:+9779818100515"
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      📞 Call Us to Order
                    </a>
                    <a
                      href="https://wa.me/9779818100515"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      WhatsApp Order
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('No_Products_Found')}</h3>
                  <p className="text-gray-500 mb-4">{t('Try_Adjusting_Search')}</p>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-800 font-medium underline">
                      {t('Clear_All_Filters')}
                    </button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center mt-8 gap-2">
                  <button
                    onClick={() => handlePage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white"
                  >
                    {t('Prev')}
                  </button>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const start = Math.max(1, Math.min(page - 2, pagination.pages - 4));
                    const pageNum = start + i;
                    if (pageNum > pagination.pages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg ${page === pageNum ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-white'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePage(page + 1)}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white"
                  >
                    {t('Next')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SEO text block — keyword rich, visible to bots and users */}
          {catSeo ? (
            <div className="mt-12 pt-8 border-t border-gray-200 px-3 sm:px-4">
              <div className="max-w-3xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {catSeo.title.split('—')[0].trim()} in Nepal
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">{catSeo.seoText}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {catSeo.keywords.split(', ').map(kw => (
                    <span key={kw} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12 pt-8 border-t border-gray-200 px-3 sm:px-4">
              <div className="max-w-3xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Medical Equipment Supplier in Nepal</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Meditrust Nepal is Kathmandu&apos;s trusted supplier of CE and ISO certified medical equipment for hospitals, clinics, diagnostic centres, and healthcare facilities across Nepal. Our catalogue includes surgical instruments, ICU ventilators, patient monitors, ECG machines, ultrasound machines, X-ray systems, laboratory analysers, hospital furniture, sterilization equipment, and medical consumables. We serve 200+ healthcare institutions across Kathmandu, Pokhara, Biratnagar, Butwal, and all major cities. All products are genuine, internationally certified, and backed by 24/7 technical support and after-sales service.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['surgical instruments Nepal', 'ICU equipment Nepal', 'patient monitor Nepal', 'ECG machine Nepal', 'hospital equipment Kathmandu', 'medical devices Nepal', 'ventilator Nepal', 'laboratory equipment Nepal'].map(kw => (
                    <span key={kw} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Products;
