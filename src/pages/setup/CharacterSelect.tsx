import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, characters } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import charactersImg from '@/assets/characters.jpg';

export default function CharacterSelect() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleContinue = () => {
    navigate('/setup/layout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 py-8 overflow-y-auto">
      <div className="flex-1 max-w-md mx-auto w-full">
        {/* Header Image */}
        <div className="mb-6 animate-fade-in">
          <img
            src={charactersImg}
            alt="Choose your character"
            className="w-full rounded-2xl shadow-card"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-2xl font-bold text-foreground">Choose Your Guardian</h1>
          <p className="text-muted-foreground mt-2">
            Pick a character to personalize your app theme
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setTheme(char.id)}
              className={cn(
                'relative p-5 rounded-2xl border-2 transition-all duration-300',
                'hover:shadow-card active:scale-[0.98]',
                theme === char.id
                  ? 'border-primary bg-accent shadow-card'
                  : 'border-border bg-card'
              )}
            >
              {theme === char.id && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check size={14} className="text-primary-foreground" />
                </div>
              )}
              
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3"
                style={{ backgroundColor: char.color }}
              />
              
              <p className="font-semibold text-foreground text-center">
                {char.name}
              </p>
              
              <div
                className="mt-2 h-1 rounded-full mx-auto w-12"
                style={{ backgroundColor: char.color }}
              />
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="w-full animate-fade-in"
          size="lg"
          style={{ animationDelay: '0.3s' }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
