import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { PieChart as PieIcon, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from 'recharts';
import { cn } from '@/utils/cn';
import { useApp } from '@/contexts/AppContext';

const pieData = [
  { name: 'Food', value: 400, color: '#7C3AED' },
  { name: 'Rent', value: 1200, color: '#06B6D4' },
  { name: 'Transport', value: 300, color: '#22C55E' },
  { name: 'Shopping', value: 500, color: '#F59E0B' },
];

const barData = [
  { name: 'Mon', income: 400, expense: 240 },
  { name: 'Tue', income: 300, expense: 139 },
  { name: 'Wed', income: 200, expense: 980 },
  { name: 'Thu', income: 278, expense: 390 },
  { name: 'Fri', income: 189, expense: 480 },
  { name: 'Sat', income: 239, expense: 380 },
  { name: 'Sun', income: 349, expense: 430 },
];

export default function Analytics() {
  const { currencySymbol } = useApp();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  return (
    <MainLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <div className="glass p-1 rounded-xl flex gap-1">
            {(['daily', 'weekly', 'monthly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                  activeTab === t ? "bg-primary text-white" : "text-white/40"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <p className="text-xs text-white/50">Avg. Saving</p>
            <p className="text-xl font-bold">{currencySymbol}4,250</p>
            <p className="text-[10px] text-accent">+12.5% vs last month</p>
          </GlassCard>
          <GlassCard className="p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <PieIcon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-white/50">Top Category</p>
            <p className="text-xl font-bold">Housing</p>
            <p className="text-[10px] text-white/40">32% of total spend</p>
          </GlassCard>
        </div>

        {/* Expenditure Break-down */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Expenditure Break-down</h3>
          <GlassCard className="p-6 flex items-center">
            <div className="w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-white/60">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold">{currencySymbol}{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Cash Flow */}
        <section className="space-y-4 pb-12">
          <h3 className="text-lg font-bold">Cash Flow Overview</h3>
          <GlassCard className="p-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#ffffff50' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#1a2235', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="income" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="expense" fill="#7C3AED" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </section>
      </div>
    </MainLayout>
  );
}
