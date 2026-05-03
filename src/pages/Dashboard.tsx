import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/utils/cn';

const chartData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 4890 },
  { name: 'Sat', value: 6390 },
  { name: 'Sun', value: 5490 },
];

const transactions = [
  { id: 1, title: 'Apple Music', category: 'Subscription', amount: -9.99, date: 'Today', icon: '🎵' },
  { id: 2, title: 'Salary Deposit', category: 'Income', amount: 4500.00, date: 'Today', icon: '💰' },
  { id: 3, title: 'Uber Ride', category: 'Transport', amount: -24.50, date: 'Yesterday', icon: '🚗' },
  { id: 4, title: 'Starbucks', category: 'Food', amount: -6.40, date: 'Yesterday', icon: '☕' },
];

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { getFinancialInsights } from '@/services/aiService';
import { Sparkles, CreditCard, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { currencySymbol } = useApp();
  const { user } = useAuth();
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  
  const recentTransactions = useLiveQuery(
    () => db.transactions.orderBy('date').reverse().limit(5).toArray()
  ) || [];

  useEffect(() => {
    if (recentTransactions.length > 0) {
      const fetchInsights = async () => {
        setIsInsightLoading(true);
        const insights = await getFinancialInsights(recentTransactions, { displayName: user?.displayName });
        setAiInsights(insights);
        setIsInsightLoading(false);
      };
      fetchInsights();
    }
  }, [recentTransactions.length]);

  const income = recentTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = recentTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = income - expense + 24560; // Mock initial balance + real txs

  return (
    <MainLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Balance Card */}
        <GlassCard className="bg-gradient-to-br from-primary via-primary to-purple-600 p-8 text-white border-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="space-y-1">
            <p className="text-white/70 text-sm font-medium">Total Balance</p>
            <h2 className="text-4xl font-extrabold tracking-tight">{currencySymbol}{totalBalance.toLocaleString()}</h2>
          </div>

          <div className="flex gap-4 mt-8">
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] text-white/60 uppercase font-bold">Income</p>
                <p className="text-base font-bold">{currencySymbol}{income.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-400/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/60 uppercase font-bold">Expense</p>
                <p className="text-base font-bold">{currencySymbol}{expense.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* AI Insights Section */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-bold">AI Insights</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isInsightLoading ? (
              <div className="glass h-32 rounded-3xl flex items-center justify-center animate-pulse">
                <p className="text-text/20">Analyzing your spending...</p>
              </div>
            ) : (
              aiInsights.slice(0, 2).map((insight, index) => (
                <GlassCard key={index} className="p-5 space-y-2 group overflow-hidden relative border-l-4 border-l-secondary">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all" />
                  <p className="text-[10px] font-black uppercase text-secondary tracking-widest">{insight.category}</p>
                  <p className="font-bold text-sm leading-tight">{insight.title}</p>
                  <p className="text-xs text-text/40">{insight.description}</p>
                </GlassCard>
              ))
            )}
            {!isInsightLoading && aiInsights.length === 0 && (
              <GlassCard className="p-5 flex items-center justify-center col-span-full border-dashed border-2 border-white/5">
                <p className="text-xs text-text/40">Add transactions to see AI insights</p>
              </GlassCard>
            )}
          </div>
        </section>

        {/* Card Management Section */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Accounts</h3>
            </div>
            <button className="text-primary text-xs font-bold uppercase tracking-widest">Manage</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1 -mx-4 sm:mx-0">
            <div className="min-w-[280px] h-44 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden group border border-white/20 ml-4 sm:ml-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
              <div className="flex justify-between items-start relative z-10">
                <p className="text-xs font-bold text-white/70">Zen Premium Card</p>
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="w-10 h-10 opacity-80" />
              </div>
              <div className="mt-8 relative z-10">
                <p className="text-xl font-mono tracking-[0.2em] text-white">•••• •••• •••• 4242</p>
                <div className="flex justify-between mt-6 items-end">
                  <div>
                    <p className="text-[8px] uppercase text-white/40 tracking-widest">Card Holder</p>
                    <p className="text-sm font-bold text-white uppercase">{user?.displayName || 'Zen User'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase text-white/40 tracking-widest">Expires</p>
                    <p className="text-sm font-bold text-white">12/28</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="min-w-[280px] h-44 glass-dark rounded-3xl p-6 shadow-2xl relative overflow-hidden group border border-white/5 mr-4 sm:mr-0">
              <div className="flex justify-between items-start relative z-10">
                <p className="text-xs font-bold text-white/40">Virtual Assets</p>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/1200px-Visa_2021.svg.png" alt="Visa" className="w-10 h-3 opacity-40 invert mt-2" />
              </div>
              <div className="mt-8 relative z-10">
                <p className="text-xl font-mono tracking-[0.2em] text-white/60">•••• •••• •••• 8890</p>
                <div className="flex justify-between mt-6 items-end">
                  <div>
                    <p className="text-[8px] uppercase text-white/20 tracking-widest">Card Holder</p>
                    <p className="text-sm font-bold text-white/60 uppercase">{user?.displayName || 'Zen User'}</p>
                  </div>
                  <div className="w-10 h-10 glass rounded-full flex items-center justify-center backdrop-blur-3xl">
                    <ArrowUpRight className="w-4 h-4 text-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Mini View */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Weekly Performance</h3>
            <button className="text-primary text-sm font-semibold">View All</button>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a2235', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Transactions</h3>
            <button className="text-primary text-sm font-semibold">See All</button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="glass p-4 rounded-3xl flex items-center justify-between hover:bg-white/10 active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl">
                    {tx.type === 'income' ? '💰' : '💸'}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{tx.description}</p>
                    <p className="text-xs text-white/40">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-bold",
                    tx.type === 'income' ? "text-accent" : "text-white"
                  )}>
                    {tx.type === 'income' ? '+' : '-'}{currencySymbol}{Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <ArrowUpRight className={cn(
                    "w-4 h-4 ml-auto mt-1",
                    tx.type === 'income' ? "text-accent" : "text-white/20"
                  )} />
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-8 text-white/20 italic">No transactions yet</div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
