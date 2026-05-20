import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const Breadcrumb = ({ items = [] }) => (
  <nav className="flex items-center text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
    <Link to="/" className="hover:text-primary-600 transition-colors">
      <FaHome className="text-sm" />
    </Link>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <FaChevronRight className="mx-2 text-[10px] text-gray-300" />
        {item.href ? (
          <Link to={item.href} className="hover:text-primary-600 transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-gray-900 font-medium">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default Breadcrumb;
