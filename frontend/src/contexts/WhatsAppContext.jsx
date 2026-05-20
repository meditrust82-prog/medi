import { createContext, useContext, useState } from 'react';

const WhatsAppContext = createContext({ productName: null, setProductName: () => {} });

export const useWhatsApp = () => useContext(WhatsAppContext);

export const WhatsAppProvider = ({ children }) => {
  const [productName, setProductName] = useState(null);
  return (
    <WhatsAppContext.Provider value={{ productName, setProductName }}>
      {children}
    </WhatsAppContext.Provider>
  );
};
