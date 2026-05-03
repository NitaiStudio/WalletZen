import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db as firestore } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'motion/react';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { User, Bell, Shield, Wallet, Moon, ChevronRight, LogOut, Heart, Smartphone, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { doc, updateDoc } from 'firebase/firestore';

export default function Settings() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { 
    currency, setCurrency, currencySymbol,
    theme, setTheme, 
    notificationsEnabled, setNotificationsEnabled 
  } = useApp();

  const [isEditingField, setIsEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleToggle = (label: string) => {
    if (label === 'Notifications') setNotificationsEnabled(!notificationsEnabled);
    if (label === 'Dark Mode') setTheme(theme === 'dark' ? 'light' : 'dark');
    if (label === 'Fingerprint Lock') alert('Biometric Auth requires a secure domain and hardware support.');
  };

  const handleUpdateFinancial = async (field: string) => {
    if (!user) return;
    const value = parseFloat(tempValue);
    if (isNaN(value)) return;

    try {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        [field]: value
      });
      setIsEditingField(null);
    } catch (e) {
      console.error('Update failed:', e);
      alert('Failed to update. Check your connection.');
    }
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
      title: 'Financial Settings',
      items: [
        { 
          icon: Wallet, 
          label: 'Initial Balance', 
          value: `${currencySymbol}${userProfile?.initialBalance || 0}`, 
          isEditable: true, 
          field: 'initialBalance' 
        },
        { 
          icon: TrendingUp, 
          label: 'Monthly Salary', 
          value: `${currencySymbol}${userProfile?.monthlySalary || 0}`, 
          isEditable: true, 
          field: 'monthlySalary' 
        },
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
                {group.items.map((item: any, i) => (
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
                      {isEditingField === item.field ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateFinancial(item.field)}
                            className="w-24 bg-white/10 rounded-lg px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Amount"
                          />
                          <button 
                            onClick={() => handleUpdateFinancial(item.field)}
                            className="bg-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase"
                          >
                            Save
                          </button>
                        </div>
                      ) : item.hasToggle ? (
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
                        <button 
                          onClick={() => {
                            if (item.isEditable) {
                              setIsEditingField(item.field);
                              setTempValue((userProfile as any)?.[item.field]?.toString() || '0');
                            } else {
                              alert(`${item.label} details pending.`);
                            }
                          }} 
                          className="flex items-center gap-2"
                        >
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
