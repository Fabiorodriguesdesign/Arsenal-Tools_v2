
import React from 'react';
import { useZenMode } from '../contexts/ZenModeContext';
import { Icon } from './icons';

const ZenModeFloat: React.FC = () => {
  const { isZenMode, disableZenMode } = useZenMode();

  if (!isZenMode) return null;

  return (
    <button
      onClick={disableZenMode}
      className="fixed bottom-6 right-6 z-[60] group flex items-center justify-center bg-white/90 dark:bg-neutral-900/90 text-black dark:text-white p-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in border border-neutral-300 dark:border-neutral-700"
      title="Sair do Modo Zen"
    >
      <Icon name="minimize" className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-bold group-hover:ml-2">
        Sair do Modo Zen
      </span>
    </button>
  );
};

export default ZenModeFloat;