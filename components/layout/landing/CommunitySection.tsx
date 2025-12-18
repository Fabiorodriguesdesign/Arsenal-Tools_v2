import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { WhatsappGroupIcon } from '../../shared/Icons';

const CommunitySection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="mt-20 sm:mt-28 animate-fadeIn">
        <div className="max-w-4xl mx-auto bg-light-card dark:bg-dark-card rounded-2xl p-8 md:p-12 border border-light-border dark:border-dark-border flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#25D366] to-primary"></div>
        
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-[#25D366]/10 rounded-2xl flex items-center justify-center text-[#25D366]">
            <div className="w-12 h-12 md:w-14 md:h-14">
                <WhatsappGroupIcon />
            </div>
        </div>
        
        <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text mb-2">{t('landing.community.title')}</h2>
            <p className="text-light-muted dark:text-dark-muted text-base md:text-lg mb-6 leading-relaxed">{t('landing.community.subtitle')}</p>
            
            <a 
                href="https://chat.whatsapp.com/DtrBDKWF62OLm9cbw2qslV" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#25D366]/40"
            >
                <img src="https://i.imgur.com/D3BmF6g.png" alt="A Ordem Logo" className="w-6 h-6 mr-3 rounded-full border-2 border-white/30" loading="lazy" decoding="async" />
                {t('landing.community.join')}
            </a>
        </div>
        </div>
    </section>
  );
};

export default CommunitySection;