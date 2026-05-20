import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('meditrust_compare');
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch {
        setCompareList([]);
      }
    }
  }, []);

  const saveList = (list) => {
    setCompareList(list);
    localStorage.setItem('meditrust_compare', JSON.stringify(list));
  };

  const toggleCompare = (product) => {
    const isComparing = compareList.find(p => p.id === product.id);
    if (isComparing) {
      saveList(compareList.filter(p => p.id !== product.id));
      toast.info('Removed from compare');
    } else {
      if (compareList.length >= 3) {
        toast.warn('You can only compare up to 3 products at a time.');
        return;
      }
      saveList([...compareList, product]);
      toast.success('Added to compare');
    }
  };

  const removeFromCompare = (id) => {
    saveList(compareList.filter(p => p.id !== id));
  };

  const clearCompare = () => {
    saveList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
