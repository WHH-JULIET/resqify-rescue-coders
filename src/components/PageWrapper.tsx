import { ReactNode } from 'react';
import { AuraBackground } from './AuraBackground';
import { BottomNav } from './BottomNav';

interface PageWrapperProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export function PageWrapper({ children, showNav = true, className = '' }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <AuraBackground />
      <div className={`relative z-10 min-h-screen flex flex-col ${className}`}>
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}
