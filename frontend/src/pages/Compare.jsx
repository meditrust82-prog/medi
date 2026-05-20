import React from 'react';
import SeoHead from '../components/SeoHead';
import { Link } from 'react-router-dom';
import { useCompare } from '../contexts/CompareContext';
import { useCart } from '../contexts/CartContext';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaCheck } from 'react-icons/fa';

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart, cart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const isProductInCart = (id) => cart.some(item => item.id === id);

  return (
    <>
      <SeoHead
        title="Compare Medical Equipment — Side-by-Side Comparison"
        description="Compare medical equipment products side-by-side on Meditrust Nepal. Evaluate specifications, features, and prices to make the best purchasing decision for your hospital."
        noindex={true}
      />

      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="inline-flex items-center text-primary-200 hover:text-white mb-4 text-sm font-medium transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-white">Compare Products</h1>
        </div>
      </section>

      <section className="py-12 bg-white min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {compareList.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No products to compare</h2>
              <p className="text-gray-500 mb-6">Add products from the catalog to compare their specifications side by side.</p>
              <Link to="/products" className="btn-primary inline-block">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="flex justify-end mb-4">
                  <button onClick={clearCompare} className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center">
                    <FaTrash className="mr-2" /> Clear All
                  </button>
                </div>
                <table className="w-full border-collapse border border-gray-200">
                  <tbody>
                    {/* Header Row: Images & basic info */}
                    <tr>
                      <th className="w-48 bg-gray-50 border border-gray-200 p-4 text-left font-semibold text-gray-900 align-top">
                        Product
                      </th>
                      {compareList.map(product => (
                        <td key={`header-${product.id}`} className="w-1/3 border border-gray-200 p-6 align-top">
                          <div className="relative">
                            <button 
                              onClick={() => removeFromCompare(product.id)}
                              className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
                            >
                              <FaTrash size={12} />
                            </button>
                            <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">No Image</div>
                              )}
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                            {product.price && (
                              <p className="text-xl font-bold text-primary-700 mb-4">NRS {product.price.toLocaleString()}</p>
                            )}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${isProductInCart(product.id) ? 'bg-green-100 text-green-700' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                            >
                              {isProductInCart(product.id) ? (
                                <><FaCheck /> In Quote Cart</>
                              ) : (
                                <><FaShoppingCart /> Add to Quote</>
                              )}
                            </button>
                          </div>
                        </td>
                      ))}
                      {/* Fill empty cells if less than 3 products */}
                      {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                        <td key={`empty-header-${i}`} className="w-1/3 border border-gray-200 p-6 align-middle text-center bg-gray-50">
                          <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center text-gray-400 flex-col mb-4 bg-white">
                            <span className="text-sm font-medium mb-2">Add another product</span>
                            <Link to="/products" className="text-primary-600 font-semibold hover:underline text-sm">Browse</Link>
                          </div>
                        </td>
                      ))}
                    </tr>
                    
                    {/* Description Row */}
                    <tr>
                      <th className="bg-gray-50 border border-gray-200 p-4 text-left font-semibold text-gray-900 align-top">
                        Description
                      </th>
                      {compareList.map(product => (
                        <td key={`desc-${product.id}`} className="border border-gray-200 p-4 align-top text-gray-600 text-sm">
                          {product.description || 'N/A'}
                        </td>
                      ))}
                      {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                        <td key={`empty-desc-${i}`} className="border border-gray-200 p-4 bg-gray-50"></td>
                      ))}
                    </tr>

                    {/* Specifications Row */}
                    <tr>
                      <th className="bg-gray-50 border border-gray-200 p-4 text-left font-semibold text-gray-900 align-top">
                        Specifications
                      </th>
                      {compareList.map(product => (
                        <td key={`spec-${product.id}`} className="border border-gray-200 p-4 align-top text-sm">
                          {product.specifications ? (
                            <div className="prose prose-sm max-w-none text-gray-600">
                              {product.specifications.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>{line}<br/></React.Fragment>
                              ))}
                            </div>
                          ) : 'N/A'}
                        </td>
                      ))}
                      {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                        <td key={`empty-spec-${i}`} className="border border-gray-200 p-4 bg-gray-50"></td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Compare;
