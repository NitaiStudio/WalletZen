import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { useApp } from '@/contexts/AppContext';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'motion/react';

const categories = ['All', 'Income', 'Expense', 'Food', 'Transport', 'Shopping'];

export default function Transactions() {
  const { currencySymbol } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = useLiveQuery(
    () => {
      let q = db.transactions.orderBy('date').reverse();
      return q.toArray();
    }
  ) || [];

  const filteredTransactions = transactions.filter(tx => {
    const matchesCategory = activeCategory === 'All' || tx.type === activeCategory.toLowerCase() || tx.category === activeCategory;
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (id: number) => {
    await db.transactions.delete(id);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Activity</h2>
          <button className="w-10 h-10 glass rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:bg-white/10 focus:border-primary transition-all"
          />
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                activeCategory === cat 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-white/5 text-white/50 border border-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -100 }}
                  drag="x"
                  dragConstraints={{ left: -100, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80 && tx.id) {
                      handleDelete(tx.id);
                    }
                  }}
                  className="relative group cursor-grab active:cursor-grabbing"
                >
                  <div className="absolute inset-y-0 right-0 w-24 bg-red-500 rounded-3xl flex items-center justify-center text-white font-bold opacity-0 group-active:opacity-100 transition-opacity">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <GlassCard className="p-4 rounded-3xl flex items-center justify-between pr-4 relative overflow-hidden bg-background">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl">
                        {tx.type === 'income' ? '💰' : '💸'}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{tx.description}</p>
                        <p className="text-xs text-text/40">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-bold",
                        tx.type === 'income' ? "text-accent" : "text-text"
                      )}>
                        {tx.type === 'income' ? '+' : '-'}{currencySymbol}{Math.abs(tx.amount).toFixed(2)}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
            ))}
          </AnimatePresence>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-20 text-white/20">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
