import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaBars, FaTimes, FaShoppingCart, FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import api from '../api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { t } = useTranslation();
  const { isDark, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search') || '');
  }, [location.pathname, location.search]);

  const navLinks = useMemo(() => [
    { name: t('Nav_Home'),     path: '/home' },
    { name: t('Nav_Products'), path: '/products' },
    { name: t('Nav_Services'), path: '/services' },
    { name: t('Nav_About'),    path: '/about' },
    { name: 'Blog',            path: '/blog' },
    { name: t('Nav_Contact'),  path: '/contact' },
  ], [t]);

  const isActive = useCallback((path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const showSearchBar = ['/', '/home', '/products'].some(p =>
    p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)
  );

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set('search', trimmed);
    navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`);
    setIsOpen(false);
  }, [navigate, searchQuery]);

  const topBarBg   = isDark ? 'bg-dark-surface'  : 'bg-primary-900';
  const navBg      = isDark
    ? scrolled ? 'bg-dark-surface/90 shadow-dark-card border-b border-dark-border' : 'bg-dark-bg border-b border-dark-border'
    : scrolled ? 'glass shadow-lg border-b border-white/20' : 'bg-white shadow-sm border-b border-gray-100';
  const subBarBg   = isDark ? 'bg-dark-surface border-t border-dark-border' : 'bg-gray-50/80 border-t border-gray-100';
  const inputCls   = isDark
    ? 'bg-dark-card border-dark-border text-white placeholder-dark-muted focus:ring-brand-cyan'
    : 'bg-white border-gray-200 text-gray-700 focus:ring-primary-300';
  const linkActive  = isDark ? 'text-brand-cyan bg-brand-cyan/10' : 'text-primary-600 bg-primary-50';
  const linkDefault = isDark ? 'text-gray-300 hover:text-brand-cyan hover:bg-brand-cyan/10' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50';
  const mobileMenuBg = isDark ? 'bg-dark-surface border-t border-dark-border' : 'bg-white border-t border-gray-100';
  const iconBtn     = isDark ? 'text-gray-300 hover:text-brand-cyan' : 'text-gray-600 hover:text-primary-600';
  const themeBtn    = isDark
    ? 'border-dark-border text-gray-300 hover:bg-dark-card'
    : 'border-gray-200 text-gray-700 hover:bg-gray-50';

  return (
    <>
      {/* Top Bar */}
      <div className={`${topBarBg} text-white text-sm py-2 hidden md:block transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="tel:+977-9818100515" className="flex items-center hover:text-brand-cyan transition-colors">
              <FaPhone className="mr-2 text-xs" />
              +977-9818100515
            </a>
            <a href="mailto:meditrust82@gmail.com" className="flex items-center hover:text-brand-cyan transition-colors">
              <FaEnvelope className="mr-2 text-xs" />
              meditrust82@gmail.com
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://www.facebook.com/meditrustnepal/" target="_blank" rel="noopener noreferrer" className="hover:text-[#3b5998] transition-colors">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/meditrust_82" target="_blank" rel="noopener noreferrer" className="hover:text-[#E1306C] transition-colors">
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@meditrust_82" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <SiTiktok />
            </a>
            <a href="https://www.linkedin.com/company/meditrust_82" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-colors">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Logo size="lg" />

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path) ? linkActive : linkDefault
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA + Cart + Theme + Lang */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Cart */}
              <Link to="/cart" className={`relative p-2 transition-colors ${iconBtn}`}>
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-[10px] border transition-colors ${themeBtn}`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {isDark
                  ? <FaSun className="text-brand-lime text-base" />
                  : <FaMoon className="text-primary-600 text-base" />
                }
              </button>


              {/* CTA */}
              <Link to="/contact" className="btn-gradient px-5 py-2.5 text-sm inline-block text-center">
                {t('Request_Quotation')}
              </Link>
            </div>

            {/* Mobile: cart + theme + hamburger + lang */}
            <div className="lg:hidden flex items-center gap-2">
              <Link to="/cart" className={`relative p-2 ${iconBtn}`}>
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-[10px] border transition-colors ${themeBtn}`}
                aria-label="Toggle theme"
              >
                {isDark
                  ? <FaSun className="text-brand-lime text-base" />
                  : <FaMoon className="text-primary-600 text-base" />
                }
              </button>
              <button
                className={`p-2 rounded-[10px] transition-colors ${iconBtn}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle mobile menu"
              >
                {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop search bar — only on home/products */}
        {showSearchBar && (
        <div className={`hidden lg:block ${subBarBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              <div className="relative flex-1">
                <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Search_Placeholder')}
                  className={`w-full rounded-[10px] border pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${inputCls}`}
                />
              </div>
              <button type="submit" className="btn-gradient px-5 py-3 text-sm">
                {t('Search')}
              </button>
            </form>
          </div>
        </div>
        )}

        {/* Mobile menu */}
        {isOpen && (
          <div className={`lg:hidden shadow-lg animate-fade-in-up ${mobileMenuBg}`}>
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              <form onSubmit={handleSearchSubmit} className={`flex items-center gap-2 pb-3 border-b ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
                <div className="relative flex-1">
                  <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('Search_Placeholder')}
                    className={`w-full rounded-[10px] border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${inputCls}`}
                  />
                </div>
                <button type="submit" className="btn-gradient px-4 py-2.5 text-sm">
                  {t('Search')}
                </button>
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-[10px] text-sm font-medium transition-colors ${
                    isActive(link.path) ? linkActive : linkDefault
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className={`pt-4 border-t space-y-2 ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
                <Link
                  to="/products"
                  className={`block text-center text-sm font-semibold py-3 rounded-[10px] transition-colors ${
                    isDark ? 'bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  {t('Explore_Products')}
                </Link>
                <Link to="/contact" className="btn-gradient block text-center text-sm py-3">
                  {t('Request_Quotation')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
