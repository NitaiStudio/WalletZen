import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { useApp } from '@/contexts/AppContext';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import TransactionModal from '@/components/TransactionModal';
import { Search, Filter, Calendar, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';

const categories = ['All', 'Income', 'Expense', 'Food', 'Transport', 'Shopping'];

interface TransactionItemProps {
  tx: any;
  currencySymbol: string;
  onDelete: (id: number) => void;
  onEdit: (tx: any) => void;
}

function TransactionItem({ tx, currencySymbol, onDelete, onEdit }: TransactionItemProps) {
  const x = useMotionValue(0);
  const [isSwiped, setIsSwiped] = useState(false);
  const dragConstraintsRef = useRef(null);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -40) {
      setIsSwiped(true);
    } else {
      setIsSwiped(false);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-3xl" ref={dragConstraintsRef}>
      {/* Background Action: Delete */}
      <div className="absolute inset-y-0 right-0 p-1 flex justify-end items-center pr-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            tx.id && onDelete(tx.id);
          }}
          className="w-20 h-full bg-red-500/20 border border-red-500/30 rounded-2xl flex flex-col items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <Trash2 className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Delete</span>
        </button>
      </div>

      {/* Foreground Transaction Card */}
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -100 }}
        dragElastic={0.05}
        style={{ x }}
        onDragEnd={handleDragEnd}
        animate={{ x: isSwiped ? -100 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className="relative z-10 cursor-grab active:cursor-grabbing"
        onClick={() => !isSwiped && onEdit(tx)}
      >
        <GlassCard className="p-4 rounded-3xl flex items-center justify-between pr-4 bg-background border border-white/5 active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              {tx.type === 'income' ? '💰' : '💸'}
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight text-white/90">{tx.description}</p>
              <p className="text-[10px] uppercase font-bold text-text/30 tracking-widest leading-none mt-1">
                {tx.category} • {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right flex items-center gap-2">
            <div className="text-right">
              <p className={cn(
                "font-bold text-sm tabular-nums",
                tx.type === 'income' ? "text-accent" : "text-white"
              )}>
                {tx.type === 'income' ? '+' : '-'}{currencySymbol}{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <Edit2 className="w-3 h-3 text-white/10 group-hover:text-white/30 transition-colors" />
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default function Transactions() {
  const { currencySymbol } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const transactions = useLiveQuery(
    () => {
      return db.transactions.orderBy('date').reverse().toArray();
    }
  ) || [];

  const filteredTransactions = transactions.filter(tx => {
    const matchesCategory = activeCategory === 'All' || tx.type === activeCategory.toLowerCase() || tx.category === activeCategory;
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await db.transactions.delete(deletingId);
      setDeletingId(null);
    }
  };

  const handleEdit = (tx: any) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter">Activity</h2>
            <p className="text-xs text-text/40 font-medium">Keep track of every cent</p>
          </div>
          <button className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <Calendar className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-12 pr-12 focus:bg-white/10 focus:border-primary/50 transition-all outline-none"
          />
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                activeCategory === cat 
                  ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                  : "bg-white/5 text-white/40 border-white/5 hover:border-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <TransactionItem 
                  tx={tx} 
                  currencySymbol={currencySymbol} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTransactions.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white/10" />
              </div>
              <p className="text-white/20 font-bold">No transactions found</p>
              <p className="text-[10px] uppercase tracking-widest text-white/10 mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </div>

        {/* Tip for swiping */}
        {filteredTransactions.length > 0 && (
          <p className="text-[10px] text-center text-text/20 font-black uppercase tracking-[0.2em] pt-4">
            Swipe left on items to action
          </p>
        )}

        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          transaction={editingTransaction}
        />

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deletingId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeletingId(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative glass p-6 rounded-[2.5rem] w-full max-w-sm border border-white/10 shadow-2xl"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black italic tracking-tighter text-center mb-2">Delete Transaction?</h3>
                <p className="text-sm text-text/40 text-center mb-8 px-4">
                  This action cannot be undone. Every cent counts in your journey!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 py-4 glass rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all active:scale-95"
                  >
                    Delete Now
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
