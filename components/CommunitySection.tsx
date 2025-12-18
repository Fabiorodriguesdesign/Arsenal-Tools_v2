
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { WhatsappGroupIcon, Icon } from './icons';

const CommunitySection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-8 pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
      <a 
        href="https://chat.whatsapp.com/DtrBDKWF62OLm9cbw2qslV" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative w-full max-w-3xl mx-auto bg-light-card dark:bg-[#09090b] border border-neutral-200 dark:border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden transition-all duration-500 hover:border-green-500/20 dark:hover:border-white/10 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 active:scale-[0.99]"
      >
          {/* Barra Lateral Gradiente */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#25D366] to-[#075E54] opacity-80 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Glow Effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#25D366] blur-[120px] opacity-10 dark:opacity-5 group-hover:opacity-15 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-full"></div>

          {/* Icon Container */}
          <div className="flex-shrink-0 relative z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500/5 dark:bg-[#25D366]/5 rounded-3xl flex items-center justify-center border border-green-500/10 dark:border-[#25D366]/10 group-hover:bg-green-500/10 dark:group-hover:bg-[#25D366]/10 group-hover:border-green-500/20 dark:group-hover:border-[#25D366]/30 transition-all duration-500 shadow-[0_0_40px_-10px_rgba(37,211,102,0.1)] group-hover:shadow-[0_0_50px_-10px_rgba(37,211,102,0.3)]">
                  <WhatsappGroupIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[#25D366] drop-shadow-lg" />
              </div>
          </div>

          {/* Text Content */}
          <div className="flex-grow text-center sm:text-left z-10 flex flex-col justify-center gap-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight group-hover:text-[#25D366] transition-colors duration-300">
                  {t('communityTitle')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-medium max-w-md">
                  {t('communitySubtitle')}
              </p>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0 relative z-10 mt-4 sm:mt-0">
              <div 
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-base rounded-full transition-all duration-300 transform group-hover:-translate-y-1 shadow-lg group-hover:shadow-[#25D366]/40"
              >
                  <img src="https://i.imgur.com/D3BmF6g.png" alt="A Ordem Logo" className="w-5 h-5 mr-2.5 rounded-full border-2 border-white/30" />
                  {t('communityJoin')}
              </div>
          </div>
      </a>
    </section>
  );
};

export default React.memo(CommunitySection);