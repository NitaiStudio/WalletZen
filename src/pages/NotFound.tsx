import PageTransition from '@/components/PageTransition';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageTransition className="flex flex-col items-center justify-center p-8 text-center h-screen">
      <h1 className="text-9xl font-black text-white/5 absolute -z-10">404</h1>
      <h2 className="text-3xl font-bold mb-4">Lost in Space?</h2>
      <p className="text-white/50 text-lg mb-12">The page you're looking for doesn't exist in our financial universe.</p>
      <Button onClick={() => navigate('/dashboard')} className="w-full max-w-xs">
        Back to Safety
      </Button>
    </PageTransition>
  );
}
