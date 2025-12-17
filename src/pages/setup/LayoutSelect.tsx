import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Grid3X3, Minimize2, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type LayoutStyle = 'classic' | 'minimal' | 'cards';

const layouts: { id: LayoutStyle; name: string; description: string; icon: typeof Grid3X3 }[] = [
  { id: 'classic', name: 'Classic', description: 'Traditional grid with large SOS button', icon: Grid3X3 },
  { id: 'minimal', name: 'Minimal', description: 'Clean design with essential actions', icon: Minimize2 },
  { id: 'cards', name: 'Cards', description: 'Card-based layout for quick access', icon: LayoutGrid },
];

export default function LayoutSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<LayoutStyle>(() => {
    return (localStorage.getItem('resqify-layout') as LayoutStyle) || 'classic';
  });

  const handleContinue = () => {
    localStorage.setItem('resqify-layout', selected);
    navigate('/setup/profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 py-8 overflow-y-auto">
      <div className="flex-1 max-w-md mx-auto w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-border" />
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Choose Your Layout</h1>
          <p className="text-muted-foreground mt-2">
            Select how you want your home screen to look
          </p>
        </div>

        {/* Layout Options */}
        <div className="space-y-4 mb-8">
          {layouts.map((layout, index) => {
            const Icon = layout.icon;
            return (
              <button
                key={layout.id}
                onClick={() => setSelected(layout.id)}
                className={cn(
                  'w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left',
                  'hover:shadow-card active:scale-[0.99] animate-fade-in',
                  selected === layout.id
                    ? 'border-primary bg-accent'
                    : 'border-border bg-card'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                      selected === layout.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{layout.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {layout.description}
                    </p>
                  </div>
                  
                  {selected === layout.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check size={14} className="text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <Button onClick={handleContinue} className="w-full" size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
