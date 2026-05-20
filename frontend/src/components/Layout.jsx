import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppWidget from './WhatsAppWidget';
import ScrollToTop from './ScrollToTop';
import ErrorBoundary from './ErrorBoundary';
import BackToTop from './BackToTop';
import CompareDrawer from './ui/CompareDrawer';
import MobileTabBar from './MobileTabBar';
import { AnnouncementBar } from './PromoBanner';

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-grow pb-16 lg:pb-0">
          <ErrorBoundary key={location.pathname}>
            <div className="page-enter">
              <Outlet />
            </div>
          </ErrorBoundary>
        </main>
        <Footer />
        <WhatsAppWidget />
        <BackToTop />
        <CompareDrawer />
        <MobileTabBar />
      </div>
    </>
  );
};

export default Layout;
