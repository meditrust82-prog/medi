import React from 'react';
import { FaInbox } from 'react-icons/fa';

const EmptyState = ({ icon: Icon = FaInbox, title = 'No items found', description, action, actionLabel }) => (
  <div className="text-center py-12 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="text-gray-400 text-2xl" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    {description && <p className="text-gray-500 text-sm mb-4">{description}</p>}
    {action && actionLabel && (
      <button onClick={action} className="btn-primary text-sm">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
