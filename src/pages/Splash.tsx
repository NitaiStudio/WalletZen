import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import PageTransition from '@/components/PageTransition';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 4500); // Extended for visual impact
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageTransition className="flex flex-col items-center justify-center p-8 text-center h-screen">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 100,
          damping: 20,
          delay: 0.5
        }}
        className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-[40px] flex items-center justify-center shadow-2xl relative mb-8"
      >
        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-110" />
        <span className="text-5xl font-black text-white italic">W</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h1 className="text-4xl font-bold tracking-tighter mb-2">WalletZen</h1>
        <p className="text-white/60 text-lg">Track Smart. Save Better.</p>
      </motion.div>

      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-white/40 text-sm mb-4 flex flex-col items-center"
        >
          <span>Developed by Nitai Studio</span>
          <span>Made in India 🇮🇳</span>
        </motion.div>
        
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>
    </PageTransition>
  );
}
