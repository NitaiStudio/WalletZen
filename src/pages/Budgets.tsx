import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { ShoppingBag, Coffee, Car, Home as HomeIcon, MoreVertical, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/utils/cn';

import { useApp } from '@/contexts/AppContext';

const budgetData = [
  { name: 'Shopping', spent: 450, total: 600, icon: ShoppingBag, color: '#7C3AED' },
  { name: 'Food', spent: 280, total: 400, icon: Coffee, color: '#06B6D4' },
  { name: 'Transport', spent: 150, total: 200, icon: Car, color: '#22C55E' },
  { name: 'Rent', spent: 1200, total: 1200, icon: HomeIcon, color: '#F59E0B' },
];

export default function Budgets() {
  const { currencySymbol } = useApp();

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Budgets</h2>
          <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-primary">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Monthly Summary Chart */}
        <GlassCard className="p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-48 h-48 relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="spent"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-white/40 uppercase font-bold tracking-widest">Spent</span>
              <span className="text-2xl font-black">{currencySymbol}2,080</span>
              <span className="text-[10px] text-white/20">of {currencySymbol}2,400</span>
            </div>
          </div>
        </GlassCard>

        {/* Budget Cards */}
        <div className="space-y-4">
          {budgetData.map((item) => {
            const percentage = (item.spent / item.total) * 100;
            return (
              <GlassCard key={item.name} className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                      <item.icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="font-extrabold">{item.name}</p>
                      <p className="text-xs text-white/40">{currencySymbol}{item.spent} of {currencySymbol}{item.total}</p>
                    </div>
                  </div>
                  <button className="p-2 glass rounded-lg text-white/20">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.2, ease: "circOut" }}
                      className="h-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-white/20 uppercase">{Math.round(percentage)}% used</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase">${item.total - item.spent} left</span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
