import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, toggle } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <>
      <SeoHead title="My Wishlist — Meditrust Nepal" noindex={true} />

      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="inline-flex items-center text-primary-200 hover:text-white mb-4 text-sm font-medium transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaHeart className="text-red-400" /> My Wishlist
            {wishlist.length > 0 && <span className="text-lg font-normal text-primary-200">({wishlist.length} item{wishlist.length !== 1 ? 's' : ''})</span>}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 bg-[var(--bg-secondary)] min-h-[60vh]">
        {wishlist.length === 0 ? (
          <div className="text-center py-24">
            <FaHeart className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-400 dark:text-gray-500 mb-8">Save products you're interested in and come back to them later.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div key={item.slug} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                  <Link to={`/products/${item.slug}`} className="block">
                    {item.image ? (
                      <div className="h-44 overflow-hidden bg-gray-50 dark:bg-dark-card">
                        <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2" />
                      </div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                        <FaHeart className="text-4xl text-primary-200" />
                      </div>
                    )}
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    {item.category && <p className="text-xs text-primary-600 font-medium mb-1">{item.category}</p>}
                    <Link to={`/products/${item.slug}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-brand-cyan transition line-clamp-2 flex-1">{item.name}</Link>
                    {item.price ? (
                      <p className="text-primary-700 font-bold mt-2">NPR {item.price.toLocaleString()}</p>
                    ) : (
                      <p className="text-gray-400 text-sm mt-2">Price on request</p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                      >
                        <FaShoppingCart className="text-xs" /> Add to Cart
                      </button>
                      <button
                        onClick={() => toggle(item)}
                        className="p-2 border border-gray-200 dark:border-dark-border rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition"
                        title="Remove from wishlist"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href={`https://wa.me/9779818100515?text=${encodeURIComponent('Hello, I would like to request a quotation for the following items:\n\n' + wishlist.map((p, i) => `${i + 1}. ${p.name}`).join('\n'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-md text-lg"
              >
                Request Quote for All {wishlist.length} Items via WhatsApp
              </a>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Wishlist;
