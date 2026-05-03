import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { Target, Plus, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import Button from '@/components/ui/Button';
import { useApp } from '@/contexts/AppContext';

const goals = [
  { id: 1, title: 'Dream Home', target: 250000, current: 85000, color: 'bg-primary' },
  { id: 2, title: 'New Car', target: 45000, current: 12000, color: 'bg-secondary' },
  { id: 3, title: 'Europe Trip', target: 12000, current: 8400, color: 'bg-accent' },
];

export default function Goals() {
  const { currencySymbol } = useApp();
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Saving Goals</h2>
          <button onClick={() => alert('New Goal Creation coming soon!')} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-primary active:scale-90 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <GlassCard className="bg-primary/10 border-primary/20 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/50 text-xs">Total Goals Progress</p>
            <p className="text-xl font-bold">32% Completed</p>
          </div>
          <button className="ml-auto p-2 glass rounded-lg">
            <ChevronRight className="w-5 h-5 text-white/40" />
          </button>
        </GlassCard>

        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <GlassCard key={goal.id} className="p-6 space-y-4 shadow-lg active:scale-[0.99] transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-primary">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="font-bold">{goal.title}</span>
                  </div>
                  <span className="text-xs font-bold text-white/40">{currencySymbol}{goal.current.toLocaleString()} / {currencySymbol}{goal.target.toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${goal.color} shadow-lg shadow-primary/20`}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Progress</span>
                    <span className="text-xs font-black">{Math.round(progress)}%</span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <Button variant="glass" className="w-full py-5 border-dashed border-2 hover:border-primary transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Create New Goal
        </Button>
      </div>
    </MainLayout>
  );
}
