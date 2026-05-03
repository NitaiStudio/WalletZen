import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.4
      }}
      className={cn("w-full min-h-screen relative z-10", className)}
    >
      {children}
    </motion.div>
  );
}
