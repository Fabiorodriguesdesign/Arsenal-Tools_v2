
import React from 'react';
import { BehanceBannerIcon, Icon } from '../icons';

interface BehanceBannerProps {
    href: string;
    title: string;
    description: string;
}

const BehanceBanner: React.FC<BehanceBannerProps> = ({ href, title, description }) => {
  const accentColor = '#1769ff'; // Behance Blue

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative w-full max-w-3xl mx-auto bg-light-card dark:bg-[#09090b] border border-light-border dark:border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden transition-all duration-500 hover:border-blue-500/20 dark:hover:border-white/10 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 active:scale-[0.99]"
    >
        {/* Barra Lateral Gradiente */}
        <div 
            className="absolute top-0 left-0 w-1.5 h-full opacity-80 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(to bottom, ${accentColor}, #0011ff)` }}
        ></div>
        
        {/* Glow Effect */}
        <div 
            className="absolute -top-24 -right-24 w-48 h-48 blur-[120px] opacity-10 dark:opacity-5 group-hover:opacity-15 dark:group-hover:opacity-10 transition-opacity duration-500"
            style={{ backgroundColor: accentColor }}
        ></div>

        {/* Icon Container */}
        <div className="flex-shrink-0 relative z-10">
            <div 
                className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-500/5 rounded-3xl flex items-center justify-center border border-blue-500/10 dark:border-white/5 group-hover:border-blue-500/20 dark:group-hover:border-white/10 transition-all duration-500 shadow-lg"
                style={{ backgroundColor: `rgba(23, 105, 255, 0.05)` }}
            >
                <BehanceBannerIcon className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg" style={{ color: accentColor }} />
            </div>
        </div>

        {/* Text Content */}
        <div className="flex-grow text-center sm:text-left z-10 flex flex-col justify-center gap-2">
            <div className="flex justify-center sm:justify-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1769ff] bg-[#1769ff]/10 px-2 py-1 rounded w-fit border border-[#1769ff]/20 mb-1">
                    Portfólio
                </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-light-text dark:text-white tracking-tight group-hover:text-[#1769ff] transition-colors duration-300">
                {title}
            </h3>
            <p className="text-light-muted dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-medium max-w-md">
                {description}
            </p>
        </div>

        {/* Action Button - Seta Giratória */}
        <div className="flex-shrink-0 relative z-10 mt-2 sm:mt-0">
             <div 
                className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5 border border-light-border dark:border-white/10 backdrop-blur-md transition-all duration-500 group-hover:bg-neutral-200/60 dark:group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110 shadow-sm group-hover:shadow-lg"
             >
                 <style>{`
                    .group:hover .behance-arrow-icon {
                        color: ${accentColor};
                    }
                 `}</style>
                <div className="behance-arrow-container w-full h-full rounded-full flex items-center justify-center border border-transparent transition-colors">
                    <Icon name="arrow-right" className="behance-arrow-icon w-6 h-6 sm:w-7 sm:h-7 text-light-muted dark:text-zinc-400 transition-all duration-500 group-hover:-rotate-45" />
                </div>
             </div>
        </div>
    </a>
  );
};

export default BehanceBanner;