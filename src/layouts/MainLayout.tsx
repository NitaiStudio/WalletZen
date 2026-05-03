import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { motion } from 'motion/react';
import { Bell, User, Search } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

export default function MainLayout({ children, showNav = true }: MainLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currencySymbol } = useApp();

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* App Bar */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 z-40 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/settings')}>
            <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Felix'}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-white/50">Good Morning,</p>
            <p className="font-bold">{user?.displayName || 'Zen User'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/transactions')}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-transform"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => alert('No new notifications')}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white relative active:scale-90 transition-transform"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-background" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 pb-32">
        {children}
      </main>

      {showNav && <BottomNav />}
    </div>
  );
}
