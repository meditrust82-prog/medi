import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CompareProvider } from './contexts/CompareContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WhatsAppProvider } from './contexts/WhatsAppContext';
import { WishlistProvider } from './contexts/WishlistContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import './i18n';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const tree = (
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <CartProvider>
                <WhatsAppProvider>
                  <CompareProvider>
                    <WishlistProvider>
                    <App />
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop
                      closeOnClick
                      theme="colored"
                    />
                    </WishlistProvider>
                  </CompareProvider>
                </WhatsAppProvider>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

createRoot(document.getElementById('root')).render(tree);
