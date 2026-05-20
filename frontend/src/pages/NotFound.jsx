import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import PixelDesert from '../components/ui/PixelDesert';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4 py-12">
      <SeoHead title="404 — Page Not Found" description="The page you are looking for does not exist." noindex />
      <PixelDesert message="PAGE NOT FOUND" />
      <div className="flex flex-wrap gap-3 justify-center mt-8">
        <button onClick={() => navigate(-1)} className="btn-secondary">← Go Back</button>
        <Link to="/" className="btn-primary">Home</Link>
        <Link to="/products" className="btn-secondary">Browse Products</Link>
      </div>
    </div>
  );
};

export default NotFound;
