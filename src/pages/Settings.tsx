import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'motion/react';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { User, Bell, Shield, Wallet, Moon, ChevronRight, LogOut, Heart, Smartphone } from 'lucide-react';
import { cn } from '@/utils/cn';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile Information', value: 'Felix Nitai' },
      { icon: Wallet, label: 'Payment Methods', value: '3 Cards' },
      { icon: Shield, label: 'Security & Privacy', value: 'High' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', value: 'Enabled', hasToggle: true },
      { icon: Moon, label: 'Dark Mode', value: 'System', hasToggle: true },
      { icon: Smartphone, label: 'Fingerprint Lock', value: 'Disabled', hasToggle: true },
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: Heart, label: 'About WalletZen', value: 'v1.0.0' },
    ]
  }
];

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    currency, setCurrency, 
    theme, setTheme, 
    notificationsEnabled, setNotificationsEnabled 
  } = useApp();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleToggle = (label: string) => {
    if (label === 'Notifications') setNotificationsEnabled(!notificationsEnabled);
    if (label === 'Dark Mode') setTheme(theme === 'dark' ? 'light' : 'dark');
    if (label === 'Fingerprint Lock') alert('Biometric Auth requires a secure domain and hardware support.');
  };

  const renderValue = (item: any) => {
    if (item.label === 'Currency') return currency;
    if (item.label === 'Dark Mode') return theme === 'dark' ? 'On' : 'Off';
    return item.value;
  };

  const settingsGroupsFormatted = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Information', value: user?.displayName || 'Set Name' },
        { icon: Wallet, label: 'Payment Methods', value: '3 Cards' },
        { icon: Shield, label: 'Security & Privacy', value: 'High' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: notificationsEnabled ? 'Enabled' : 'Disabled', hasToggle: true },
        { icon: Moon, label: 'Dark Mode', value: theme === 'dark' ? 'On' : 'Off', hasToggle: true },
        { icon: Smartphone, label: 'Fingerprint Lock', value: 'Disabled', hasToggle: true },
        { icon: Wallet, label: 'Currency', value: currency, hasChoice: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: Heart, label: 'About WalletZen', value: 'v1.0.0' },
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 className="text-2xl font-bold">Settings</h2>

        {/* Profile Card */}
        <GlassCard className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-2 border-primary/30 p-1">
              <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Profile" className="w-full h-full rounded-xl object-cover" />
            </div>
            <div>
              <p className="font-extrabold text-lg">{user?.displayName || 'Zen User'}</p>
              <p className="text-sm text-white/40">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => alert('Profile editing coming soon!')} className="p-3 glass rounded-xl text-primary font-bold text-xs uppercase tracking-widest active:scale-95">Edit</button>
        </GlassCard>

        {/* Settings List */}
        <div className="space-y-8">
          {settingsGroupsFormatted.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-4">{group.title}</p>
              <GlassCard className="p-2">
                {group.items.map((item, i) => (
                  <div
                    key={item.label}
                    className={cn(
                      "w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all rounded-2xl",
                      i !== group.items.length - 1 && "border-b border-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/60">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.hasToggle ? (
                         <button 
                          onClick={() => handleToggle(item.label)}
                          className={cn(
                          "w-10 h-6 rounded-full transition-all relative",
                          (item.label === 'Notifications' && notificationsEnabled) || (item.label === 'Dark Mode' && theme === 'dark') ? "bg-primary" : "bg-white/10"
                        )}>
                          <motion.div 
                            animate={{ x: (item.label === 'Notifications' && notificationsEnabled) || (item.label === 'Dark Mode' && theme === 'dark') ? 16 : 4 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" 
                          />
                        </button>
                      ) : item.hasChoice ? (
                        <select 
                          value={currency} 
                          onChange={(e) => setCurrency(e.target.value as any)}
                          className="bg-transparent text-xs text-secondary font-bold uppercase tracking-tighter outline-none cursor-pointer"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="INR">INR (₹)</option>
                          <option value="BDT">BDT (৳)</option>
                        </select>
                      ) : (
                        <button onClick={() => alert(`${item.label} details pending.`)} className="flex items-center gap-2">
                          <span className="text-xs text-secondary font-bold uppercase tracking-tighter">{item.value}</span>
                          <ChevronRight className="w-4 h-4 text-white/20" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </GlassCard>
            </div>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-4 glass rounded-3xl text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-400/10 transition-all border border-red-400/20 mb-12"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </MainLayout>
  );
}
