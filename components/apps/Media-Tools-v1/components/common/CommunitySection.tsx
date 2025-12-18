
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Icon } from '@/components/icons';

const CommunitySection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="mt-24 sm:mt-32">
        <div className="max-w-5xl mx-auto">
            <div className="bg-zinc-900 rounded-3xl p-6 sm:p-12 border border-zinc-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl shadow-black/20">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#25D366] to-[#ff0e00]"></div>
                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-[#25D366]/10 rounded-2xl flex items-center justify-center text-[#25D366]">
                    <div className="w-12 h-12 md:w-14 md:h-14">
                        <Icon name="whatsapp" className="w-full h-full" />
                    </div>
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-2">{t('orderTitle')}</h2>
                    <p className="text-zinc-400 text-base md:text-lg mb-6 leading-relaxed">{t('orderDesc')}</p>
                    <a href="https://chat.whatsapp.com/DtrBDKWF62OLm9cbw2qslV" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-3 bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#25D366]/40">
                        <img alt="A Ordem Logo" className="w-6 h-6 mr-3 rounded-full border-2 border-white/30" src="https://i.imgur.com/D3BmF6g.png" />
                        {t('orderButton')}
                    </a>
                </div>
            </div>
        </div>
    </section>
  );
};

export default CommunitySection;
