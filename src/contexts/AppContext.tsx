import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'INR' | 'BDT';

interface AppContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  currencySymbol: string;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (b: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const symbolMap: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
  BDT: '৳'
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => (localStorage.getItem('currency') as Currency) || 'USD');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('notifications') === 'true');

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('notifications', notificationsEnabled.toString());
  }, [notificationsEnabled]);

  const currencySymbol = symbolMap[currency];

  return (
    <AppContext.Provider value={{ 
      currency, setCurrency, currencySymbol, 
      theme, setTheme, 
      notificationsEnabled, setNotificationsEnabled 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
