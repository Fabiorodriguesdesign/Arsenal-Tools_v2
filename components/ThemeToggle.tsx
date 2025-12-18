
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './icons';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center w-10 h-10 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50 dark:focus-visible:ring-accent-purple/50 active:scale-95"
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      {theme === 'dark' ? (
        <Icon name="sun" className="w-5 h-5" />
      ) : (
        <Icon name="moon" className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;