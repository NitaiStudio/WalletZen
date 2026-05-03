import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/utils/cn';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'glass';
}

export default function GlassCard({ children, className, variant = 'glass', ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-3xl p-6 transition-all duration-300",
        variant === 'glass' && "glass",
        variant === 'light' && "bg-white/20 border border-white/20",
        variant === 'dark' && "glass-dark",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
