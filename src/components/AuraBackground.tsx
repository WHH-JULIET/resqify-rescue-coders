import { useTheme } from '@/contexts/ThemeContext';

export function AuraBackground() {
  const { character } = useTheme();
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary aura */}
      <div 
        className="absolute top-[-20%] right-[-10%] w-[60%] h-[50%] rounded-full blur-[120px] opacity-[0.08]"
        style={{ backgroundColor: character.color }}
      />
      {/* Secondary aura */}
      <div 
        className="absolute bottom-[-10%] left-[-15%] w-[50%] h-[40%] rounded-full blur-[100px] opacity-[0.06]"
        style={{ backgroundColor: character.color }}
      />
      {/* Accent ray */}
      <div 
        className="absolute top-[30%] left-[50%] w-[30%] h-[30%] rounded-full blur-[80px] opacity-[0.04]"
        style={{ backgroundColor: character.color }}
      />
    </div>
  );
}
