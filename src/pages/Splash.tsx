import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.jpeg';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="animate-scale-in flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150" />
          <img
            src={logo}
            alt="ResQify Logo"
            className="relative w-36 h-36 rounded-full shadow-card object-cover"
          />
        </div>
        
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            ResQify
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Your Safety, Our Priority
          </p>
        </div>

        <div className="mt-8 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
