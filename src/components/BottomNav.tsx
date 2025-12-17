import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Users, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/contacts', icon: Users, label: 'Contacts' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'nav-item flex-1 max-w-[72px]',
                isActive && 'nav-item-active'
              )}
            >
              <Icon
                size={22}
                className={cn(
                  'transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
