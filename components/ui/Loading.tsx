
import React from 'react';
import { cn } from '../../utils/shared';
import { Spinner } from './Spinner';
import { LogoIcon } from '../icons';
import { MAIN_LOGO_SVG } from '../../constants';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = false, 
  text = "Carregando...", 
  className 
}) => {
  const content = (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      <div className="relative mb-4">
        {/* Logo estático ou animado */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-center p-3 animate-pulse-soft">
           <LogoIcon logo={MAIN_LOGO_SVG} className="w-full h-full" />
        </div>
      </div>
      <div className="flex items-center gap-3 text-primary">
        <Spinner size="md" />
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{text}</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 z-50 transition-colors duration-300">
        {content}
      </div>
    );
  }

  return content;
};
