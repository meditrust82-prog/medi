import React from 'react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
  approved: 'bg-green-100 text-green-700',
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-700',
  featured: 'bg-purple-100 text-purple-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-red-100 text-red-700',
  confirmed: 'bg-blue-100 text-blue-700',
  order_confirmed: 'bg-blue-100 text-blue-700',
  picked_up: 'bg-indigo-100 text-indigo-700',
  in_transit: 'bg-amber-100 text-amber-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

const StatusBadge = ({ status, className = '' }) => {
  const style = statusStyles[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${style} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
