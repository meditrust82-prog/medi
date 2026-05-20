import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaThLarge, FaShoppingCart, FaWhatsapp, FaHeart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWishlist } from '../contexts/WishlistContext';

const MobileTabBar = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { isDark } = useTheme();
  const { wishlist } = useWishlist();

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  const tabs = [
    { icon: FaHome, label: 'Home', path: '/home' },
    { icon: FaThLarge, label: 'Products', path: '/products' },
    { icon: FaHeart, label: 'Wishlist', path: '/wishlist', badge: wishlist.length },
    { icon: FaShoppingCart, label: 'Quote', path: '/cart', badge: cartCount },
  ];

  return (
    <div className={`lg:hidden fixed bottom-0 inset-x-0 z-50 border-t shadow-[0_-2px_12px_rgba(0,0,0,0.12)] transition-colors duration-300 ${
      isDark ? 'bg-dark-surface border-dark-border' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors relative ${
                active
                  ? isDark ? 'text-brand-cyan' : 'text-primary-600'
                  : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className="text-xl" />
                {tab.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium`}>{tab.label}</span>
              {active && (
                <span className={`absolute top-0 inset-x-4 h-0.5 rounded-b-full ${isDark ? 'bg-brand-cyan' : 'bg-primary-600'}`} />
              )}
            </Link>
          );
        })}

        {/* WhatsApp — green CTA */}
        <a
          href="https://wa.me/9779818100515"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 bg-green-500 hover:bg-green-600 transition-colors text-white"
        >
          <FaWhatsapp className="text-xl" />
          <span className="text-[11px] font-semibold">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default MobileTabBar;
