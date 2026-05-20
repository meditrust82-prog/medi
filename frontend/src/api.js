import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
});

/* ── Normalize a single product from MongoDB shape → frontend shape ── */
const normalizeProduct = (p) => {
  if (!p || typeof p !== 'object') return p;
  const out = { ...p };
  // _id → id
  if (out._id !== undefined && out.id === undefined) {
    out.id = typeof out._id === 'object' ? String(out._id) : out._id;
  }
  // images: [{url, alt}] → [{path, alt}] (also surface a flat .image)
  if (Array.isArray(out.images)) {
    out.images = out.images.map((img) =>
      img && img.url && img.path === undefined ? { ...img, path: img.url } : img
    );
    if (!out.image && out.images[0]) out.image = out.images[0].path || out.images[0].url;
    out.allImages = out.images.map((img) => img.path || img.url).filter(Boolean);
  }
  // stock → quantity
  if (out.quantity === undefined && out.stock !== undefined) {
    out.quantity = out.stock;
  }
  // category is already a string — also expose categorySlug
  if (out.category && !out.categorySlug) {
    out.categorySlug = out.category.toLowerCase().replace(/\s+/g, '-');
  }
  return out;
};

const normalizeResponse = (data) => {
  if (!data || typeof data !== 'object') return data;
  // list response: { products: [...], total, page, pages }
  if (Array.isArray(data.products)) {
    return { ...data, products: data.products.map(normalizeProduct) };
  }
  // single product (object with _id or name)
  if (data._id || data.name) return normalizeProduct(data);
  // array at root
  if (Array.isArray(data)) return data.map(normalizeProduct);
  return data;
};

let sessionExpiredShown = false;

api.interceptors.response.use(
  (response) => {
    if (response.data && response.config.url?.startsWith('/products')) {
      response.data = normalizeResponse(response.data);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.error || data?.message;

    // Network / no response
    if (!error.response) {
      toast.error('Network error — check your connection.', { toastId: 'network-error' });
      return Promise.reject(error);
    }

    if (status === 401) {
      if (!error.config?.silent && window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        if (!sessionExpiredShown) {
          sessionExpiredShown = true;
          toast.error('Session expired. Please log in again.', {
            onClose: () => { sessionExpiredShown = false; },
          });
          setTimeout(() => { window.location.href = '/admin/login'; }, 1500);
        }
      }
    } else if (status === 403) {
      if (!error.config?.silent) toast.error('You do not have permission to do that.');
    } else if (status === 404) {
      // let callers handle 404 silently — don't double-toast
    } else if (status === 409) {
      toast.error(message || 'Conflict — resource already exists or has changed.');
    } else if (status === 422 || status === 400) {
      // Surface validation details if present
      if (data?.details?.length) {
        const msgs = data.details.map(d => d.message).join(' · ');
        toast.error(`Validation: ${msgs}`, { autoClose: 6000 });
      }
      // individual callers handle 400 with their own toast
    } else if (status === 429) {
      toast.warn('Too many requests. Please wait a moment.', { toastId: 'rate-limit' });
    } else if (status >= 500) {
      if (!error.config?.silent) {
        toast.error(message || 'Server error. Please try again later.', { toastId: 'server-error' });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
