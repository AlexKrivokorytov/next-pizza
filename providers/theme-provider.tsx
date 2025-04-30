'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark-purple';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check for saved preference or use system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark-purple', savedTheme === 'dark-purple');
    } else if (prefersDark) {
      setTheme('dark-purple');
      document.documentElement.classList.add('dark-purple');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark-purple' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark-purple', newTheme === 'dark-purple');
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

/**
 * Custom hook to access the current theme and toggle function from ThemeProvider.
 *
 * @returns The theme context with current theme and toggleTheme function.
 * @throws Error if used outside of ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
