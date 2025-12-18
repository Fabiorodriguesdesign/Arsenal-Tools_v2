import React from 'react';
// FIX: Replaced missing BannerArrowIcon with the standard Icon component.
import { Icon } from '../icons';

interface EbookBannerProps {
    href: string;
    title: string;
    description: string;
}

const EbookBanner: React.FC<EbookBannerProps> = ({ href, title, description }) => {
  const accentColor = '#f59e0b'; // Amber

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative w-full max-w-3xl mx-auto bg-[#09090b] border border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 active:scale-[0.99]"
    >
        {/* Barra Lateral Gradiente */}
        <div 
            className="absolute top-0 left-0 w-1.5 h-full opacity-80 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(to bottom, #fbbf24, #b45309)` }}
        ></div>
        
        {/* Glow Effect Sutil no Fundo */}
        <div 
            className="absolute -top-24 -right-24 w-48 h-48 blur-[120px] opacity-10 rounded-full transition-opacity duration-500"
            style={{ backgroundColor: accentColor }}
        ></div>

        {/* Icon Container */}
        <div className="flex-shrink-0 relative z-10">
            <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all duration-500 shadow-lg"
                style={{ backgroundColor: `${accentColor}15` }}
            >
                <Icon name="book-open" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg" style={{ color: accentColor }} />
            </div>
        </div>

        {/* Text Content */}
        <div className="flex-grow text-center sm:text-left z-10 flex flex-col justify-center gap-2">
            <div className="flex justify-center sm:justify-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-1 rounded w-fit border border-[#f59e0b]/20">
                    Ebook
                </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-[#f59e0b] transition-colors duration-300">
                {title}
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-medium max-w-md">
                {description}
            </p>
        </div>

        {/* Action Button - Seta */}
        <div className="flex-shrink-0 relative z-10 mt-2 sm:mt-0">
             <div 
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-45deg] group-hover:shadow-lg"
             >
                 <style>{`
                    .group:hover .ebook-arrow-container {
                        background-color: ${accentColor};
                        border-color: ${accentColor};
                    }
                    .group:hover .ebook-arrow-icon {
                        color: black;
                    }
                 `}</style>
                <div className="ebook-arrow-container w-full h-full rounded-full flex items-center justify-center border border-transparent transition-colors">
                    {/* FIX: Replaced BannerArrowIcon with Icon component */}
                    <Icon name="arrow-right" className="ebook-arrow-icon w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 transition-colors duration-300" />
                </div>
             </div>
        </div>
    </a>
  );
};

export default EbookBanner;
