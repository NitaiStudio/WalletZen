import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, ArrowUpRight, ArrowDownLeft, Wallet, Tag, Calendar as CalIcon } from 'lucide-react';
import Button from './ui/Button';
import GlassCard from './ui/GlassCard';
import { cn } from '@/utils/cn';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { db } from '@/database/db';
import { syncTransactions } from '@/services/dbSync';
import { useState } from 'react';

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !description) return;
    setIsSaving(true);
    try {
      await db.transactions.add({
        amount: parseFloat(amount),
        description,
        type,
        category: 'General',
        date: Date.now(),
        synced: false
      });
      await syncTransactions();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-background border-t border-white/10 rounded-t-[40px] safe-bottom"
          >
            <div className="p-8 pb-12 space-y-8">
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2" />
              
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">New Transaction</h3>
                <button onClick={onClose} className="w-10 h-10 glass rounded-full flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Type Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setType('income')}
                  className={cn(
                    "p-4 rounded-3xl flex flex-col items-center gap-2 font-bold transition-all",
                    type === 'income' ? "bg-accent/10 border border-accent/20 text-accent" : "bg-white/5 border border-white/10 text-white/50"
                  )}
                >
                  <ArrowDownLeft className="w-6 h-6" />
                  Income
                </button>
                <button 
                  onClick={() => setType('expense')}
                  className={cn(
                    "p-4 rounded-3xl flex flex-col items-center gap-2 font-bold transition-all",
                    type === 'expense' ? "bg-primary/10 border border-primary/20 text-primary" : "bg-white/5 border border-white/10 text-white/50"
                  )}
                >
                  <ArrowUpRight className="w-6 h-6" />
                  Expense
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-white/20">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-3xl py-8 pl-12 pr-6 text-4xl font-black focus:bg-white/10 focus:border-primary transition-all text-center"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What is this for?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:bg-white/10 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full py-5 text-lg" size="lg" isLoading={isSaving}>
                Add Transaction
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
