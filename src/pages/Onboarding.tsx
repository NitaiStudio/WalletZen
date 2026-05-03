import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import PageTransition from '@/components/PageTransition';
import Button from '@/components/ui/Button';
import { Wallet, PieChart, ShieldCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: "Track with Ease",
    description: "Keep tabs on every penny you spend with our intuitive and smooth interface.",
    icon: <Wallet className="w-12 h-12 text-primary" />,
    color: "from-primary/20 to-primary/0"
  },
  {
    title: "Smart Analytics",
    description: "Get deep insights into your spending habits with beautiful animated charts.",
    icon: <PieChart className="w-12 h-12 text-secondary" />,
    color: "from-secondary/20 to-secondary/0"
  },
  {
    title: "Secure & Native",
    description: "Your data is stored securely and works perfectly even when you're offline.",
    icon: <ShieldCheck className="w-12 h-12 text-accent" />,
    color: "from-accent/20 to-accent/0"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (currentStep === steps.length - 1) {
      navigate('/login');
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  return (
    <PageTransition className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-b ${steps[currentStep].color} flex items-center justify-center mb-12 shadow-inner border border-white/10`}>
              {steps[currentStep].icon}
            </div>
            
            <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              {steps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-12 flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep ? 'w-8 bg-primary' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={next}
          variant={currentStep === steps.length - 1 ? 'accent' : 'primary'}
          size="xl"
          className="w-full"
        >
          {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
          <ArrowRight className="ml-2 w-6 h-6" />
        </Button>
      </div>
    </PageTransition>
  );
}
