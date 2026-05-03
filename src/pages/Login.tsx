import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import PageTransition from '@/components/PageTransition';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { Mail, Lock, User, Github, Chrome as Google } from 'lucide-react';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Real login logic here if needed, but we'll focus on Google for fintech ease
    navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error: any) {
      // Ignore if user closed the popup
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30"
          >
            <span className="text-2xl font-black text-white italic">W</span>
          </motion.div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-white/50">Login to your WalletZen account</p>
        </div>

        <GlassCard className="mb-6 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:bg-white/10 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:bg-white/10 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-sm text-primary hover:underline">Forgot password?</button>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="relative h-px bg-white/10 my-8">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a2235] px-4 text-xs text-white/40 uppercase tracking-widest">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="glass" className="py-3" onClick={handleGoogleLogin}>
              <Google className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button variant="glass" className="py-3">
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>
        </GlassCard>

        <p className="text-center text-white/50 text-sm">
          Don't have an account? <Link to="/register" className="text-primary font-bold">Sign Up</Link>
        </p>
      </div>
    </PageTransition>
  );
}
