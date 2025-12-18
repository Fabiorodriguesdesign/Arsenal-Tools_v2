
import React from 'react';
import { Icon } from '../icons';

interface PackBannerProps {
    href: string;
    title: string;
    description: string;
}

const PackBanner: React.FC<PackBannerProps> = ({ href, title, description }) => {
  const accentColor = '#06b6d4'; // Cyan
  const isInternal = href.startsWith('#');

  const handleClick = (e: React.MouseEvent) => {
    if (isInternal) {
        e.preventDefault();
        window.location.hash = href;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <a 
      href={href} 
      target={isInternal ? "_self" : "_blank"}
      rel={isInternal ? undefined : "noopener noreferrer"}
      onClick={handleClick}
      className="group relative w-full max-w-3xl mx-auto bg-light-card dark:bg-[#09090b] border border-light-border dark:border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden transition-all duration-500 hover:border-cyan-500/20 dark:hover:border-white/10 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 active:scale-[0.99] cursor-pointer"
    >
        {/* Barra Lateral Gradiente */}
        <div 
            className="absolute top-0 left-0 w-1.5 h-full opacity-80 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(to bottom, #22d3ee, #0891b2)` }}
        ></div>
        
        {/* Glow Effect */}
        <div 
            className="absolute -top-24 -right-24 w-48 h-48 blur-[120px] opacity-10 dark:opacity-5 group-hover:opacity-15 dark:group-hover:opacity-10 transition-opacity duration-500"
            style={{ backgroundColor: accentColor }}
        ></div>

        {/* Icon Container */}
        <div className="flex-shrink-0 relative z-10">
            <div 
                className="w-20 h-20 sm:w-24 sm:h-24 bg-cyan-500/5 rounded-3xl flex items-center justify-center border border-cyan-500/10 dark:border-white/5 group-hover:border-cyan-500/20 dark:group-hover:border-white/10 transition-all duration-500 shadow-lg overflow-hidden"
            >
                <Icon name="pack-design" className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400 drop-shadow-lg" />
            </div>
        </div>

        {/* Text Content */}
        <div className="flex-grow text-center sm:text-left z-10 flex flex-col justify-center gap-2">
            <div className="flex justify-center sm:justify-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-1 rounded w-fit border border-[#06b6d4]/20 mb-1">
                    Premium
                </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-light-text dark:text-white tracking-tight group-hover:text-[#06b6d4] transition-colors duration-300">
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
                    .group:hover .pack-arrow-icon {
                        color: ${accentColor};
                    }
                 `}</style>
                <div className="pack-arrow-container w-full h-full rounded-full flex items-center justify-center border border-transparent transition-colors">
                    <Icon name="arrow-right" className="pack-arrow-icon w-6 h-6 sm:w-7 sm:h-7 text-light-muted dark:text-zinc-400 transition-all duration-500 group-hover:-rotate-45" />
                </div>
             </div>
        </div>
    </a>
  );
};

export default PackBanner;