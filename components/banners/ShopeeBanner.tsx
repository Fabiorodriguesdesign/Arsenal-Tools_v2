import React from 'react';
import { Icon } from '../icons';
import { useLanguage } from '../../contexts/LanguageContext';

const ShopeeBanner: React.FC = () => {
  const accentColor = '#ee4d2d'; // Shopee Orange
  const { t } = useLanguage();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = '#/app/shopee-finder';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a 
      href="#/app/shopee-finder"
      onClick={handleClick}
      className="group relative w-full max-w-3xl mx-auto bg-gradient-to-br from-[#1a1a1a] via-black to-[#1a1a1a] border border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden transition-all duration-500 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-900/40 active:scale-[0.99] cursor-pointer"
    >
        {/* Barra Lateral Gradiente */}
        <div 
            className="absolute top-0 left-0 w-1.5 h-full opacity-80 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(to bottom, #f05d40, #d02a0a)` }}
        ></div>
        
        {/* Glow Effect */}
        <div 
            className="absolute -top-24 -right-24 w-64 h-64 blur-[120px] opacity-20 rounded-full transition-opacity duration-500"
            style={{ backgroundColor: accentColor }}
        ></div>

        {/* Icon Container */}
        <div className="flex-shrink-0 relative z-10">
            <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center border border-white/5 group-hover:border-orange-500/30 transition-all duration-500 shadow-lg"
                style={{ backgroundColor: `rgba(238, 77, 45, 0.1)` }}
            >
                <Icon name="shopping-cart" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg" style={{ color: accentColor }} />
            </div>
        </div>

        {/* Text Content */}
        <div className="flex-grow text-center sm:text-left z-10 flex flex-col justify-center gap-2">
            <div className="flex justify-center sm:justify-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ee4d2d] bg-[#ee4d2d]/10 px-2 py-1 rounded w-fit border border-[#ee4d2d]/20 mb-1">
                    Ofertas
                </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-[#ee4d2d] transition-colors duration-300">
                {t('bio.shopee.title')}
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-medium max-w-md">
                {t('bio.shopee.description')}
            </p>
        </div>

        {/* Action Button - Seta Giratória Aumentada */}
        <div className="flex-shrink-0 relative z-10 mt-2 sm:mt-0">
             <div 
                className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110 shadow-sm group-hover:shadow-lg"
             >
                 <style>{`
                    .group:hover .shopee-arrow-icon {
                        color: ${accentColor};
                    }
                 `}</style>
                <div className="shopee-arrow-container w-full h-full rounded-full flex items-center justify-center border border-transparent transition-colors">
                    <Icon name="arrow-right" className="shopee-arrow-icon w-6 h-6 sm:w-7 sm:h-7 text-zinc-400 transition-all duration-500 group-hover:-rotate-45" />
                </div>
             </div>
        </div>
    </a>
  );
};

export default React.memo(ShopeeBanner);