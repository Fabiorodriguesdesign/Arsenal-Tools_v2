
import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { InstagramIcon, GlobeIcon, EditIcon } from '../../shared/Icons';
import { SOCIAL_LINKS } from '@/constants';

const DeveloperSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="mt-16 sm:mt-24 animate-fadeIn">
        <div className="max-w-5xl mx-auto bg-light-card dark:bg-neutral-900 rounded-3xl p-6 sm:p-12 shadow-2xl shadow-neutral-200 dark:shadow-black/50 border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary/5 rounded-bl-full -z-0 pointer-events-none"></div>
            <div className="w-40 h-40 md:w-64 md:h-64 flex-shrink-0 relative z-10">
                <img alt="Fabio Rodrigues" className="w-full h-full rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-xl" src="https://i.imgur.com/MaoShGg.jpeg" loading="lazy" decoding="async" />
                <div className="absolute bottom-2 right-2 w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-neutral-800">
                    <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white animate-pulse scale-75">
                        <EditIcon className="h-5 w-5 md:h-6 md:h-6" />
                    </div>
                </div>
            </div>
            <div className="text-center md:text-left flex-grow relative z-10 w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('landing.developer.title')}</h2>
                <p className="mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">{t('landing.developer.subtitle')}</p>
                <div className="mt-8 flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                    <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-neutral-100 dark:bg-neutral-800 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95">
                        <InstagramIcon className="w-5 h-5" />
                        @fabiorodriguesdsgn
                    </a>
                    <a href={SOCIAL_LINKS.instagram_secondary} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-neutral-100 dark:bg-neutral-800 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95">
                            <InstagramIcon className="w-5 h-5" />
                        @fabiodicastop
                    </a>
                    <a href={SOCIAL_LINKS.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-neutral-100 dark:bg-neutral-800 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95">
                        <GlobeIcon className="w-5 h-5" />
                        fabiorodriguesdesign.com
                    </a>
                        <a href={SOCIAL_LINKS.website_br} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-neutral-100 dark:bg-neutral-800 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95">
                        <GlobeIcon className="w-5 h-5" />
                        fabiorodriguesdesign.com.br
                    </a>
                </div>
                <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800/50 flex justify-center md:justify-start">
                    <a href={SOCIAL_LINKS.briefing} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold text-base rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl active:scale-95">
                        <EditIcon className="w-5 h-5 mr-2" />
                        <span>{t('landing.developer.requestQuote')}</span>
                    </a>
                </div>
            </div>
        </div>
    </section>
  );
};

export default DeveloperSection;
