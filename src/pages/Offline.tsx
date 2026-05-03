import PageTransition from '@/components/PageTransition';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { WifiOff } from 'lucide-react';

export default function Offline() {
  const navigate = useNavigate();

  return (
    <PageTransition className="flex flex-col items-center justify-center p-8 text-center h-screen">
      <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10">
        <WifiOff className="w-12 h-12 text-white/20" />
      </div>
      <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
      <p className="text-white/50 text-lg mb-12">Don't worry, WalletZen stores your data locally. You can still track your expenses!</p>
      <Button onClick={() => navigate('/dashboard')} className="w-full max-w-xs">
        Go to Dashboard
      </Button>
    </PageTransition>
  );
}
