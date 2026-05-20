import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NewsletterPopup from './components/NewsletterPopup';
import AbandonedCartPopup from './components/AbandonedCartPopup';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { PageLoader } from './components/ui/LoadingSpinner';
import Layout from './components/Layout';
import AiChat from './components/AiChat';
import { useWhatsApp } from './contexts/WhatsAppContext';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Projects = lazy(() => import('./pages/Projects'));
const Compare = lazy(() => import('./pages/Compare'));
const TrackingPage = lazy(() => import('./pages/TrackingPage'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const BulkInquiry = lazy(() => import('./pages/BulkInquiry'));
const KathmanduMedicalEquipment = lazy(() => import('./pages/KathmanduMedicalEquipment'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const QuoteStatusPage = lazy(() => import('./pages/QuoteStatusPage'));
const BrandPage = lazy(() => import('./pages/BrandPage'));
const HospitalTypePage = lazy(() => import('./pages/HospitalTypePage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader message="Checking authentication..." />;
  if (!user) return <Navigate to={`/admin/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const AdminLoginRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader message="Checking authentication..." />;
  if (user?.role === 'admin') {
    const returnTo = new URLSearchParams(location.search).get('returnTo');
    return <Navigate to={returnTo && returnTo.startsWith('/admin') ? returnTo : '/admin/dashboard'} replace />;
  }
  return <AdminLogin />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag) window.gtag('event', 'page_view', { page_path: location.pathname + location.search });
  }, [location]);
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/products" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="compare" element={<Compare />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="projects" element={<Projects />} />
          <Route path="track/:trackingId" element={<TrackingPage />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="bulk-inquiry" element={<BulkInquiry />} />
          <Route path="kathmandu-medical-equipment-supplier" element={<KathmanduMedicalEquipment />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="my-quotes" element={<QuoteStatusPage />} />
          <Route path="brand/:slug" element={<BrandPage />} />
          <Route path="hospital-equipment-nepal" element={<HospitalTypePage />} />
          <Route path="clinic-equipment-nepal" element={<HospitalTypePage />} />
          <Route path="diagnostic-center-equipment-nepal" element={<HospitalTypePage />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-and-conditions" element={<TermsConditions />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* /admin → /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLoginRoute />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { productName } = useWhatsApp();
  const currentProduct = productName ? { name: productName } : null;

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatedRoutes />
      <AiChat currentProduct={currentProduct} />
      <NewsletterPopup />
      <AbandonedCartPopup />
    </Suspense>
  );
}

export default App;
