import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { toast } from 'react-toastify';

const Footer = () => {
  const { t } = useTranslation();
  const [nlEmail, setNlEmail] = useState('');
  const [nlDone, setNlDone] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!nlEmail.trim()) return;
    const msg = encodeURIComponent(`Hi Meditrust Nepal! I'd like to subscribe to product updates and offers. My email: ${nlEmail}`);
    window.open(`https://wa.me/9779818100515?text=${msg}`, '_blank');
    setNlDone(true);
    toast.success('Thanks! We\'ll add you to our updates list.');
  };

  const quickLinks = [
    { name: t('Nav_Home'), path: '/home' },
    { name: t('Nav_Products'), path: '/products' },
    { name: 'My Wishlist', path: '/wishlist' },
    { name: 'Bulk Inquiry', path: '/bulk-inquiry' },
    { name: t('Nav_About'), path: '/about' },
    { name: t('Nav_Contact'), path: '/contact' },
  ];

  const services = [
    { name: t('Service_Supply'), path: '/services' },
    { name: t('Service_Consultation'), path: '/services' },
    { name: t('Service_Installation'), path: '/services' },
    { name: t('Service_Maintenance'), path: '/services' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section — coming soon, form not yet active */}
      <div style={{ background: 'linear-gradient(135deg, #7CC62D 0%, #06B6D4 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">{t('Subscribe_Newsletter')}</h3>
              <p className="text-white/80 mt-1">{t('Newsletter_Desc')}</p>
            </div>
            {nlDone ? (
              <p className="text-white font-semibold">✅ Subscribed! We'll be in touch.</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <input
                  type="email"
                  value={nlEmail}
                  onChange={e => setNlEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 w-full sm:w-72 px-4 py-3 rounded-[10px] text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="bg-white text-brand-cyan px-6 py-3 rounded-[10px] hover:bg-gray-50 transition-colors font-semibold whitespace-nowrap text-sm flex items-center gap-2"
                >
                  Subscribe <FaArrowRight className="text-xs" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <Logo size="md" className="opacity-95" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('Footer_Desc')}
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/meditrustnepal/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#3b5998] transition-colors">
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/meditrust_82" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#E1306C] transition-colors">
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com/@meditrust_82" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-black transition-colors">
                <SiTiktok />
              </a>
              <a href="https://www.linkedin.com/company/meditrust_82" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#0077B5] transition-colors">
                <FaLinkedinIn />
              </a>
              <a href="https://wa.me/9779818100515" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">{t('Quick_Links')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center">
                    <FaArrowRight className="mr-2 text-xs text-brand-cyan" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">{t('Our_Services')}</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link to={service.path} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center">
                    <FaArrowRight className="mr-2 text-xs text-brand-cyan" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">{t('Contact_Info')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <a href="https://maps.app.goo.gl/2xTCxp9YeVqmSJgE7" target="_blank" rel="noopener noreferrer" className="flex items-start text-gray-400 hover:text-white transition-colors">
                  <FaMapMarkerAlt className="text-brand-cyan mt-1 mr-3 flex-shrink-0" />
                  <span className="text-sm cursor-pointer">Kathmandu, Nepal</span>
                </a>
              </li>
              <li>
                <a href="tel:+977-9818100515" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <FaPhone className="text-brand-cyan mr-3 flex-shrink-0" />
                  <span className="text-sm">+977-9818100515</span>
                </a>
              </li>
              <li>
                <a href="mailto:meditrust82@gmail.com" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <FaEnvelope className="text-brand-cyan mr-3 flex-shrink-0" />
                  <span className="text-sm">meditrust82@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright — pb-20 on mobile leaves room above the MobileTabBar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Meditrust Nepal. {t('All_Rights_Reserved')}</p>
            <div className="flex space-x-6 mt-3 md:mt-0">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('Privacy_Policy')}</Link>
              <Link to="/terms-and-conditions" className="hover:text-white transition-colors">{t('Terms_Of_Service')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
