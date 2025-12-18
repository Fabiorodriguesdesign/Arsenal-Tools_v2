
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon } from './icons';
import { CONTACT_PHOTO_URL, SOCIAL_LINKS } from '../constants';

const DeveloperSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="mt-20 mb-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-12 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary/5 rounded-bl-full -z-0 pointer-events-none"></div>
                <div className="w-40 h-40 md:w-64 md:h-64 flex-shrink-0 relative z-10">
                    <img alt="Fabio Rodrigues" className="w-full h-full rounded-full object-cover border-4 border-neutral-100 dark:border-neutral-800 shadow-xl" src={CONTACT_PHOTO_URL} />
                    <div className="absolute bottom-2 right-2 w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg border-4 border-neutral-100 dark:border-neutral-800">
                        <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white animate-pulse scale-75">
                            <Icon name="pencil" className="h-5 w-5 md:h-6 md:h-6" />
                        </div>
                    </div>
                </div>
                <div className="flex-grow text-center md:text-left relative z-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('landing.developer.title')}</h2>
                    <p className="mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">{t('landing.developer.subtitle')}</p>
                    <div className="mt-8 flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                        <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-neutral-100 dark:bg-neutral-800 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95">
                            <Icon name="instagram" className="w-5 h-5" />@fabiorodriguesdsgn</a>
                        <a href={SOCIAL_LINKS.instagram_secondary} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-neutral-100 dark:bg-neutral-800 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95">
                            <Icon name="instagram" className="w-5 h-5" />@fabiodicastop</a>
                        <a href={SOCIAL_LINKS.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-neutral-100 dark:bg-neutral-800 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95">
                            <Icon name="globe" className="w-5 h-5" />fabiorodriguesdesign.com</a>
                    </div>
                    <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800/50 flex justify-center md:justify-start">
                        <a href={SOCIAL_LINKS.briefing} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold text-base rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl active:scale-95">
                            <Icon name="pencil" className="w-5 h-5 mr-2" /><span>{t('landing.developer.requestQuote')}</span></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default React.memo(DeveloperSection);
