
import React from 'react';
import { WhatsappGroupIcon } from './icons';

const WhatsAppFloat: React.FC = () => {
  return (
    <a 
      href="https://wa.me/5514988386852"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 group flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] dark:focus-visible:ring-offset-neutral-950 rounded-full"
      aria-label="Falar no WhatsApp"
    >
      <div className="relative">
        {/* Pulsing rings */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping"></span>
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-pulse-soft delay-75"></span>
        
        {/* Main Button - Borda removida no dark mode para evitar contorno preto */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg shadow-[#25D366]/40 text-white transition-transform duration-300 group-hover:scale-110 group-active:scale-95 border-2 border-white dark:border-0">
            <WhatsappGroupIcon className="w-8 h-8" />
        </div>
      </div>
      
      {/* Tooltip on hover */}
      <span className="absolute left-full ml-3 px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white text-xs font-bold rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none transform translate-x-[-10px] group-hover:translate-x-0">
         Fale Comigo
      </span>
    </a>
  );
};

export default WhatsAppFloat;