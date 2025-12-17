import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CharacterTheme = 'blue' | 'coral' | 'purple' | 'green';

interface Character {
  id: CharacterTheme;
  name: string;
  color: string;
}

export const characters: Character[] = [
  { id: 'blue', name: 'Bubbles', color: '#1355F0' },
  { id: 'coral', name: 'Blossom', color: '#E87A7A' },
  { id: 'purple', name: 'Violet', color: '#9B7ED9' },
  { id: 'green', name: 'Ivy', color: '#7CB342' },
];

interface ThemeContextType {
  theme: CharacterTheme;
  setTheme: (theme: CharacterTheme) => void;
  character: Character;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<CharacterTheme>(() => {
    const saved = localStorage.getItem('resqify-theme');
    return (saved as CharacterTheme) || 'blue';
  });

  const setTheme = (newTheme: CharacterTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('resqify-theme', newTheme);
  };

  useEffect(() => {
    // Apply theme class to document
    const root = document.documentElement;
    root.classList.remove('theme-blue', 'theme-coral', 'theme-purple', 'theme-green');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const character = characters.find(c => c.id === theme) || characters[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, character }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
