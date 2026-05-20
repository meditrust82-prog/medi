import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FaHome, FaBox, FaProjectDiagram, FaComments, FaEnvelope, FaBlog, FaTags,
  FaSignOutAlt, FaBars, FaTimes, FaPlus, FaEdit, FaTrash, FaEye,
  FaCheck, FaFolder, FaUpload, FaTrashAlt, FaChevronRight,
  FaChevronDown, FaSearch, FaStar, FaArrowUp, FaArrowDown,
  FaCog, FaKey, FaLock, FaWhatsapp, FaTelegram, FaSms, FaShippingFast,
  FaEyeSlash, FaUserShield, FaCheckCircle, FaTimesCircle, FaFileAlt, FaBell, FaImages
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api';
import Logo from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner, { PageLoader, SkeletonTable } from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import RichTextEditor from '../../components/ui/RichTextEditor';

// ==================== SHARED UNSAVED GUARD ====================
const useUnsavedGuard = (isDirty) => {
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
};

// ==================== SIDEBAR ====================
const CMS_PAGES = [
  { name: 'Homepage', path: '/admin/homepage', icon: FaHome },
  { name: 'Services Page', path: '/admin/services-page', icon: FaCog },
  { name: 'About Page', path: '/admin/about-page', icon: FaFileAlt },
  { name: 'Legal Pages', path: '/admin/legal-pages', icon: FaKey },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const pagesActive = CMS_PAGES.some(p => location.pathname === p.path);
  const [pagesOpen, setPagesOpen] = useState(pagesActive);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
    { name: 'Products', path: '/admin/products', icon: FaBox },
    { name: 'Categories', path: '/admin/categories', icon: FaTags },
    { name: 'Orders', path: '/admin/orders', icon: FaEnvelope },
    { name: 'Reviews', path: '/admin/reviews', icon: FaComments },
    { name: 'Google Business', path: '/admin/google-business', icon: FaStar },
    { name: 'Banners', path: '/admin/banners', icon: FaTags },
    { name: 'Quotes', path: '/admin/quotes', icon: FaEnvelope },
    { name: 'Gallery', path: '/admin/gallery', icon: FaImages },
    { name: 'Blog', path: '/admin/blog', icon: FaBlog },
    { name: 'Subscribers', path: '/admin/subscribers', icon: FaBell },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
  ];

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 border-b border-gray-800">
          <Link to="/admin/dashboard" className="flex items-center justify-center bg-white rounded-xl p-2">
            <Logo size="sm" linkTo={null} />
          </Link>
          <p className="text-center text-xs text-gray-500 mt-2">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="mr-3" />
              {item.name}
            </Link>
          ))}

          {/* Pages CMS group */}
          <button
            onClick={() => setPagesOpen(o => !o)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-1 ${
              pagesActive ? 'bg-primary-900 text-primary-300' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="flex items-center"><FaFileAlt className="mr-3" />Pages CMS</span>
            {pagesOpen ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
          </button>
          {pagesOpen && (
            <div className="ml-4 border-l border-gray-700 pl-2 space-y-0.5">
              {CMS_PAGES.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-600 text-white font-medium'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-2 text-xs" />
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          {user && (
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
              <StatusBadge status={user.role || 'admin'} className="mt-1" />
            </div>
          )}
          <Link to="/" className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors mb-1">
            <FaEye className="mr-3" /> View Website
          </Link>
          <button onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors w-full">
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

// ==================== SETTINGS HELPERS ====================
const SecretInput = ({ label, name, value, onChange, placeholder, hint, configured }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
        {label}
        {configured !== undefined && (
          configured
            ? <FaCheckCircle className="text-green-500 text-xs" title="Configured" />
            : <FaTimesCircle className="text-gray-300 text-xs" title="Not set" />
        )}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || 'Leave blank to keep existing value'}
          className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
        />
        <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
        </button>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
};

const PlainInput = ({ label, name, value, onChange, placeholder, hint, configured }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
      {label}
      {configured !== undefined && (
        configured
          ? <FaCheckCircle className="text-green-500 text-xs" title="Configured" />
          : <FaTimesCircle className="text-gray-300 text-xs" title="Not set" />
      )}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || ''}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
    />
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);


// ==================== STAT CARD ====================
const StatCard = ({ label, value, icon: Icon, color, link, loading: isLoading, trend }) => (
  <Link to={link} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="text-white text-xl" />
      </div>
      {trend && (
        <div className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? <FaArrowUp className="mr-0.5" /> : <FaArrowDown className="mr-0.5" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <h3 className="text-3xl font-bold text-gray-900">
      {isLoading ? <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" /> : value}
    </h3>
    <p className="text-gray-500 text-sm mt-1">{label}</p>
  </Link>
);

// ==================== DASHBOARD OVERVIEW ====================
const Overview = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, inquiries: 0, testimonials: 0 });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, quotesRes, analyticsRes] = await Promise.allSettled([
          api.get('/products', { params: { limit: 1 } }),
          api.get('/orders'),
          api.get('/quotes/stats'),
          api.get('/analytics/dashboard'),
        ]);
        const productTotal = productsRes.status === 'fulfilled'
          ? (productsRes.value.data.total || productsRes.value.data.pagination?.total || 0)
          : 0;
        const orderList = ordersRes.status === 'fulfilled'
          ? (ordersRes.value.data.orders || ordersRes.value.data || [])
          : [];
        const quoteStats = quotesRes.status === 'fulfilled' ? quotesRes.value.data : {};
        setStats({
          products: productTotal,
          orders: orderList.length,
          newQuotes: quoteStats.new || 0,
          convertedQuotes: quoteStats.converted || 0,
        });
        setRecentInquiries(orderList.slice(0, 5));
        if (analyticsRes.status === 'fulfilled') {
          setAnalytics(analyticsRes.value.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Products', value: stats.products, icon: FaBox, color: 'bg-blue-500', link: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: FaEnvelope, color: 'bg-emerald-500', link: '/admin/orders' },
    { label: 'New Quotes', value: stats.newQuotes, icon: FaShippingFast, color: 'bg-amber-500', link: '/admin/quotes' },
    { label: 'Converted', value: stats.convertedQuotes, icon: FaCheckCircle, color: 'bg-purple-500', link: '/admin/quotes' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      {/* Profit Analytics */}
      {analytics && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Profit Analytics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase">Total Revenue</p>
              <p className="text-xl font-bold text-emerald-700">NPR {analytics.summary?.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase">Total Cost</p>
              <p className="text-xl font-bold text-red-600">NPR {analytics.summary?.totalCost?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase">Net Profit</p>
              <p className="text-xl font-bold text-blue-600">NPR {analytics.summary?.totalProfit?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase">Profit Margin</p>
              <p className="text-xl font-bold text-purple-600">{analytics.summary?.profitMargin || 0}%</p>
            </div>
          </div>
          
          {analytics.topProducts?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Products by Profit</h3>
              <div className="bg-white rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Sold</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Revenue</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {analytics.topProducts.slice(0, 5).map((p, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 font-medium text-gray-900 truncate max-w-[200px]">{p.name}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{p.sold}</td>
                        <td className="px-4 py-2 text-right text-gray-600">NPR {p.revenue?.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-semibold text-emerald-600">NPR {p.profit?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All &rarr;
          </Link>
        </div>
        {loading ? (
          <SkeletonTable rows={3} cols={4} />
        ) : recentInquiries.length === 0 ? (
          <EmptyState icon={FaEnvelope} title="No orders yet" description="Customer orders will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentInquiries.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.shippingAddress?.name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{(order.items || []).length} item(s)</td>
                    <td className="px-6 py-4"><StatusBadge status={order.status || 'pending'} /></td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== CATEGORIES SECTION ====================
const CategoriesSection = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [newCat, setNewCat] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', { params: { limit: 200 } });
      setAllProducts(res.data.products || []);
    } catch { setAllProducts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Build category → products map
  const categoryMap = {};
  allProducts.forEach(p => {
    const cat = p.category || 'Uncategorized';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(p);
  });
  const categories = Object.entries(categoryMap).map(([name, products]) => ({ name, products }));

  const toggleExpand = (name) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const handleRename = async (oldName) => {
    const trimmed = editingName.trim();
    if (!trimmed || trimmed === oldName) { setEditingId(null); return; }
    setSaving(true);
    try {
      const prods = categoryMap[oldName] || [];
      await Promise.all(prods.map(p => {
        const fd = new FormData();
        fd.append('category', trimmed);
        return api.put(`/products/${p.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }));
      toast.success(`Renamed "${oldName}" → "${trimmed}" on ${prods.length} product(s)`);
      setEditingId(null);
      fetchAll();
    } catch { toast.error('Rename failed'); }
    finally { setSaving(false); }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted');
      fetchAll();
    } catch { toast.error('Failed to delete product'); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (categoryMap[trimmed]) { toast.error('Category already exists'); return; }
    setSaving(true);
    try {
      const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const fd = new FormData();
      fd.append('name', `${trimmed} — Placeholder`);
      fd.append('category', trimmed);
      fd.append('slug', `placeholder-${slug}-${Date.now()}`);
      fd.append('price', '0');
      fd.append('stock', '0');
      await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(`Category "${trimmed}" created.`);
      setNewCat('');
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories · {allProducts.length} products total</p>
        </div>
      </div>

      {/* Add category */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <input
            type="text"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            placeholder="New category name…"
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
          <button type="submit" disabled={saving || !newCat.trim()} className="btn-primary text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
            <FaPlus className="mr-2" /> Add Category
          </button>
        </form>
      </div>

      {/* Category tree */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <SkeletonTable rows={5} cols={3} />
        ) : categories.length === 0 ? (
          <EmptyState icon={FaFolder} title="No categories yet" description="Add a product to create a category." />
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map(cat => (
              <React.Fragment key={cat.name}>
                {/* Category row */}
                <div className="flex items-center py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleExpand(cat.name)}>
                  <button className="mr-2 text-gray-400 hover:text-gray-600 w-5 flex-shrink-0">
                    {expandedNodes.has(cat.name) ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
                  </button>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaFolder className="text-primary-500 text-sm" />
                    </div>
                    <div>
                      {editingId === cat.name ? (
                        <input
                          autoFocus
                          type="text"
                          value={editingName}
                          onClick={e => e.stopPropagation()}
                          onChange={e => setEditingName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleRename(cat.name); if (e.key === 'Escape') setEditingId(null); }}
                          className="px-3 py-1 rounded-lg border border-primary-400 focus:ring-2 focus:ring-primary-500 outline-none text-sm w-48"
                        />
                      ) : (
                        <span className="font-semibold text-gray-900">{cat.name}</span>
                      )}
                      <p className="text-xs text-gray-500">{cat.products.length} product{cat.products.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2" onClick={e => e.stopPropagation()}>
                    {editingId === cat.name ? (
                      <>
                        <button onClick={() => handleRename(cat.name)} disabled={saving} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Save"><FaCheck className="text-xs" /></button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" title="Cancel"><FaTimes className="text-xs" /></button>
                      </>
                    ) : (
                      <button onClick={() => { setEditingId(cat.name); setEditingName(cat.name); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Rename category"><FaEdit className="text-xs" /></button>
                    )}
                    <button onClick={() => navigate(`/admin/products?category=${encodeURIComponent(cat.name)}`)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Manage products"><FaBox className="text-xs" /></button>
                  </div>
                </div>

                {/* Products under category */}
                {expandedNodes.has(cat.name) && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {cat.products.map(product => (
                      <div key={product.id} className="flex items-center py-2.5 px-4 hover:bg-gray-100 transition-colors" style={{ paddingLeft: '52px' }}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-9 h-9 object-cover rounded-lg flex-shrink-0 border border-gray-200" />
                          ) : (
                            <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FaBox className="text-gray-400 text-xs" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.price ? `Rs. ${Number(product.price).toLocaleString()}` : 'No price'} · Stock: {product.stock ?? product.quantity ?? 0}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <button onClick={() => navigate(`/admin/products`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit product"><FaEdit className="text-xs" /></button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete product"><FaTrash className="text-xs" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== SETTINGS SECTION ====================
const SettingsSection = () => {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', username: user?.username || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await api.put('/auth/profile', { name: profileForm.name, username: profileForm.username, email: profileForm.email }, { silent: true });
      if (setUser) setUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally { setProfileSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match'); return;
    }
    if (passForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters'); return;
    }
    setPassSaving(true);
    try {
      await api.put('/auth/profile', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword }, { silent: true });
      toast.success('Password changed successfully');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally { setPassSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your admin account credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <FaUserShield className="text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Profile</h2>
              <p className="text-xs text-gray-500">Update your name and email</p>
            </div>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username (for login)</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                required
              />
            </div>
            <button type="submit" disabled={profileSaving} className="w-full btn-primary text-sm disabled:opacity-50">
              {profileSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <FaLock className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-500">Min. 8 characters</p>
            </div>
          </div>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={passForm.currentPassword}
                  onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  required
                />
                <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={passForm.newPassword}
                  onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  required
                />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={passForm.confirmPassword}
                  onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={passSaving} className="w-full btn-primary text-sm disabled:opacity-50">
              {passSaving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      {/* WhatsApp Reply Templates */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <FaWhatsapp className="text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">WhatsApp Reply Templates</h2>
            <p className="text-xs text-gray-500">Copy and paste into WhatsApp when replying to quote requests</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Initial Quote Response', body: `Dear [Name],\n\nThank you for your inquiry about *[Product]*.\n\nPrice: NPR [Amount]\nIncludes: Delivery to [City] + Installation + 1-year warranty\n\nPlease confirm your hospital name and billing address to proceed.\n\nBest regards,\nMeditrust Nepal\n+977-9818100515` },
            { label: 'Follow-up (no response)', body: `Hello [Name],\n\nFollowing up on your inquiry about *[Product]* from [Date].\n\nWe still have stock available. Let me know if you have any questions or need a revised quote.\n\nMeditrust Nepal\n+977-9818100515` },
            { label: 'Order Confirmation', body: `Dear [Name],\n\n✅ Your order for *[Product]* has been confirmed.\n\nDelivery: [Date]\nInstallation: [Date]\n\nOur technician will contact you 1 day before delivery.\n\nThank you for choosing Meditrust Nepal!` },
            { label: 'Out of Stock', body: `Hello [Name],\n\nThank you for your interest in *[Product]*.\n\nUnfortunately this item is currently out of stock. Expected restock: [Date].\n\nWould you like us to notify you when it's available, or suggest a similar alternative?\n\nMeditrust Nepal` },
            { label: 'Service/Maintenance', body: `Dear [Name],\n\nThank you for contacting Meditrust Nepal service support.\n\nA technician has been assigned to your case. Expected visit: [Date].\n\nFor urgent issues, call: +977-9818100515\n\nMeditrust Nepal After-Sales Team` },
            { label: 'Bulk/Institutional Pricing', body: `Dear [Name],\n\nThank you for your bulk inquiry.\n\nFor orders of [Quantity]+ units of *[Product]*, we offer:\n- Unit price: NPR [Amount]\n- Includes: Delivery + Installation + Training + 1yr warranty\n- Payment terms: 50% advance, 50% on delivery\n\nPlease share your PO or formal requirement letter to proceed.\n\nMeditrust Nepal` },
          ].map(({ label, body }) => (
            <div key={label} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(body); toast.success('Copied!'); }}
                  className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-100 transition font-medium"
                >
                  📋 Copy
                </button>
              </div>
              <pre className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed font-sans bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">{body}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* CSV Tools */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FaUpload className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Data Export / Import</h2>
            <p className="text-xs text-gray-500">Download or upload product and quote data as CSV</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href={`${import.meta.env.VITE_API_URL || '/api/v1'}/products/export.csv`}
            className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
          >
            ⬇️ Export Products CSV
          </a>
          <a
            href={`${import.meta.env.VITE_API_URL || '/api/v1'}/products/quotes-export.csv`}
            className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
          >
            ⬇️ Export Quotes CSV
          </a>
          <label className="flex items-center justify-center gap-2 border border-primary-200 text-primary-700 bg-primary-50 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-primary-100 transition cursor-pointer">
            <FaUpload className="text-sm" /> Import Products CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append('csv', file);
                try {
                  const res = await api.post('/products/import-csv', fd);
                  toast.success(`Imported: ${res.data.created} created, ${res.data.updated} updated${res.data.errors?.length ? `, ${res.data.errors.length} errors` : ''}`);
                } catch (err) {
                  toast.error(err.response?.data?.error || 'Import failed');
                }
                e.target.value = '';
              }}
            />
          </label>
        </div>
        <p className="text-xs text-gray-400 mt-3">CSV columns: name, slug, category, brand, price, originalPrice, stock, description, metaTitle, metaDescription, metaKeywords, featured, badges (pipe-separated)</p>
      </div>
    </div>
  );
};

// ==================== PRODUCTS SECTION ====================
const ProductsSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const BADGE_OPTIONS = ['CE & ISO Certified', 'Warranty Included', 'Free Consultation', 'Nepal-wide Delivery'];
  const [form, setForm] = useState({ name: '', categoryId: '', description: '', specifications: '', price: '', originalPrice: '', discountPct: '', cost: '', quantity: '', featured: false, slug: '', metaTitle: '', metaDescription: '', metaKeywords: '', badges: [] });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const fetchCategories = useCallback(async () => {
    try {
      let page = 1;
      const seen = new Set();
      const cats = [];
      while (true) {
        const res = await api.get('/products', { params: { limit: 100, page } });
        const prods = res.data.products || [];
        prods.forEach(p => {
          if (p.category && !seen.has(p.category)) {
            seen.add(p.category);
            cats.push({ id: p.category, name: p.category });
          }
        });
        if (prods.length < 100) break;
        page++;
      }
      setCategories(cats);
    } catch (err) { console.error(err); }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      const res = await api.get('/products', { params });
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, categoryFilter]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const emptyForm = { name: '', category: '', description: '', specifications: '', price: '', originalPrice: '', discountPct: '', cost: '', stock: '', featured: false, slug: '', metaTitle: '', metaDescription: '', metaKeywords: '', badges: [] };

  const openDuplicate = (product) => {
    setEditItem(null);
    setForm({
      name: `${product.name} (Copy)`,
      category: product.category || '',
      description: product.description || '',
      specifications: product.specifications || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      discountPct: product.originalPrice && product.price ? Math.round((1 - product.price / product.originalPrice) * 100).toString() : '',
      cost: product.cost?.toString() || '',
      stock: (product.stock ?? product.quantity ?? '')?.toString(),
      featured: false,
      slug: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      badges: product.badges || [],
    });
    setUploadedImages([]);
    setShowForm(true);
  };

  const [aiFilling, setAiFilling] = useState(false);
  const handleAiFill = async () => {
    if (!form.name.trim()) { toast.error('Enter a product name first'); return; }
    setAiFilling(true);
    try {
      const prompt = `You are an SEO expert for a medical equipment supplier in Nepal called Meditrust Nepal.
Given this product: "${form.name}"${form.category ? ` (Category: ${form.category})` : ''}.
Generate the following in JSON format only, no markdown:
{
  "slug": "seo-friendly-url-slug-nepal",
  "metaTitle": "Product Name — Buy in Nepal | Meditrust Nepal",
  "metaDescription": "150-160 char description for Google",
  "metaKeywords": "product name Nepal, buy product Kathmandu, product category Nepal, brand Nepal, medical equipment Nepal",
  "description": "2-3 sentence product description mentioning Nepal, CE/ISO certified"
}`;
      const res = await api.post('/ai/chat', { messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 400 });
      const data = res.data;
      if (!data.choices) throw new Error('AI service error');
      const text = data.choices?.[0]?.message?.content || '';
      const clean = text.replace(/```json\n?|```\n?/g, '').trim();
      const json = JSON.parse(clean);
      setForm(prev => ({
        ...prev,
        slug: json.slug || prev.slug,
        metaTitle: json.metaTitle || prev.metaTitle,
        metaDescription: json.metaDescription || prev.metaDescription,
        metaKeywords: json.metaKeywords || prev.metaKeywords,
        description: prev.description || json.description || '',
      }));
      toast.success('AI fields filled!');
    } catch (err) {
      console.error('AI fill error:', err);
      toast.error(`AI fill failed: ${err.message}`);
    } finally {
      setAiFilling(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('specifications', form.specifications);
      formData.append('price', form.price);
      if (form.originalPrice) formData.append('originalPrice', form.originalPrice);
      if (form.cost) formData.append('cost', form.cost);
      formData.append('stock', form.stock);
      formData.append('featured', form.featured);
      formData.append('slug', form.slug);
      formData.append('metaTitle', form.metaTitle);
      formData.append('metaDescription', form.metaDescription);
      formData.append('metaKeywords', form.metaKeywords);
      form.badges.forEach(b => formData.append('badges', b));
      uploadedImages.forEach(img => formData.append('images', img));

      if (editItem) {
        await api.put(`/products/${editItem.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      setShowForm(false);
      setEditItem(null);
      setForm(emptyForm);
      setUploadedImages([]);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Operation failed';
      toast.error(msg, { autoClose: 6000 });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} product(s)?`)) return;
    const results = await Promise.allSettled([...selectedIds].map(id => api.delete(`/products/${id}`)));
    const failed = results.filter(r => r.status === 'rejected').length;
    const succeeded = results.length - failed;
    if (succeeded > 0) { toast.success(`${succeeded} product(s) deleted`); fetchProducts(); setSelectedIds(new Set()); }
    if (failed > 0) toast.error(`${failed} product(s) could not be deleted`);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map(p => p.id)));
    }
  };

  const openEdit = (product) => {
    setEditItem(product);
    setForm({
      name: product.name || '',
      category: product.category || '',
      description: product.description || '',
      specifications: product.specifications || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      discountPct: product.originalPrice && product.price ? Math.round((1 - product.price / product.originalPrice) * 100).toString() : '',
      cost: product.cost?.toString() || '',
      stock: (product.stock ?? product.quantity ?? '')?.toString(),
      featured: product.featured || false,
      slug: product.slug || '',
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      metaKeywords: product.metaKeywords || '',
      badges: product.badges || [],
    });
    setUploadedImages([]);
    setExistingImages(product.images || []);
    setActiveTab('basic');
    setShowForm(true);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">{total} total products</p>
            {categoryFilter && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                <FaTags className="text-[10px]" /> {categoryFilter}
                <button onClick={() => { setCategoryFilter(''); setPage(1); }} className="ml-1 hover:text-primary-900" title="Clear filter"><FaTimes className="text-[10px]" /></button>
              </span>
            )}
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setForm(emptyForm); setUploadedImages([]); setShowForm(true); }} className="btn-primary text-sm flex items-center">
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          {selectedIds.size > 0 && (
            <button onClick={handleBulkDelete} className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center">
              <FaTrash className="mr-2" /> Delete ({selectedIds.size})
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : products.length === 0 ? (
          <EmptyState icon={FaBox} title="No products found" description={search ? 'Try adjusting your search.' : 'Add your first product!'} action={!search ? () => setShowForm(true) : undefined} actionLabel="Add Product" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-4 w-10">
                      <input type="checkbox" checked={selectedIds.size === products.length && products.length > 0} onChange={toggleSelectAll} className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Qty</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Featured</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.has(product.id) ? 'bg-primary-50' : ''}`}>
                      <td className="px-4 py-4">
                        <input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => toggleSelect(product.id)} className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {product.images?.[0] ? (
                            <img src={product.images[0].path} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FaBox className="text-gray-300" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">{product.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{product.categoryName || product.category || '-'}</td>
                      <td className="px-6 py-4">
                        {product.price ? (
                          <div>
                            <span className="text-sm font-semibold text-gray-900">Rs. {Number(product.price).toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-gray-400 line-through">Rs. {Number(product.originalPrice).toLocaleString()}</span>
                                <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>
                              </div>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {(product.stock ?? product.quantity ?? 0) > 0 ? (
                          <span className="text-sm font-medium text-green-600">{product.stock ?? product.quantity}</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Out of Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.featured ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <FaStar className="mr-1" /> Yes
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <FaEdit />
                          </button>
                          <button onClick={() => openDuplicate(product)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Duplicate">
                            <FaFolder />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">Previous</button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Form Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); setUploadedImages([]); setExistingImages([]); setForm(emptyForm); setActiveTab('basic'); }} title={editItem ? 'Edit Product' : 'Add New Product'} size="lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[['basic','Basic Info'],['pricing','Pricing'],['images','Images'],['seo','SEO']].map(([key,label]) => (
              <button key={key} type="button" onClick={() => setActiveTab(key)}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === key ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>{label}</button>
            ))}
          </div>
          {/* Basic Info Tab */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{display: activeTab === 'basic' ? '' : 'none'}}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => { const name = e.target.value; const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); setForm(prev => ({ ...prev, name, slug: prev.slug && prev.slug !== prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ? prev.slug : autoSlug })); }} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                list="category-options"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Select existing or type new category"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
              <datalist id="category-options">
                {categories.map(cat => <option key={cat.id} value={cat.name} />)}
              </datalist>
              <p className="text-xs text-gray-400 mt-1">Pick an existing category or type a new one to create it.</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pricing (set on Pricing tab)</label>
              {!form.price && <p className="text-xs text-amber-600">Go to the Pricing tab to set selling price.</p>}
              {form.price && <p className="text-sm font-semibold text-primary-700">NPR {Number(form.price).toLocaleString()}{form.originalPrice && Number(form.originalPrice) > Number(form.price) ? ` · ${Math.round((1-Number(form.price)/Number(form.originalPrice))*100)}% OFF MRP` : ''}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <RichTextEditor
                value={form.description}
                onChange={(html) => setForm(prev => ({ ...prev, description: html }))}
                placeholder="Write a product description — supports bold, italic, bullet points, numbered lists, hyperlinks..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
              <RichTextEditor
                value={form.specifications}
                onChange={(html) => setForm(prev => ({ ...prev, specifications: html }))}
                placeholder="Key specifications, features, dimensions — supports bullet points, bold, links..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Trust Badges</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {BADGE_OPTIONS.map(badge => (
                  <label key={badge} className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-colors ${form.badges.includes(badge) ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      checked={form.badges.includes(badge)}
                      onChange={(e) => setForm(prev => ({ ...prev, badges: e.target.checked ? [...prev.badges, badge] : prev.badges.filter(b => b !== badge) }))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{badge}</span>
                  </label>
                ))}
                {form.badges.filter(b => !BADGE_OPTIONS.includes(b)).map(custom => (
                  <div key={custom} className="flex items-center gap-2 p-2 rounded-lg border border-blue-200 bg-blue-50">
                    <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                    <span className="text-sm text-gray-700 flex-1">{custom}</span>
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, badges: prev.badges.filter(b => b !== custom) }))} className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom badge..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !form.badges.includes(val)) setForm(prev => ({ ...prev, badges: [...prev.badges, val] }));
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    const val = input.value.trim();
                    if (val && !form.badges.includes(val)) setForm(prev => ({ ...prev, badges: [...prev.badges, val] }));
                    input.value = '';
                  }}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
                >+ Add</button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Press Enter or click Add to add a custom badge</p>
            </div>
          </div>

          {/* Pricing Tab */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{display: activeTab === 'pricing' ? '' : 'none'}}>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {/* MRP */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">MRP / Original (NPR)</label>
                    <input
                      type="number" min="0" step="1" placeholder="e.g. 5000"
                      value={form.originalPrice}
                      onChange={(e) => {
                        const orig = e.target.value;
                        setForm(prev => {
                          const pct = Number(prev.discountPct);
                          const price = orig && pct > 0 ? Math.round(Number(orig) * (1 - pct / 100)).toString() : prev.price;
                          return { ...prev, originalPrice: orig, price };
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white"
                    />
                  </div>
                  {/* Discount % */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Discount %</label>
                    <div className="relative">
                      <input
                        type="number" min="0" max="100" step="1" placeholder="e.g. 20"
                        value={form.discountPct}
                        onChange={(e) => {
                          const pct = e.target.value;
                          setForm(prev => {
                            const p = Number(pct);
                            // if MRP exists → update selling price
                            if (prev.originalPrice && pct !== '') {
                              const price = Math.round(Number(prev.originalPrice) * (1 - p / 100)).toString();
                              return { ...prev, discountPct: pct, price };
                            }
                            // if selling price exists → update MRP
                            if (prev.price && pct !== '' && p < 100) {
                              const originalPrice = Math.round(Number(prev.price) / (1 - p / 100)).toString();
                              return { ...prev, discountPct: pct, originalPrice };
                            }
                            return { ...prev, discountPct: pct };
                          });
                        }}
                        className="w-full px-3 py-2 pr-6 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white"
                      />
                      {form.discountPct && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>}
                    </div>
                  </div>
                  {/* Selling Price */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Selling Price (NPR) *</label>
                    <input
                      type="number" min="0" step="1"
                      value={form.price}
                      onChange={(e) => {
                        const price = e.target.value;
                        setForm(prev => {
                          // if MRP exists → update discount %
                          if (prev.originalPrice && price) {
                            const pct = Math.round((1 - Number(price) / Number(prev.originalPrice)) * 100).toString();
                            return { ...prev, price, discountPct: pct };
                          }
                          // if discount % exists → update MRP
                          if (prev.discountPct && price && Number(prev.discountPct) < 100) {
                            const originalPrice = Math.round(Number(price) / (1 - Number(prev.discountPct) / 100)).toString();
                            return { ...prev, price, originalPrice };
                          }
                          return { ...prev, price };
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-primary-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white font-semibold text-primary-700"
                    />
                  </div>
                </div>
                {/* Live preview */}
                {form.price && (
                  <div className="flex items-center gap-3 pt-1 border-t border-gray-200">
                    <span className="text-xs text-gray-400">Preview:</span>
                    <span className="font-bold text-primary-700 text-sm">NPR {Number(form.price).toLocaleString()}</span>
                    {form.originalPrice && Number(form.originalPrice) > Number(form.price) && (
                      <>
                        <span className="text-gray-400 line-through text-sm">NPR {Number(form.originalPrice).toLocaleString()}</span>
                        <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">{Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)}% OFF</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Price (NPR) <span className="text-xs font-normal text-gray-400">— for profit calculation</span>
              </label>
              <input 
                type="number" 
                min="0" 
                step="1"
                value={form.cost} 
                onChange={(e) => setForm({ ...form, cost: e.target.value })} 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" 
                placeholder="e.g. 3500"
              />
              {form.price && form.cost && (
                <p className="text-xs text-green-600 mt-1">
                  Profit per unit: NPR {Number(form.price - form.cost).toLocaleString()} 
                  ({((1 - form.cost/form.price) * 100).toFixed(1)}% margin)
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div style={{display: activeTab === 'images' ? '' : 'none'}}>
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Current images (on server)</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24">
                      <img src={img.url || img.path} alt={`Existing ${idx}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                      <span className="absolute -bottom-1 left-0 right-0 text-center text-[9px] text-gray-400">saved</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-600 mt-2">⚠ Uploading new images will replace all existing ones.</p>
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-3">Upload New Images (max 10)</label>
            <div className="flex flex-wrap gap-4">
              {uploadedImages.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 group">
                  <img src={URL.createObjectURL(file)} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                  <button type="button" onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaTrashAlt className="text-xs" />
                  </button>
                </div>
              ))}
              {uploadedImages.length < 10 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <FaUpload className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input type="file" accept="image/*" multiple onChange={(e) => setUploadedImages(prev => [...prev, ...Array.from(e.target.files)].slice(0, 10))} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF, WebP (max 5MB each)</p>
          </div>

          {/* SEO / AEO Settings */}
          <div style={{display: activeTab === 'seo' ? '' : 'none'}}>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded">SEO / AEO</span>
                <span className="text-xs text-gray-500">Improve search engine and AI answer visibility</span>
              </div>
              <button
                type="button"
                onClick={handleAiFill}
                disabled={aiFilling}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {aiFilling ? '⏳ Filling...' : '✨ Auto-fill with AI'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 border-r-0 px-3 py-3 rounded-l-lg whitespace-nowrap">/products/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') })}
                    placeholder="auto-generated-from-name"
                    className="flex-1 px-3 py-3 rounded-r-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm font-mono"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate from product name. Use only lowercase letters, numbers, and hyphens.</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  placeholder={form.name || 'Product name — Meditrust Nepal'}
                  maxLength={70}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">{form.metaTitle.length}/70 characters · Shown in browser tab and search results</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  placeholder="Brief description shown under the page title in search results (120–160 characters recommended)"
                  maxLength={160}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">{form.metaDescription.length}/160 characters · Used by Google & AI search engines</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  value={form.metaKeywords}
                  onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                  placeholder="keyword1, keyword2, product Nepal, brand Nepal"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">Comma-separated · Auto-filled by AI · Helps with search ranking</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={uploading} className="btn-primary flex-1 disabled:opacity-50">
              {uploading ? <><LoadingSpinner size="sm" className="inline mr-2" /> Saving...</> : editItem ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditItem(null); setUploadedImages([]); setExistingImages([]); setForm(emptyForm); setActiveTab('basic'); }} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==================== ORDERS SECTION ====================
const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const ORDER_STATUSES = ['awaiting_payment', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      const list = res.data.orders || res.data || [];
      setOrders(list);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={FaEnvelope} title="No orders yet" description="Orders placed by customers will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order._id || order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm">{order.shippingAddress?.name || '-'}</div>
                      <div className="text-xs text-gray-500">{order.shippingAddress?.city || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress?.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{(order.items || []).length} item(s)</td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={order.status}
                        onChange={e => handleStatusUpdate(order._id || order.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary-500 outline-none"
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== GENERIC CRUD SECTION (kept for future use) ====================
const CrudSection = ({ title, endpoint, fields, nameKey = 'name', filterField = null, filterOptions = [] }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeFilter && filterField ? { [filterField]: activeFilter } : {};
      const res = await api.get(`/${endpoint}`, { params });
      setItems(res.data[endpoint] || res.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, activeFilter, filterField]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await api.put(`/${endpoint}/${editItem.id}`, form);
        toast.success(`${title.slice(0, -1)} updated`);
      } else {
        await api.post(`/${endpoint}`, form);
        toast.success(`${title.slice(0, -1)} created`);
      }
      setShowForm(false);
      setEditItem(null);
      setForm({});
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/${endpoint}/${id}`);
      toast.success('Deleted');
      fetchItems();
    } catch { toast.error('Failed to delete'); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    const formData = {};
    fields.forEach(f => { formData[f.key] = item[f.key] || ''; });
    setForm(formData);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditItem(null);
    const formData = {};
    fields.forEach(f => { formData[f.key] = ''; });
    setForm(formData);
    setShowForm(true);
  };

  const filteredItems = search
    ? items.filter(item => fields.some(f => String(item[f.key] || '').toLowerCase().includes(search.toLowerCase())))
    : items;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} total</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm flex items-center">
          <FaPlus className="mr-2" /> Add New
        </button>
      </div>

      {(items.length > 5 || filterField) && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            {filterField && (
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">All statuses</option>
                {filterOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : filteredItems.length === 0 ? (
          <EmptyState title={search ? 'No matches found' : `No ${title.toLowerCase()} yet`} description={search ? 'Try a different search.' : `Click "Add New" to create one.`} action={!search ? openCreate : undefined} actionLabel="Add New" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase w-12">#</th>
                  {fields.map(f => (
                    <th key={f.key} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{f.label}</th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400">{idx + 1}</td>
                    {fields.map(f => (
                      <td key={f.key} className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        {f.key === 'status' || f.key === 'deliveryStatus' || f.key === 'delivery_status' ? (
                          <StatusBadge status={item[f.key]} />
                        ) : f.key === 'approved' ? (
                          item[f.key] ? <span className="text-green-600 font-medium flex items-center"><FaCheck className="mr-1" /> Approved</span> : <StatusBadge status="pending" />
                        ) : f.key === 'rating' ? (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar key={i} className={`text-sm ${i < (item[f.key] || 0) ? 'text-amber-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        ) : (
                          <span className="line-clamp-2">{String(item[f.key] || '-').substring(0, 100)}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }} title={`${editItem ? 'Edit' : 'Create'} ${title.slice(0, -1)}`}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label} {f.required && '*'}</label>
              {f.type === 'textarea' ? (
                <textarea rows="3" value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none" required={f.required} />
              ) : f.type === 'select' ? (
                <select value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                  {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" required={f.required} />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
              {submitting ? 'Saving...' : editItem ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==================== REVIEWS SECTION ====================
const emptyReviewForm = { name: '', position: '', organization: '', content: '', rating: 5, photoUrl: '', source: 'google', visible: true, order: 0 };

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyReviewForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials?all=1');
      setReviews(res.data.testimonials || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const openAdd = () => { setEditItem(null); setForm(emptyReviewForm); setShowForm(true); };
  const openEdit = (r) => { setEditItem(r); setForm({ name: r.name, position: r.position || '', organization: r.organization || '', content: r.content, rating: r.rating, photoUrl: r.photoUrl || '', source: r.source || 'google', visible: r.visible, order: r.order || 0 }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return toast.error('Name and review text are required');
    setSubmitting(true);
    try {
      if (editItem) {
        await api.put(`/testimonials/${editItem._id}`, form);
        toast.success('Review updated');
      } else {
        await api.post('/testimonials', form);
        toast.success('Review added');
      }
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to save review');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch { toast.error('Failed to delete'); }
  };

  const toggleVisible = async (r) => {
    try {
      await api.put(`/testimonials/${r._id}`, { ...r, visible: !r.visible });
      fetchReviews();
    } catch { toast.error('Failed to update'); }
  };

  const StarPicker = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <FaStar className={`text-xl transition-colors ${n <= value ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Manage testimonials shown in the Home page carousel</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors shadow">
          <FaPlus className="text-xs" /> Add Review
        </button>
      </div>

      {loading ? <SkeletonTable rows={4} cols={4} /> : reviews.length === 0 ? (
        <EmptyState icon={FaComments} title="No reviews yet" description="Add your first customer review." action={openAdd} actionLabel="Add Review" />
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r._id} className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-opacity ${r.visible ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              {/* Avatar */}
              <div className="flex-shrink-0">
                {r.photoUrl ? (
                  <img src={r.photoUrl} alt={r.name} className="w-11 h-11 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">{r.name[0]}</span>
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                  {r.position && <span className="text-xs text-gray-500">{r.position}{r.organization && `, ${r.organization}`}</span>}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${r.source === 'google' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{r.source}</span>
                </div>
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map(n => <FaStar key={n} className={`text-xs ${n <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`} />)}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">"{r.content}"</p>
              </div>
              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <button onClick={() => toggleVisible(r)} title={r.visible ? 'Hide' : 'Show'} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                  {r.visible ? <FaEye className="text-sm" /> : <FaEyeSlash className="text-sm" />}
                </button>
                <button onClick={() => openEdit(r)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <FaEdit className="text-sm" />
                </button>
                <button onClick={() => handleDelete(r._id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editItem ? 'Edit Review' : 'Add Review'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Name <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Ram Sharma" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position / Title</label>
              <input value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} placeholder="Chief of Surgery" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Hospital</label>
              <input value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} placeholder="Bir Hospital" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white">
                <option value="google">Google Review</option>
                <option value="direct">Direct / In-person</option>
                <option value="email">Email</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
            <StarPicker value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Text <span className="text-red-500">*</span></label>
            <textarea rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="What did the customer say?" maxLength={1000} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none text-sm" />
            <p className="text-xs text-gray-400 mt-1">{form.content.length}/1000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL (optional)</label>
            <input value={form.photoUrl} onChange={e => setForm(p => ({ ...p, photoUrl: e.target.value }))} placeholder="https://..." type="url" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} min={0} className="w-24 px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-5">
              <input type="checkbox" checked={form.visible} onChange={e => setForm(p => ({ ...p, visible: e.target.checked }))} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
              <span className="text-sm font-medium text-gray-700">Visible on site</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? 'Saving...' : editItem ? 'Update Review' : 'Add Review'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==================== GOOGLE BUSINESS PROFILE SECTION ====================
const GbpSection = () => {
  const [status, setStatus] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [posts, setPosts] = useState([]);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postForm, setPostForm] = useState({ summary: '', ctaType: '', ctaUrl: '', mediaUrl: '' });
  const [posting, setPosting] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');

  const loadStatus = async () => {
    try {
      const res = await api.get('/gbp/status');
      setStatus(res.data);
    } catch {}
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [revRes, postsRes, infoRes] = await Promise.allSettled([
        api.get('/gbp/reviews'),
        api.get('/gbp/posts'),
        api.get('/gbp/business-info'),
      ]);
      if (revRes.status === 'fulfilled') setReviews(revRes.value.data);
      if (postsRes.status === 'fulfilled') setPosts(postsRes.value.data.posts || []);
      if (infoRes.status === 'fulfilled') setBusinessInfo(infoRes.value.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadStatus();
    loadData();
  }, []);

  const handleConnect = async () => {
    try {
      const res = await api.get('/gbp/connect');
      window.location.href = res.data.url;
    } catch (err) {
      toast.error('Failed to start Google connection');
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Disconnect Google Business Profile?')) return;
    try {
      await api.delete('/gbp/disconnect');
      setStatus(s => ({ ...s, connected: false }));
      setReviews(null);
      setPosts([]);
      setBusinessInfo(null);
      toast.success('Disconnected');
    } catch {
      toast.error('Failed to disconnect');
    }
  };

  const handleRefreshReviews = async () => {
    try {
      const res = await api.get('/gbp/reviews?refresh=1');
      setReviews(res.data);
      toast.success('Reviews refreshed');
    } catch {
      toast.error('Failed to refresh reviews');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postForm.summary.trim()) return toast.error('Post summary is required');
    setPosting(true);
    try {
      await api.post('/gbp/posts', {
        summary: postForm.summary,
        callToAction: postForm.ctaType ? { actionType: postForm.ctaType, url: postForm.ctaUrl } : undefined,
        mediaUrl: postForm.mediaUrl || undefined,
      });
      toast.success('Post published to Google Business Profile!');
      setPostForm({ summary: '', ctaType: '', ctaUrl: '', mediaUrl: '' });
      const res = await api.get('/gbp/posts');
      setPosts(res.data.posts || []);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create post');
    }
    setPosting(false);
  };

  const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <FaStar key={n} className={`text-sm ${n <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Google Business Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage reviews, posts and business info synced from Google</p>
        </div>
        {status?.connected ? (
          <button onClick={handleDisconnect} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors">
            <FaTimes className="text-xs" /> Disconnect
          </button>
        ) : (
          <button onClick={handleConnect} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Connect Google Account
          </button>
        )}
      </div>

      {/* Connection status card */}
      <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${status?.connected ? 'bg-green-50 border border-green-200' : status?.placesConfigured ? 'bg-blue-50 border border-blue-200' : 'bg-amber-50 border border-amber-200'}`}>
        {status?.connected ? (
          <>
            <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800">Connected via Google Business Profile API</p>
              <p className="text-sm text-green-600">{status.locationName || status.accountName || 'Account linked'} · Full access: reviews, posts, business info</p>
            </div>
          </>
        ) : status?.placesConfigured ? (
          <>
            <FaCheckCircle className="text-blue-500 text-xl flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Active via Google Places API</p>
              <p className="text-sm text-blue-600">Showing up to 5 reviews · Connect GBP OAuth above for full access (posts, all reviews)</p>
            </div>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-amber-500 text-xl flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Not connected</p>
              <p className="text-sm text-amber-600">Add <code className="bg-amber-100 px-1 rounded">GOOGLE_PLACES_API_KEY</code> + <code className="bg-amber-100 px-1 rounded">GOOGLE_PLACE_ID</code> to Railway env vars, or click Connect above</p>
            </div>
          </>
        )}
      </div>

      {(status?.connected || status?.placesConfigured) && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
            {['reviews', 'posts', 'business-info'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'bg-white shadow text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {tab === 'business-info' ? 'Business Info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Reviews Tab ── */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                {reviews && !reviews.notConnected && (
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-gray-900">{reviews.averageRating?.toFixed(1) || '—'}</div>
                    <div>
                      <StarRating rating={reviews.averageRating || 0} />
                      <p className="text-xs text-gray-500 mt-0.5">{reviews.totalReviewCount || 0} reviews on Google</p>
                    </div>
                  </div>
                )}
                <button onClick={handleRefreshReviews} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Refresh
                </button>
              </div>
              {loading ? (
                <SkeletonTable rows={3} cols={2} />
              ) : reviews?.reviews?.length > 0 ? (
                <div className="space-y-3">
                  {reviews.reviews.map((r, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          {r.reviewer?.profilePhotoUrl && (
                            <img src={r.reviewer.profilePhotoUrl} alt={r.reviewer.displayName} className="w-9 h-9 rounded-full object-cover" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{r.reviewer?.displayName || 'Anonymous'}</p>
                            <p className="text-xs text-gray-400">{r.createTime ? new Date(r.createTime).toLocaleDateString() : ''}</p>
                          </div>
                        </div>
                        <StarRating rating={{ ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 }[r.starRating] || 0} />
                      </div>
                      {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                      {r.reviewReply?.comment && (
                        <div className="mt-3 pl-3 border-l-2 border-primary-200">
                          <p className="text-xs font-medium text-primary-700 mb-1">Owner Reply</p>
                          <p className="text-xs text-gray-500">{r.reviewReply.comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={FaStar} title="No reviews yet" description="Reviews from your Google Business Profile will appear here." />
              )}
            </div>
          )}

          {/* ── Posts Tab ── */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {/* Create post form */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Create New Google Post</h3>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Post Text <span className="text-red-500">*</span></label>
                    <textarea
                      rows={4}
                      value={postForm.summary}
                      onChange={e => setPostForm(p => ({ ...p, summary: e.target.value }))}
                      placeholder="What's new at Meditrust Nepal? Announce a product, event, or offer..."
                      maxLength={1500}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">{postForm.summary.length}/1500</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action (optional)</label>
                      <select
                        value={postForm.ctaType}
                        onChange={e => setPostForm(p => ({ ...p, ctaType: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white"
                      >
                        <option value="">None</option>
                        <option value="LEARN_MORE">Learn More</option>
                        <option value="SHOP">Shop</option>
                        <option value="ORDER">Order</option>
                        <option value="SIGN_UP">Sign Up</option>
                        <option value="CALL">Call Now</option>
                      </select>
                    </div>
                    {postForm.ctaType && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CTA URL</label>
                        <input
                          type="url"
                          value={postForm.ctaUrl}
                          onChange={e => setPostForm(p => ({ ...p, ctaUrl: e.target.value }))}
                          placeholder="https://meditrustnepal.com/products"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                    <input
                      type="url"
                      value={postForm.mediaUrl}
                      onChange={e => setPostForm(p => ({ ...p, mediaUrl: e.target.value }))}
                      placeholder="https://... (publicly accessible image URL)"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <button type="submit" disabled={posting} className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
                    {posting ? <LoadingSpinner size="sm" /> : <FaPlus className="text-xs" />}
                    {posting ? 'Publishing...' : 'Publish to Google'}
                  </button>
                </form>
              </div>

              {/* Existing posts */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recent Posts</h3>
                {posts.length > 0 ? (
                  <div className="space-y-3">
                    {posts.map((p, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-sm text-gray-800 leading-relaxed">{p.summary}</p>
                        {p.callToAction && (
                          <a href={p.callToAction.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 font-medium hover:underline">
                            {p.callToAction.actionType?.replace(/_/g,' ')} →
                          </a>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{p.createTime ? new Date(p.createTime).toLocaleDateString() : ''}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={FaBlog} title="No posts yet" description="Posts you publish above will appear here." />
                )}
              </div>
            </div>
          )}

          {/* ── Business Info Tab ── */}
          {activeTab === 'business-info' && (
            <div>
              {businessInfo && !businessInfo.notConnected ? (
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{businessInfo.title || 'Business Info'}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${businessInfo.openInfo?.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {businessInfo.openInfo?.status || '—'}
                    </span>
                  </div>
                  {businessInfo.phoneNumbers?.primaryPhone && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaCog className="text-gray-400 text-xs" /> {businessInfo.phoneNumbers.primaryPhone}
                    </div>
                  )}
                  {businessInfo.websiteUri && (
                    <div className="flex items-center gap-2 text-sm">
                      <FaCog className="text-gray-400 text-xs" />
                      <a href={businessInfo.websiteUri} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{businessInfo.websiteUri}</a>
                    </div>
                  )}
                  {businessInfo.regularHours?.periods?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Opening Hours</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {businessInfo.regularHours.periods.map((p, i) => (
                          <div key={i} className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">
                            <span className="capitalize font-medium">{p.openDay?.toLowerCase()}</span>
                            <span>{p.openTime?.hours}:{String(p.openTime?.minutes || 0).padStart(2,'0')} – {p.closeTime?.hours}:{String(p.closeTime?.minutes || 0).padStart(2,'0')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={() => api.get('/gbp/business-info?refresh=1').then(r => setBusinessInfo(r.data))} className="text-xs text-primary-600 hover:underline">Refresh from Google</button>
                </div>
              ) : (
                <EmptyState icon={FaFolder} title="No business info" description="Business information will sync after connecting your Google account." />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ==================== BANNERS SECTION ====================
const PLACEMENTS = [
  { value: 'announcement', label: 'Announcement Bar (top of site)' },
  { value: 'home_mid', label: 'Home Page — Between Featured & Categories' },
  { value: 'products_sidebar', label: 'Products Page — Sidebar' },
  { value: 'products_inline', label: 'Products Page — Inline (after row 2)' },
  { value: 'product_detail', label: 'Product Detail — Below CTA' },
];

const BannersSection = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', linkUrl: '', linkLabel: '', bgColor: '#005EEA', textColor: '#ffffff', placement: 'announcement', priority: 0, active: true, startsAt: '', endsAt: '' });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners/admin/all');
      setBanners(res.data.banners || []);
    } catch { toast.error('Failed to load banners'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', subtitle: '', linkUrl: '', linkLabel: '', bgColor: '#005EEA', textColor: '#ffffff', placement: 'announcement', priority: 0, active: true, startsAt: '', endsAt: '' });
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({ title: b.title || '', subtitle: b.subtitle || '', linkUrl: b.linkUrl || '', linkLabel: b.linkLabel || '', bgColor: b.bgColor || '#005EEA', textColor: b.textColor || '#ffffff', placement: b.placement, priority: b.priority || 0, active: b.active !== false, startsAt: b.startsAt ? b.startsAt.slice(0,10) : '', endsAt: b.endsAt ? b.endsAt.slice(0,10) : '' });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null && v !== undefined) fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);
      if (editing) {
        await api.put(`/banners/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner updated');
      } else {
        await api.post('/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner created');
      }
      setShowForm(false);
      load();
    } catch { toast.error('Failed to save banner'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (b) => {
    try {
      await api.put(`/banners/${b._id}`, { active: !b.active });
      load();
    } catch { toast.error('Failed to update'); }
  };

  const placementLabel = (v) => PLACEMENTS.find(p => p.value === v)?.label || v;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Banners & Promotions</h2>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-semibold">
          <FaPlus /> New Banner
        </button>
      </div>

      {loading ? <SkeletonTable /> : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Title', 'Placement', 'Priority', 'Clicks', 'Active', 'Schedule', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {banners.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No banners yet. Create one above.</td></tr>
              )}
              {banners.map(b => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {b.imageUrl
                        ? <img src={b.imageUrl} alt="" className="w-12 h-8 object-cover rounded border" />
                        : <div className="w-12 h-8 rounded border flex-shrink-0" style={{ background: b.bgColor || '#005EEA' }} />}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{b.title}</p>
                        {b.subtitle && <p className="text-xs text-gray-400 line-clamp-1">{b.subtitle}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{placementLabel(b.placement)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{b.priority}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-700">{b.clicks || 0}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(b)} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {b.startsAt ? new Date(b.startsAt).toLocaleDateString() : '—'} → {b.endsAt ? new Date(b.endsAt).toLocaleDateString() : 'Always'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(b)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><FaEdit /></button>
                      <button onClick={() => handleDelete(b._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">{editing ? 'Edit Banner' : 'New Banner'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="e.g. 10% off all ICU equipment this month" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input value={form.subtitle} onChange={e => setForm(f => ({...f, subtitle: e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="Optional tagline" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placement *</label>
                <select required value={form.placement} onChange={e => setForm(f => ({...f, placement: e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                  {PLACEMENTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                  <input value={form.linkUrl} onChange={e => setForm(f => ({...f, linkUrl: e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" placeholder="https://... or /products" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Label</label>
                  <input value={form.linkLabel} onChange={e => setForm(f => ({...f, linkLabel: e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" placeholder="Shop Now" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.bgColor} onChange={e => setForm(f => ({...f, bgColor: e.target.value}))} className="w-10 h-9 rounded border cursor-pointer" />
                    <input value={form.bgColor} onChange={e => setForm(f => ({...f, bgColor: e.target.value}))} className="flex-1 px-2 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.textColor} onChange={e => setForm(f => ({...f, textColor: e.target.value}))} className="w-10 h-9 rounded border cursor-pointer" />
                    <input value={form.textColor} onChange={e => setForm(f => ({...f, textColor: e.target.value}))} className="flex-1 px-2 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (optional)</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full text-sm text-gray-500" />
                {editing?.imageUrl && !imageFile && <img src={editing.imageUrl} alt="" className="mt-2 h-16 rounded object-cover" />}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={form.startsAt} onChange={e => setForm(f => ({...f, startsAt: e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={form.endsAt} onChange={e => setForm(f => ({...f, endsAt: e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority (higher = shown first)</label>
                  <input type="number" value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({...f, active: e.target.checked}))} className="w-4 h-4 text-primary-600" />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">Active</label>
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50">
                {saving ? 'Saving...' : (editing ? 'Update Banner' : 'Create Banner')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN DASHBOARD ====================
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`lg:ml-64 ${mounted ? '' : 'lg:opacity-0'} transition-opacity duration-100`}>
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FaBars className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-3 ml-auto">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{(user?.email || 'A')[0].toUpperCase()}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.email || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
            </div>
          </div>
        </header>

        <main className="p-6 min-h-[calc(100vh-65px)]">
          <Routes>
            <Route path="dashboard" element={<Overview />} />
            <Route path="products" element={<ProductsSection />} />
            <Route path="categories" element={<CategoriesSection />} />
            <Route path="orders" element={<OrdersSection />} />
            <Route path="settings" element={<SettingsSection />} />
            <Route path="reviews" element={<ReviewsSection />} />
            <Route path="google-business" element={<GbpSection />} />
            <Route path="banners" element={<BannersSection />} />
            <Route path="quotes" element={<QuotesSection />} />
            <Route path="subscribers" element={<SubscribersSection />} />
            <Route path="gallery" element={<GallerySection />} />
            <Route path="blog" element={<BlogSection />} />
            <Route path="blog/new" element={<BlogSection />} />
            <Route path="homepage" element={<HomepageSection />} />
            <Route path="services-page" element={<ServicesPageSection />} />
            <Route path="about-page" element={<AboutPageSection />} />
            <Route path="legal-pages" element={<LegalPagesSection />} />
            <Route path="*" element={<Overview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// ==================== SHARED CMS PREVIEW ====================
const CmsPreview = ({ url, onClose }) => (
  <div className="fixed inset-0 z-[200] flex flex-col bg-gray-900">
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-gray-300 font-mono">{window.location.origin}{url}</span>
      </div>
      <div className="flex items-center gap-2">
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="text-xs text-gray-300 hover:text-white px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors">
          Open in new tab ↗
        </a>
        <button onClick={onClose}
          className="text-gray-300 hover:text-white text-xl font-bold ml-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700 transition-colors">
          &times;
        </button>
      </div>
    </div>
    <iframe src={url} className="flex-1 w-full bg-white" title="Page Preview" />
  </div>
);

// ==================== HOMEPAGE CMS SECTION ====================
const HomepageSection = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    heroBadge: '', heroTitle: '', heroSubtitle: '', heroPrimaryBtn: '', heroSecondaryBtn: '',
    stats: [{ value: 500, suffix: '+', label: '' }, { value: 200, suffix: '+', label: '' }, { value: 15, suffix: '+', label: '' }, { value: 24, suffix: '/7', label: '' }],
    trustedBy: [],
    whyChooseUs: [],
  });

  useEffect(() => {
    api.get('/homepage').then(r => {
      const d = r.data;
      setForm({
        heroBadge: d.heroBadge || '',
        heroTitle: d.heroTitle || '',
        heroSubtitle: d.heroSubtitle || '',
        heroPrimaryBtn: d.heroPrimaryBtn || '',
        heroSecondaryBtn: d.heroSecondaryBtn || '',
        stats: d.stats?.length ? d.stats : [{ value: 500, suffix: '+', label: 'Surgical Products' }, { value: 200, suffix: '+', label: 'Hospitals Served' }, { value: 15, suffix: '+', label: 'Years Experience' }, { value: 24, suffix: '/7', label: 'Support Hours' }],
        trustedBy: d.trustedBy?.length ? d.trustedBy : [],
        whyChooseUs: d.whyChooseUs?.length ? d.whyChooseUs : [],
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/homepage', form);
      toast.success('Homepage updated!');
      setIsDirty(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const [isDirty, setIsDirty] = useState(false);
  useUnsavedGuard(isDirty);
  const setField = (k, v) => { setIsDirty(true); setForm(f => ({ ...f, [k]: v })); };
  const setStat = (i, k, v) => { setIsDirty(true); setForm(f => { const s = [...f.stats]; s[i] = { ...s[i], [k]: k === 'value' ? Number(v) : v }; return { ...f, stats: s }; }); };
  const setTrusted = (i, k, v) => { setIsDirty(true); setForm(f => { const t = [...f.trustedBy]; t[i] = { ...t[i], [k]: v }; return { ...f, trustedBy: t }; }); };
  const setWhy = (i, k, v) => { setIsDirty(true); setForm(f => { const w = [...f.whyChooseUs]; w[i] = { ...w[i], [k]: v }; return { ...f, whyChooseUs: w }; }); };
  const [previewOpen, setPreviewOpen] = useState(false);

  if (loading) return <PageLoader />

  return (
    <>
    {previewOpen && <CmsPreview url="/home" onClose={() => setPreviewOpen(false)} />}
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Edit hero text, stats, trusted logos and feature cards</p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Unsaved changes</span>}
          <button onClick={() => setPreviewOpen(true)} className="btn-secondary">Preview</button>
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* HERO */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-lg border-b pb-3">Hero Section</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Badge Text (top pill)</label>
          <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.heroBadge} onChange={e => setField('heroBadge', e.target.value)} placeholder="Nepal's Trusted Surgical Equipment Partner" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">H1 Title (use \n to split into two lines)</label>
          <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.heroTitle} onChange={e => setField('heroTitle', e.target.value)} placeholder="Surgical Equipment\nBuilt for Excellence" />
          <p className="text-xs text-gray-400 mt-1">Second line after \n shows in blue. Example: <code>Medical Equipment\nFor Every Hospital</code></p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
          <textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" value={form.heroSubtitle} onChange={e => setField('heroSubtitle', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Button Text</label>
            <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.heroPrimaryBtn} onChange={e => setField('heroPrimaryBtn', e.target.value)} placeholder="Browse Products" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Secondary Button Text</label>
            <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.heroSecondaryBtn} onChange={e => setField('heroSecondaryBtn', e.target.value)} placeholder="Request a Quote" />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-lg border-b pb-3">Stats Bar</h2>
        <div className="grid grid-cols-2 gap-4">
          {form.stats.map((s, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Number</label>
                  <input type="number" className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" value={s.value} onChange={e => setStat(i, 'value', e.target.value)} />
                </div>
                <div className="w-20">
                  <label className="text-xs text-gray-500">Suffix</label>
                  <input className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" value={s.suffix} onChange={e => setStat(i, 'suffix', e.target.value)} placeholder="+" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Label</label>
                <input className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" value={s.label} onChange={e => setStat(i, 'label', e.target.value)} placeholder="Hospitals Served" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUSTED BY */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="font-semibold text-gray-800 text-lg">Trusted By Logos</h2>
          <button onClick={() => setField('trustedBy', [...form.trustedBy, { name: '', logo: '', url: '' }])} className="text-xs btn-secondary px-3 py-1.5">+ Add</button>
        </div>
        {form.trustedBy.map((t, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 items-end border border-gray-100 rounded-lg p-3">
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <input className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" value={t.name} onChange={e => setTrusted(i, 'name', e.target.value)} placeholder="Bir Hospital" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Logo URL</label>
              <input className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" value={t.logo} onChange={e => setTrusted(i, 'logo', e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Link URL</label>
                <input className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" value={t.url} onChange={e => setTrusted(i, 'url', e.target.value)} placeholder="https://..." />
              </div>
              <button onClick={() => setField('trustedBy', form.trustedBy.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 pb-1 text-lg">&times;</button>
            </div>
          </div>
        ))}
        {form.trustedBy.length === 0 && <p className="text-sm text-gray-400">No logos — using defaults. Click + Add to customize.</p>}
      </div>

      {/* WHY CHOOSE US */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="font-semibold text-gray-800 text-lg">Why Choose Us Cards</h2>
          <button onClick={() => setField('whyChooseUs', [...form.whyChooseUs, { title: '', desc: '' }])} className="text-xs btn-secondary px-3 py-1.5">+ Add</button>
        </div>
        {form.whyChooseUs.map((w, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
            <div className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <input className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" value={w.title} onChange={e => setWhy(i, 'title', e.target.value)} placeholder="Card title" />
                <textarea rows={2} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm resize-none" value={w.desc} onChange={e => setWhy(i, 'desc', e.target.value)} placeholder="Card description" />
              </div>
              <button onClick={() => setField('whyChooseUs', form.whyChooseUs.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-lg mt-1">&times;</button>
            </div>
          </div>
        ))}
        {form.whyChooseUs.length === 0 && <p className="text-sm text-gray-400">No cards — using defaults. Click + Add to customize.</p>}
      </div>

      <div className="flex justify-end pb-10">
        <button onClick={save} disabled={saving} className="btn-primary px-8">{saving ? 'Saving...' : 'Save All Changes'}</button>
      </div>
    </div>
    </>
  );
};

// ==================== SERVICES PAGE CMS ====================
const DEFAULT_SVC_CARDS = [
  { title: 'Medical Equipment Supply', subtitle: 'Comprehensive Range of Medical Devices', description: 'We provide a comprehensive range of high-quality medical equipment from globally recognized manufacturers.', features: ['Wide range of medical devices', 'Internationally certified manufacturers', 'Competitive pricing', 'Timely delivery across Nepal'] },
  { title: 'Hospital Project Consultation', subtitle: 'Planning and Design Expertise', description: 'Our team provides comprehensive consultation for hospital projects, from initial planning to equipment selection.', features: ['Hospital layout consultation', 'Equipment selection', 'Budget planning', 'Project timeline management'] },
  { title: 'Equipment Installation', subtitle: 'Professional Installation Services', description: 'Our certified technicians ensure proper installation of all medical equipment following manufacturer specifications.', features: ['Certified installation team', 'Site preparation guidance', 'Equipment calibration', 'User training'] },
  { title: 'Maintenance & Technical Support', subtitle: 'Ongoing Service and Support', description: 'We provide comprehensive after-sales support and maintenance services to ensure peak performance.', features: ['24/7 technical support', 'Preventive maintenance', 'Spare parts supply', 'Annual maintenance contracts (AMC)'] },
];

const ServicesPageSection = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ heroLabel: '', heroTitle: '', heroDesc: '', services: [] });

  useEffect(() => {
    api.get('/services-settings').then(r => {
      const d = r.data;
      setForm({
        heroLabel: d.heroLabel || '',
        heroTitle: d.heroTitle || '',
        heroDesc:  d.heroDesc  || '',
        services: d.services?.length ? d.services : DEFAULT_SVC_CARDS.map(s => ({ ...s })),
      });
    }).catch(() => {
      setForm({ heroLabel: '', heroTitle: '', heroDesc: '', services: DEFAULT_SVC_CARDS.map(s => ({ ...s })) });
    }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/services-settings', form);
      toast.success('Services page updated!');
      setIsDirty(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const [isDirty, setIsDirty] = useState(false);
  useUnsavedGuard(isDirty);
  const setField = (k, v) => { setIsDirty(true); setForm(f => ({ ...f, [k]: v })); };
  const setSvc = (i, k, v) => { setIsDirty(true); setForm(f => { const s = [...f.services]; s[i] = { ...s[i], [k]: v }; return { ...f, services: s }; }); };
  const setFeature = (si, fi, v) => { setIsDirty(true); setForm(f => { const s = [...f.services]; const feats = [...(s[si].features || [])]; feats[fi] = v; s[si] = { ...s[si], features: feats }; return { ...f, services: s }; }); };
  const addFeature = (si) => { setIsDirty(true); setForm(f => { const s = [...f.services]; s[si] = { ...s[si], features: [...(s[si].features || []), ''] }; return { ...f, services: s }; }); };
  const removeFeature = (si, fi) => { setIsDirty(true); setForm(f => { const s = [...f.services]; s[si] = { ...s[si], features: s[si].features.filter((_, j) => j !== fi) }; return { ...f, services: s }; }); };
  const [previewOpen, setPreviewOpen] = useState(false);

  if (loading) return <PageLoader />

  return (
    <>
    {previewOpen && <CmsPreview url="/services" onClose={() => setPreviewOpen(false)} />}
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Page CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Edit hero text and all service cards</p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Unsaved changes</span>}
          <button onClick={() => setPreviewOpen(true)} className="btn-secondary">Preview</button>
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* HERO */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-lg border-b pb-3">Hero Section</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Label (small text above title)</label>
          <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.heroLabel} onChange={e => setField('heroLabel', e.target.value)} placeholder="Our Services" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Title (H1)</label>
          <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.heroTitle} onChange={e => setField('heroTitle', e.target.value)} placeholder="Medical Equipment Services" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
          <textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" value={form.heroDesc} onChange={e => setField('heroDesc', e.target.value)} />
        </div>
      </div>

      {/* SERVICE CARDS */}
      {form.services.map((svc, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg border-b pb-3">Service Card {i + 1}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={svc.title} onChange={e => setSvc(i, 'title', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={svc.subtitle} onChange={e => setSvc(i, 'subtitle', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" value={svc.description} onChange={e => setSvc(i, 'description', e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-600">Feature Bullet Points</label>
              <button onClick={() => addFeature(i)} className="text-xs btn-secondary px-2 py-1">+ Add</button>
            </div>
            <div className="space-y-2">
              {(svc.features || []).map((f, fi) => (
                <div key={fi} className="flex gap-2 items-center">
                  <input className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm" value={f} onChange={e => setFeature(i, fi, e.target.value)} placeholder="Feature description" />
                  <button onClick={() => removeFeature(i, fi)} className="text-red-400 hover:text-red-600 text-lg">&times;</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end pb-10">
        <button onClick={save} disabled={saving} className="btn-primary px-8">{saving ? 'Saving...' : 'Save All Changes'}</button>
      </div>
    </div>
    </>
  );
};

// ==================== ABOUT PAGE CMS ====================
const AboutPageSection = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [form, setForm] = useState({
    heroLabel: '', heroTitle: '', heroDesc: '',
    storyPara1: '', storyPara2: '', storyBadge: '15+',
    missionText: '', visionText: '',
    values: [], team: [], milestones: [],
  });

  useEffect(() => {
    api.get('/about-settings').then(r => {
      const d = r.data;
      setForm({
        heroLabel:   d.heroLabel   || '',
        heroTitle:   d.heroTitle   || '',
        heroDesc:    d.heroDesc    || '',
        storyPara1:  d.storyPara1  || '',
        storyPara2:  d.storyPara2  || '',
        storyBadge:  d.storyBadge  || '15+',
        missionText: d.missionText || '',
        visionText:  d.visionText  || '',
        values:     d.values?.length     ? d.values     : [{ title: 'Integrity', desc: 'We conduct our business with the highest ethical standards.' }, { title: 'Quality', desc: 'We never compromise on quality.' }, { title: 'Innovation', desc: 'We stay updated with medical technology.' }, { title: 'Customer Focus', desc: 'Our customers are at the heart of everything we do.' }],
        team:       d.team?.length       ? d.team       : [{ name: '', role: '', desc: '' }],
        milestones: d.milestones?.length ? d.milestones : [{ year: '2009', title: 'Company Founded', desc: 'Meditrust Nepal was established in Kathmandu.' }],
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/about-settings', form);
      toast.success('About page updated!');
      setIsDirty(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const [isDirty, setIsDirty] = useState(false);
  useUnsavedGuard(isDirty);
  const setF = (k, v) => { setIsDirty(true); setForm(f => ({ ...f, [k]: v })); };
  const setItem = (arr, i, k, v) => { setIsDirty(true); setForm(f => { const a = [...f[arr]]; a[i] = { ...a[i], [k]: v }; return { ...f, [arr]: a }; }); };
  const addItem = (arr, blank) => { setIsDirty(true); setForm(f => ({ ...f, [arr]: [...f[arr], blank] })); };
  const removeItem = (arr, i) => { setIsDirty(true); setForm(f => ({ ...f, [arr]: f[arr].filter((_, j) => j !== i) })); };

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'story', label: 'Our Story' },
    { id: 'mission', label: 'Mission & Vision' },
    { id: 'values', label: 'Values' },
    { id: 'team', label: 'Team' },
    { id: 'milestones', label: 'Milestones' },
  ];
  const [previewOpen, setPreviewOpen] = useState(false);

  if (loading) return <PageLoader />

  return (
    <>
    {previewOpen && <CmsPreview url="/about" onClose={() => setPreviewOpen(false)} />}
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Page CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Edit all sections of the About Us page</p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Unsaved changes</span>}
          <button onClick={() => setPreviewOpen(true)} className="btn-secondary">Preview</button>
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      <div className="flex gap-1 flex-wrap border-b border-gray-200">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'hero' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg border-b pb-3">Hero Section</h2>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Label</label><input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.heroLabel} onChange={e => setF('heroLabel', e.target.value)} placeholder="About Us" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Title (H1)</label><input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.heroTitle} onChange={e => setF('heroTitle', e.target.value)} placeholder="Nepal's Trusted Medical Equipment Partner" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Description</label><textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" value={form.heroDesc} onChange={e => setF('heroDesc', e.target.value)} /></div>
        </div>
      )}

      {activeTab === 'story' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg border-b pb-3">Our Story</h2>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Paragraph 1</label><textarea rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" value={form.storyPara1} onChange={e => setF('storyPara1', e.target.value)} /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Paragraph 2</label><textarea rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" value={form.storyPara2} onChange={e => setF('storyPara2', e.target.value)} /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Badge Number (e.g. 15+)</label><input className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.storyBadge} onChange={e => setF('storyBadge', e.target.value)} /></div>
        </div>
      )}

      {activeTab === 'mission' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg border-b pb-3">Mission &amp; Vision</h2>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Mission Statement</label><textarea rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" value={form.missionText} onChange={e => setF('missionText', e.target.value)} /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Vision Statement</label><textarea rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" value={form.visionText} onChange={e => setF('visionText', e.target.value)} /></div>
        </div>
      )}

      {activeTab === 'values' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-semibold text-gray-800 text-lg">Core Values</h2>
            <button onClick={() => addItem('values', { title: '', desc: '' })} className="text-xs btn-secondary px-3 py-1.5">+ Add</button>
          </div>
          {form.values.map((v, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" value={v.title} onChange={e => setItem('values', i, 'title', e.target.value)} placeholder="Value title" />
                  <textarea rows={2} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm resize-none" value={v.desc} onChange={e => setItem('values', i, 'desc', e.target.value)} placeholder="Description" />
                </div>
                <button onClick={() => removeItem('values', i)} className="text-red-400 hover:text-red-600 text-lg mt-1">&times;</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'team' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-semibold text-gray-800 text-lg">Team Members</h2>
            <button onClick={() => addItem('team', { name: '', role: '', desc: '' })} className="text-xs btn-secondary px-3 py-1.5">+ Add</button>
          </div>
          {form.team.map((m, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input className="px-2 py-1.5 border border-gray-200 rounded text-sm" value={m.name} onChange={e => setItem('team', i, 'name', e.target.value)} placeholder="Full name" />
                    <input className="px-2 py-1.5 border border-gray-200 rounded text-sm" value={m.role} onChange={e => setItem('team', i, 'role', e.target.value)} placeholder="Job title" />
                  </div>
                  <textarea rows={2} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm resize-none" value={m.desc} onChange={e => setItem('team', i, 'desc', e.target.value)} placeholder="Short bio" />
                </div>
                <button onClick={() => removeItem('team', i)} className="text-red-400 hover:text-red-600 text-lg mt-1">&times;</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-semibold text-gray-800 text-lg">Milestones / Timeline</h2>
            <button onClick={() => addItem('milestones', { year: '', title: '', desc: '' })} className="text-xs btn-secondary px-3 py-1.5">+ Add</button>
          </div>
          {form.milestones.map((m, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input className="px-2 py-1.5 border border-gray-200 rounded text-sm" value={m.year} onChange={e => setItem('milestones', i, 'year', e.target.value)} placeholder="Year" />
                    <input className="col-span-2 px-2 py-1.5 border border-gray-200 rounded text-sm" value={m.title} onChange={e => setItem('milestones', i, 'title', e.target.value)} placeholder="Milestone title" />
                  </div>
                  <textarea rows={2} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm resize-none" value={m.desc} onChange={e => setItem('milestones', i, 'desc', e.target.value)} placeholder="Description" />
                </div>
                <button onClick={() => removeItem('milestones', i)} className="text-red-400 hover:text-red-600 text-lg mt-1">&times;</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pb-10">
        <button onClick={save} disabled={saving} className="btn-primary px-8">{saving ? 'Saving...' : 'Save All Changes'}</button>
      </div>
    </div>
    </>
  );
};

// ==================== LEGAL PAGES CMS ====================
const LegalPagesSection = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('privacy');
  const [form, setForm] = useState({
    privacyTitle: 'Privacy Policy', privacyLastUpdated: '', privacyContent: '',
    termsTitle: 'Terms & Conditions', termsLastUpdated: '', termsContent: '',
  });

  useEffect(() => {
    api.get('/legal').then(r => {
      const d = r.data;
      setForm({
        privacyTitle:       d.privacyTitle       || 'Privacy Policy',
        privacyLastUpdated: d.privacyLastUpdated || '',
        privacyContent:     d.privacyContent     || '',
        termsTitle:         d.termsTitle         || 'Terms & Conditions',
        termsLastUpdated:   d.termsLastUpdated   || '',
        termsContent:       d.termsContent       || '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/legal', form);
      toast.success('Legal pages saved!');
      setIsDirty(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const [isDirty, setIsDirty] = useState(false);
  useUnsavedGuard(isDirty);
  const setField = (k, v) => { setIsDirty(true); setForm(f => ({ ...f, [k]: v })); };
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewUrl = activeTab === 'privacy' ? '/privacy-policy' : '/terms-and-conditions';

  if (loading) return <PageLoader />

  return (
    <>
    {previewOpen && <CmsPreview url={previewUrl} onClose={() => setPreviewOpen(false)} />}
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal Pages</h1>
          <p className="text-sm text-gray-500 mt-1">Edit Privacy Policy and Terms &amp; Conditions content</p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Unsaved changes</span>}
          <button onClick={() => setPreviewOpen(true)} className="btn-secondary">Preview</button>
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {[{ id: 'privacy', label: 'Privacy Policy' }, { id: 'terms', label: 'Terms & Conditions' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'privacy' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Page Title</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.privacyTitle} onChange={e => setField('privacyTitle', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Last Updated (e.g. May 20, 2026)</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.privacyLastUpdated} onChange={e => setField('privacyLastUpdated', e.target.value)} placeholder="May 20, 2026" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Content (rich text)</label>
            <RichTextEditor value={form.privacyContent} onChange={v => setField('privacyContent', v)} placeholder="Write your privacy policy here..." />
            <p className="text-xs text-gray-400 mt-1">Leave empty to use the built-in default content.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">Preview page →</a>
          </div>
        </div>
      )}

      {activeTab === 'terms' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Page Title</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.termsTitle} onChange={e => setField('termsTitle', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Last Updated (e.g. May 20, 2026)</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={form.termsLastUpdated} onChange={e => setField('termsLastUpdated', e.target.value)} placeholder="May 20, 2026" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Content (rich text)</label>
            <RichTextEditor value={form.termsContent} onChange={v => setField('termsContent', v)} placeholder="Write your terms and conditions here..." />
            <p className="text-xs text-gray-400 mt-1">Leave empty to use the built-in default content.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">Preview page →</a>
          </div>
        </div>
      )}

      <div className="flex justify-end pb-10">
        <button onClick={save} disabled={saving} className="btn-primary px-8">{saving ? 'Saving...' : 'Save All Changes'}</button>
      </div>
    </div>
    </>
  );
};

// ==================== QUOTES SECTION ====================
const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-600',
};

const QuotesSection = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/quotes', { params: { status: filterStatus || undefined, limit: 100 } });
      setQuotes(res.data.quotes || []);
    } catch { toast.error('Failed to load quotes'); }
    finally { setLoading(false); }
  }, [filterStatus]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/quotes/${id}`, { status });
      setQuotes(prev => prev.map(q => q._id === id ? { ...q, status } : q));
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const saveNotes = async () => {
    if (!selected) return;
    try {
      await api.patch(`/quotes/${selected._id}`, { adminNotes: notes });
      setQuotes(prev => prev.map(q => q._id === selected._id ? { ...q, adminNotes: notes } : q));
      toast.success('Notes saved');
    } catch { toast.error('Save failed'); }
  };

  const deleteQuote = async (id) => {
    if (!window.confirm('Delete this quote lead?')) return;
    try {
      await api.delete(`/quotes/${id}`);
      setQuotes(prev => prev.filter(q => q._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const openDetail = (q) => { setSelected(q); setNotes(q.adminNotes || ''); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Leads</h1>
          <p className="text-gray-500 text-sm mt-1">All quotation requests submitted via the website</p>
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className={`${selected ? 'flex-1' : 'w-full'} bg-white rounded-xl border border-gray-100 overflow-hidden`}>
          {loading ? <SkeletonTable /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Product', 'Contact', 'Phone', 'Source', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {quotes.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No quote leads yet.</td></tr>
                  )}
                  {quotes.map(q => (
                    <tr key={q._id} className={`hover:bg-gray-50 cursor-pointer ${selected?._id === q._id ? 'bg-primary-50' : ''}`} onClick={() => openDetail(q)}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 line-clamp-1 max-w-[160px]">{q.productName}</p>
                        {q.hospitalName && <p className="text-xs text-gray-400 line-clamp-1">{q.hospitalName}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{q.name}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${q.phone}`} className="text-primary-600 hover:underline" onClick={e => e.stopPropagation()}>{q.phone}</a>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={q.status}
                          onChange={e => { e.stopPropagation(); updateStatus(q._id, e.target.value); }}
                          onClick={e => e.stopPropagation()}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[q.status] || ''}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          q.source === 'contact_form' ? 'bg-purple-100 text-purple-700' :
                          q.source === 'bulk_inquiry' ? 'bg-orange-100 text-orange-700' :
                          q.source === 'cart' ? 'bg-blue-100 text-blue-700' :
                          q.source === 'whatsapp' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {q.source === 'contact_form' ? 'Contact Form' :
                           q.source === 'bulk_inquiry' ? 'Bulk' :
                           q.source === 'cart' ? 'Cart' :
                           q.source === 'whatsapp' ? 'WhatsApp' :
                           'Product'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{new Date(q.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={e => { e.stopPropagation(); deleteQuote(q._id); }} className="text-red-400 hover:text-red-600 p-1">
                          <FaTrash className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-white border border-gray-100 rounded-xl p-5 self-start sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Quote Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕ Close</button>
            </div>
            <div className="space-y-3 text-sm mb-4">
              <div><p className="text-xs text-gray-400 font-medium uppercase">Product</p><p className="text-gray-900 font-semibold">{selected.productName}</p></div>
              <div><p className="text-xs text-gray-400 font-medium uppercase">Name</p><p className="text-gray-700">{selected.name}</p></div>
              {selected.hospitalName && <div><p className="text-xs text-gray-400 font-medium uppercase">Hospital</p><p className="text-gray-700">{selected.hospitalName}</p></div>}
              <div><p className="text-xs text-gray-400 font-medium uppercase">Phone</p><a href={`tel:${selected.phone}`} className="text-primary-600 hover:underline">{selected.phone}</a></div>
              {selected.email && <div><p className="text-xs text-gray-400 font-medium uppercase">Email</p><a href={`mailto:${selected.email}`} className="text-primary-600 hover:underline text-xs">{selected.email}</a></div>}
              {selected.message && <div><p className="text-xs text-gray-400 font-medium uppercase">Message</p><p className="text-gray-600 text-xs leading-relaxed">{selected.message}</p></div>}
              <div><p className="text-xs text-gray-400 font-medium uppercase">Source</p><p className="text-gray-600">{selected.source}</p></div>
            </div>
            <div className="flex gap-2 mb-4">
              <a href={`https://wa.me/${selected.phone?.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition">
                <FaWhatsapp /> WhatsApp
              </a>
              <a href={`tel:${selected.phone}`}
                className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition">
                📞 Call
              </a>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Admin Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Call outcome, follow-up date..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              />
            </div>
            <button onClick={saveNotes} className="w-full bg-primary-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-primary-700 transition">
              Save Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== GALLERY SECTION ====================
const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products?limit=100');
        const all = res.data.products || res.data || [];
        const imgs = [];
        all.forEach(p => {
          if (p.images?.length) {
            p.images.forEach(img => imgs.push({ url: img.url || img.path, alt: img.alt || p.name, productName: p.name, slug: p.slug }));
          } else if (p.image) {
            imgs.push({ url: p.image, alt: p.name, productName: p.name, slug: p.slug });
          }
        });
        setImages(imgs);
      } catch { toast.error('Failed to load gallery'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">{images.length} photo{images.length !== 1 ? 's' : ''} — upload images via Products → Edit</p>
        </div>
        <Link to="/admin/products" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition flex items-center gap-2">
          <FaImages className="text-xs" /> Manage Products
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-pulse">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FaImages className="text-5xl mx-auto mb-4 text-gray-200" />
          <p className="font-medium">No product images yet</p>
          <p className="text-sm mt-1">Go to <Link to="/admin/products" className="text-primary-600 underline">Products</Link> and upload images for each product.</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow"
              onClick={() => setLightbox({ img, i })}
            >
              <img src={img.url} alt={img.alt} loading="lazy" className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs font-semibold line-clamp-2">{img.productName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300" onClick={() => setLightbox(null)}>×</button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl px-2"
            onClick={e => { e.stopPropagation(); setLightbox(lb => { const ni = (lb.i - 1 + images.length) % images.length; return { img: images[ni], i: ni }; }); }}
          >‹</button>
          <img src={lightbox.img.url} alt={lightbox.img.alt} className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl px-2"
            onClick={e => { e.stopPropagation(); setLightbox(lb => { const ni = (lb.i + 1) % images.length; return { img: images[ni], i: ni }; }); }}
          >›</button>
          <div className="absolute bottom-4 text-white/60 text-sm">{lightbox.img.productName}</div>
        </div>
      )}
    </div>
  );
};

// ==================== BLOG SECTION ====================
const emptyPost = { title: '', excerpt: '', content: '', image: '', author: 'Meditrust Nepal', category: '', tags: '', published: true, metaTitle: '', metaDesc: '' };

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPost);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs/all');
      setPosts(res.data.blogs || []);
    } catch { toast.error('Failed to load blog posts'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(emptyPost); setEditing('new'); };
  const openEdit = (p) => { setForm({ ...p, tags: (p.tags || []).join(', ') }); setEditing(p._id); };
  const cancel = () => { setEditing(null); setForm(emptyPost); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editing === 'new') {
        const res = await api.post('/blogs', payload);
        setPosts(prev => [res.data, ...prev]);
        toast.success('Post created');
      } else {
        const res = await api.put(`/blogs/${editing}`, payload);
        setPosts(prev => prev.map(p => p._id === editing ? res.data : p));
        toast.success('Post updated');
      }
      cancel();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const toggle = async (p) => {
    try {
      const res = await api.put(`/blogs/${p._id}`, { published: !p.published });
      setPosts(prev => prev.map(x => x._id === p._id ? res.data : x));
    } catch { toast.error('Failed to update'); }
  };

  const field = (key, value) => setForm(f => ({ ...f, [key]: value }));

  if (editing) return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{editing === 'new' ? 'New Blog Post' : 'Edit Post'}</h1>
        <button onClick={cancel} className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"><FaTimes /> Cancel</button>
      </div>
      <form onSubmit={save} className="space-y-5 bg-white rounded-xl border border-gray-100 p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title *</label>
            <input value={form.title} onChange={e => field('title', e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="Post title" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Author</label>
            <input value={form.author} onChange={e => field('author', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
            <input value={form.category} onChange={e => field('category', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="e.g. ICU Equipment" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cover Image URL</label>
            <input value={form.image} onChange={e => field('image', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => field('excerpt', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" placeholder="Short description shown in listings..." />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Content (HTML or Markdown)</label>
            <textarea value={form.content} onChange={e => field('content', e.target.value)} rows={12} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y" placeholder="Full blog post content..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => field('tags', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="ICU, ventilator, Nepal" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
            <select value={form.published ? 'true' : 'false'} onChange={e => field('published', e.target.value === 'true')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Meta Title</label>
            <input value={form.metaTitle} onChange={e => field('metaTitle', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="SEO title (optional)" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Meta Description</label>
            <input value={form.metaDesc} onChange={e => field('metaDesc', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="SEO description (optional)" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition disabled:opacity-60">
            {saving ? 'Saving...' : (editing === 'new' ? 'Publish Post' : 'Save Changes')}
          </button>
          <button type="button" onClick={cancel} className="border border-gray-200 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage blog articles</p>
        </div>
        <button onClick={openNew} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition flex items-center gap-2">
          <FaPlus className="text-xs" /> New Post
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? <SkeletonTable /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Title', 'Category', 'Author', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No blog posts yet. Click "New Post" to create one.</td></tr>
                )}
                {posts.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{p.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.excerpt}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{p.author}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(p)} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-600 p-1"><FaEye className="text-xs" /></a>
                      <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-primary-600 p-1"><FaEdit className="text-xs" /></button>
                      <button onClick={() => remove(p._id)} className="text-gray-400 hover:text-red-500 p-1"><FaTrash className="text-xs" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== SUBSCRIBERS SECTION ====================
const SubscribersSection = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/notify/subscribers', { params: { limit: 500 } });
      setSubscribers(res.data.subscribers || []);
    } catch { toast.error('Failed to load subscribers'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      await api.delete(`/notify/subscribers/${id}`);
      setSubscribers(prev => prev.filter(s => s._id !== id));
      toast.success('Removed');
    } catch { toast.error('Failed to remove'); }
  };

  const filtered = subscribers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-gray-500 text-sm mt-1">Users who signed up for free updates via the home page</p>
        </div>
        <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">{subscribers.length} total</span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? <SkeletonTable /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Name', 'Phone', 'Source', 'Signed Up', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No subscribers yet.</td></tr>
                )}
                {filtered.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3">
                      <a href={`https://wa.me/${s.phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center gap-1">
                        <FaWhatsapp className="text-xs" /> {s.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
                        {s.source === 'home_newsletter' ? 'Home Page' : s.source || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(s._id)} className="text-red-400 hover:text-red-600 p-1"><FaTrash className="text-xs" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
