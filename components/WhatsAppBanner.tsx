
import React from 'react';
import { WhatsappGroupIcon, Icon } from './icons';

const WhatsAppBanner: React.FC = () => {
  return (
    <a 
      href="https://chat.whatsapp.com/DtrBDKWF62OLm9cbw2qslV" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative w-full max-w-3xl mx-auto bg-white dark:bg-[#09090b] border border-neutral-200 dark:border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden transition-all duration-500 hover:border-green-500/20 dark:hover:border-white/10 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 active:scale-[0.99]"
    >
        {/* Barra Lateral Gradiente (Identidade Híbrida) */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#25D366] to-[#075E54] opacity-80 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Glow Effect Sutil no Fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#25D366] blur-[120px] opacity-10 dark:opacity-5 group-hover:opacity-15 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-full"></div>

        {/* Icon Container - Maior e mais destacado */}
        <div className="flex-shrink-0 relative z-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500/5 dark:bg-[#25D366]/5 rounded-3xl flex items-center justify-center border border-green-500/10 dark:border-[#25D366]/10 group-hover:bg-green-500/10 dark:group-hover:bg-[#25D366]/10 group-hover:border-green-500/20 dark:group-hover:border-[#25D366]/30 transition-all duration-500 shadow-[0_0_40px_-10px_rgba(37,211,102,0.1)] group-hover:shadow-[0_0_50px_-10px_rgba(37,211,102,0.3)]">
                <WhatsappGroupIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[#25D366] drop-shadow-lg" />
            </div>
        </div>

        {/* Text Content - Mais espaçado e legível */}
        <div className="flex-grow text-center sm:text-left z-10 flex flex-col justify-center gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight group-hover:text-[#25D366] transition-colors duration-300">
                Grupo VIP WhatsApp
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-medium max-w-md">
                Networking exclusivo para designers. Compartilhe ideias, tendências e evolua sua carreira.
            </p>
        </div>

        {/* Action Button - Seta Aumentada e com Rotação Fixa */}
        <div className="flex-shrink-0 relative z-10 mt-2 sm:mt-0">
             <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 group-hover:bg-[#25D366] group-hover:border-[#25D366] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#25D366]/20">
                <Icon name="arrow-right" className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-500 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-black transition-all duration-300 transform group-hover:-rotate-45" />
             </div>
        </div>
    </a>
  );
};

export default React.memo(WhatsAppBanner);