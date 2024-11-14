// utils/CookieProvider.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react';

interface CookieContextType {
  cookie: string;
  setCookie: (cookie: string) => void;
}

const CookieContext = createContext<CookieContextType | null>(null);

export const CookieProvider = ({ children, cookie }: { children: React.ReactNode; cookie: string }) => {
  const [currentCookie, setCurrentCookie] = useState(cookie);

  // Update cookie state if it changes
  useEffect(() => {
    setCurrentCookie(cookie);
  }, [cookie]);

  return (
    <CookieContext.Provider value={{ cookie: currentCookie, setCookie: setCurrentCookie }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookie = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookie must be used within a CookieProvider");
  }
  return context;
};
