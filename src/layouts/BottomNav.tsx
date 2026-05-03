import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ListOrdered, PiggyBank, BarChart2, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import TransactionModal from '@/components/TransactionModal';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: ListOrdered, label: 'Activity', path: '/transactions' },
  { icon: Plus, label: '', path: '#', isAction: true },
  { icon: PiggyBank, label: 'Goals', path: '/goals' },
  { icon: BarChart2, label: 'Stats', path: '/analytics' },
];

export default function BottomNav() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-6 right-6 z-50">
        <div className="glass-dark rounded-[32px] p-2 flex items-center justify-between shadow-2xl border border-white/10">
          {navItems.map((item, i) => {
            if (item.isAction) {
              return (
                <button
                  key={i}
                  onClick={() => setIsModalOpen(true)}
                  className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform"
                >
                  <Plus className="w-8 h-8 text-white" />
                </button>
              );
            }

            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) => cn(
                  "relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300",
                  isActive ? "text-primary" : "text-white/40"
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-1.5 h-1.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
