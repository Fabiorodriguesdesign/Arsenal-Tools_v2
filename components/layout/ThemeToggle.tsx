import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { SunIcon, MoonIcon } from '../shared/Icons';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full text-light-muted hover:bg-light-border dark:hover:bg-dark-border dark:text-dark-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      aria-label={t('header.toggle.theme')}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default React.memo(ThemeToggle);