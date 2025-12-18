
import React from 'react';
import { Icon } from '../icons';

interface MentorshipBannerProps {
    href: string;
    title: string;
    description: string;
    iconName?: string;
}

const MentorshipBanner: React.FC<MentorshipBannerProps> = ({ href, title, description, iconName = "user" }) => {
  const accentColor = '#fbbf24'; // Amber/Gold

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative w-full max-w-3xl mx-auto bg-[#09090b] border border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden transition-all duration-500 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-900/20 active:scale-[0.99]"
    >
        {/* Barra Lateral Gradiente */}
        <div 
            className="absolute top-0 left-0 w-1.5 h-full opacity-80 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(to bottom, #fbbf24, #78350f)` }}
        ></div>
        
        {/* Glow Effect */}
        <div 
            className="absolute -top-24 -right-24 w-48 h-48 blur-[120px] opacity-5 rounded-full transition-opacity duration-500"
            style={{ backgroundColor: accentColor }}
        ></div>

        {/* Icon Container */}
        <div className="flex-shrink-0 relative z-10">
            <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center border border-white/5 group-hover:border-amber-500/30 transition-all duration-500 shadow-lg"
                style={{ backgroundColor: `rgba(251, 191, 36, 0.05)` }}
            >
                <Icon name={iconName} className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg text-amber-400" />
            </div>
        </div>

        {/* Text Content */}
        <div className="flex-grow text-center sm:text-left z-10 flex flex-col justify-center gap-2">
             <div className="inline-flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                    Premium
                </span>
             </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-medium max-w-md">
                {description}
            </p>
        </div>

        {/* Action Button - Seta Giratória */}
        <div className="flex-shrink-0 relative z-10 mt-2 sm:mt-0">
             <div 
                className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110 shadow-sm group-hover:shadow-lg"
             >
                 <style>{`
                    .group:hover .mentor-arrow-icon {
                        color: ${accentColor};
                    }
                 `}</style>
                <div className="mentor-arrow-container w-full h-full rounded-full flex items-center justify-center border border-transparent transition-colors">
                    <Icon name="arrow-right" className="mentor-arrow-icon w-6 h-6 sm:w-7 sm:h-7 text-zinc-400 transition-all duration-500 group-hover:-rotate-45" />
                </div>
             </div>
        </div>
    </a>
  );
};

export default MentorshipBanner;
