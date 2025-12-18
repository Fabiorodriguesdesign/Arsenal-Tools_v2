
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Icon } from '@/components/icons';

const DeveloperSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="mt-24 sm:mt-32">
        <div className="max-w-5xl mx-auto">
            <div className="bg-zinc-900 rounded-3xl p-6 sm:p-12 shadow-2xl shadow-black/20 border border-zinc-800 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-[#ff0e00]/5 rounded-bl-full -z-0 pointer-events-none"></div>
                <div className="w-40 h-40 md:w-64 md:h-64 flex-shrink-0 relative z-10">
                    <img alt="Fabio Rodrigues" className="w-full h-full rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl" src="https://i.imgur.com/MaoShGg.jpeg" />
                    <div className="absolute bottom-2 right-2 w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-zinc-800">
                        <div className="w-full h-full bg-[#ff0e00] rounded-full flex items-center justify-center text-white animate-pulse scale-75">
                            <Icon name="pencil" className="h-5 w-5 md:h-6 md:h-6" />
                        </div>
                    </div>
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">{t('aboutTitle')}</h2>
                    <p className="mt-4 text-base md:text-lg text-zinc-400 leading-relaxed">{t('aboutDesc')}</p>
                    <div className="mt-8 flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                        <a href="https://www.instagram.com/fabiorodriguesdsgn/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-zinc-800 text-xs md:text-sm font-bold text-zinc-200 rounded-xl hover:bg-zinc-700 hover:text-[#ff0e00] transition-all transform hover:-translate-y-1 active:scale-95">
                            <Icon name="instagram" className="w-5 h-5" />@fabiorodriguesdsgn</a>
                        <a href="https://www.instagram.com/fabiodicastop/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-zinc-800 text-xs md:text-sm font-bold text-zinc-200 rounded-xl hover:bg-zinc-700 hover:text-[#ff0e00] transition-all transform hover:-translate-y-1 active:scale-95">
                            <Icon name="instagram" className="w-5 h-5" />@fabiodicastop</a>
                        <a href="https://fabiorodriguesdesign.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-zinc-800 text-xs md:text-sm font-bold text-zinc-200 rounded-xl hover:bg-zinc-700 hover:text-[#ff0e00] transition-all transform hover:-translate-y-1 active:scale-95">
                            <Icon name="globe" className="w-5 h-5" />fabiorodriguesdesign.com</a>
                        <a href="https://fabiorodriguesdesign.com.br/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-zinc-800 text-xs md:text-sm font-bold text-zinc-200 rounded-xl hover:bg-zinc-700 hover:text-[#ff0e00] transition-all transform hover:-translate-y-1 active:scale-95">
                            <Icon name="globe" className="w-5 h-5" />fabiorodriguesdesign.com.br</a>
                    </div>
                    <div className="mt-8 pt-8 border-t border-zinc-800/50 flex justify-center md:justify-start">
                        <a href="https://briefing.fabiorodriguesdesign.com.br/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-[#ff0e00] text-white font-bold text-base rounded-full shadow-lg shadow-[#ff0e00]/30 hover:bg-[#e00c00] transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl active:scale-95">
                            <Icon name="pencil" className="w-5 h-5 mr-2" /><span>{t('aboutButton')}</span></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default DeveloperSection;
