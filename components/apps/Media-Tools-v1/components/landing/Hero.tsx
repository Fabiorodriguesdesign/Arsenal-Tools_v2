
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeroProps {
  onViewTools: () => void;
}

const Hero: React.FC<HeroProps> = ({ onViewTools }) => {
  const { t } = useLanguage();
  return (
    <section className="text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-100 tracking-tight">
            {t('heroTitle1')} <span className="text-[#ff0e00]">{t('heroTitle2')}</span>
        </h2>
        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-zinc-400">
            {t('heroSubtitle')}
        </p>
        <div className="mt-10">
            <button
                onClick={onViewTools}
                className="inline-block bg-[#ff0e00] text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 ease-out transform hover:-translate-y-0.5 active:translate-y-0 hover:shadow-xl active:scale-95 shadow-lg shadow-[#ff0e00]/30 hover:bg-[#e00c00] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff0e00] dark:focus-visible:ring-offset-zinc-950"
            >
                {t('viewTools')}
            </button>
        </div>
    </section>
  );
};

export default Hero;
