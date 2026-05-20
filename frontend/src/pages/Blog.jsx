import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SeoHead, { buildBreadcrumbSchema } from '../components/SeoHead';
import { FaCalendarAlt, FaArrowRight, FaUser } from 'react-icons/fa';
import api from '../api';

const defaultPosts = [
  { _id: '1', slug: 'icu-ventilator-price-nepal-2025', title: 'ICU Ventilator Price in Nepal 2025 — Complete Buying Guide', excerpt: 'Compare ICU ventilator prices in Nepal. Learn what affects cost, which brands are CE certified, and how to request a quote from Meditrust Nepal.', image: null, author: 'Meditrust Nepal', createdAt: '2025-01-10', category: 'ICU Equipment' },
  { _id: '2', slug: 'patient-monitor-buying-guide-nepal', title: 'Patient Monitor Buying Guide for Hospitals in Nepal', excerpt: 'How to choose the right patient monitor for your hospital in Nepal. Compare bedside vs transport monitors, parameters, brands and prices.', image: null, author: 'Meditrust Nepal', createdAt: '2025-02-05', category: 'Monitoring Equipment' },
  { _id: '3', slug: 'how-to-set-up-icu-nepal', title: 'How to Set Up an ICU in Nepal — Complete Equipment Checklist', excerpt: 'Planning to set up an ICU in Nepal? This complete checklist covers every essential piece of medical equipment, staffing ratios, and procurement tips.', image: null, author: 'Meditrust Nepal', createdAt: '2025-02-20', category: 'Hospital Setup' },
  { _id: '4', slug: 'surgical-instruments-nepal', title: 'Surgical Instruments in Nepal — CE Certified Sources & Prices', excerpt: 'Where to buy CE certified surgical instruments in Nepal. Compare prices for laparoscopic sets, basic surgical trays, orthopedic instruments and more.', image: null, author: 'Meditrust Nepal', createdAt: '2025-03-01', category: 'Surgical Equipment' },
  { _id: '5', slug: 'medical-equipment-maintenance-nepal', title: 'Medical Equipment Maintenance in Nepal — AMC, PMC & Best Practices', excerpt: 'How to maintain medical equipment in Nepali hospitals. Learn about Annual Maintenance Contracts (AMC), Preventive Maintenance, and common equipment failures.', image: null, author: 'Meditrust Nepal', createdAt: '2025-03-15', category: 'Maintenance' },
];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/blogs');
        const data = res.data.blogs || res.data || [];
        setPosts(data.length > 0 ? data : defaultPosts);
      } catch (err) {
        setPosts(defaultPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <SeoHead
        title="Blog — Medical Equipment Insights & Healthcare Technology Nepal"
        description="Read expert articles from Meditrust Nepal on medical equipment selection, hospital setup, ICU planning, equipment maintenance, and the latest healthcare technology trends in Nepal."
        keywords="medical equipment blog Nepal, healthcare technology Nepal, hospital setup guide Nepal, medical device insights, ICU equipment guide Nepal"
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Meditrust Nepal Blog',
            description: 'Expert insights on medical equipment, hospital setup, and healthcare technology in Nepal.',
            url: 'https://meditrustnepal.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Meditrust Nepal',
              logo: { '@type': 'ImageObject', url: 'https://meditrustnepal.com/logo.png' },
            },
          },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-primary-300 font-semibold text-sm uppercase tracking-wider">Our Blog</span>
          <h1 className="text-4xl font-bold text-white mt-3 mb-4">Insights & Articles</h1>
          <p className="text-primary-100 max-w-2xl">Stay updated with the latest news, tips, and insights about medical equipment and healthcare technology.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post._id || post.id}
                  to={`/blog/${post.slug || post._id || post.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm card-hover group border border-gray-100"
                >
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                        <svg className="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 space-x-4 mb-3">
                      {post.category && (
                        <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded font-medium">{post.category}</span>
                      )}
                      <span className="flex items-center"><FaCalendarAlt className="mr-1" />{formatDate(post.createdAt)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center text-xs text-gray-400"><FaUser className="mr-1" />{post.author}</span>
                      <span className="text-primary-600 text-sm font-medium flex items-center">
                        Read More <FaArrowRight className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
