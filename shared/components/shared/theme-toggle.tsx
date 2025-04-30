'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../providers/theme-provider';
import { cn } from '@/shared/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Theme toggle button for switching between light and dark-purple themes.
 *
 * @param className - Additional class names for the toggle button.
 *
 * @returns A button that toggles the app theme.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
        isDarkPurple
          ? 'bg-white text-purple-800 hover:bg-gray-100 shadow-md shadow-purple-800/20'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        className,
      )}
      aria-label="Toggle theme"
    >
      {isDarkPurple ? (
        <Sun size={18} className="transition-transform duration-300" />
      ) : (
        <Moon size={18} className="transition-transform duration-300" />
      )}
    </button>
  );
};
