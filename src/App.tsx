/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

// Pages (to be created)
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Offline from './pages/Offline';
import NotFound from './pages/NotFound';

function AnimatedRoutes() {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <AnimatePresence mode="wait">
      {!isOnline && location.pathname !== '/' && <Offline key="offline" />}
      <Routes location={location}>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

export default function App() {
  // Use import.meta.env.BASE_URL which is set by Vite's "base" config
  const basename = import.meta.env.BASE_URL;
  
  return (
    <AuthProvider>
      <AppProvider>
        <Router basename={basename}>
        <div className="min-h-screen bg-background relative overflow-hidden">
          {/* Animated Background Glows */}
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] glow-overlay opacity-20 pointer-events-none" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] glow-overlay opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at center, #06B6D4, transparent 70%)' }} />
          
          <AnimatedRoutes />
        </div>
      </Router>
      </AppProvider>
    </AuthProvider>
  );
}

