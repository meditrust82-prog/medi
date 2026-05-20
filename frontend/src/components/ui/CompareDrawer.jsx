import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../contexts/CompareContext';
import { FaTimes, FaExchangeAlt } from 'react-icons/fa';

const CompareDrawer = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 transform transition-transform duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex-1 w-full flex items-center justify-start gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {compareList.map((product) => (
              <div key={product.id} className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg p-2 min-w-[200px] max-w-[250px]">
                <button 
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow"
                >
                  <FaTimes />
                </button>
                <div className="w-12 h-12 bg-white rounded flex-shrink-0 overflow-hidden mr-3">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FaExchangeAlt className="text-gray-300 text-xs" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                  {product.price && <p className="text-xs text-primary-600 font-bold">NRS {product.price.toLocaleString()}</p>}
                </div>
              </div>
            ))}
            
            {compareList.length < 3 && (
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2 min-w-[200px] h-[66px] text-gray-400 text-sm font-medium">
                Add up to {3 - compareList.length} more
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button onClick={clearCompare} className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors whitespace-nowrap">
              Clear All
            </button>
            <Link
              to="/compare"
              className={`flex-1 md:flex-none px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 ${compareList.length < 2 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <FaExchangeAlt /> Compare {compareList.length} items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareDrawer;
