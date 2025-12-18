
import React from 'react';
import { Icon, IconName } from './icons';

interface BioLinkBannerProps {
    href: string;
    title: string;
    description: string;
    iconName: IconName | string; // Aceita nome do ícone ou URL de imagem
    accentColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
}

const BioLinkBanner: React.FC<BioLinkBannerProps> = ({ 
    href, 
    title, 
    description, 
    iconName,
    accentColor = '#FFFFFF',
    gradientFrom = '#ffffff',
    gradientTo = '#ffffff'
}) => {
  const isImage = iconName.includes('/') || iconName.includes('.');
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
      className="group relative w-full bg-[#09090b] border border-white/5 rounded-[1.5rem] p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-xl hover:shadow-black/50 active:scale-[0.99] cursor-pointer"
    >
        {/* Barra Lateral Gradiente */}
        <div 
            className="absolute top-0 left-0 w-1 h-full opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})` }}
        ></div>
        
        {/* Glow Effect Sutil no Fundo */}
        <div 
            className="absolute -top-10 -right-10 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full pointer-events-none"
            style={{ backgroundColor: accentColor }}
        ></div>

        {/* Icon Container */}
        <div className="flex-shrink-0 relative z-10">
            <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all duration-500 shadow-lg"
                style={{ backgroundColor: `${accentColor}15` }} // 15% opacity hex
            >
                {isImage ? (
                     <img 
                        src={iconName} 
                        alt={title} 
                        className="w-8 h-8 object-contain" 
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <Icon name={iconName as any} className="w-8 h-8 drop-shadow-md" style={{ color: accentColor }} />
                )}
            </div>
        </div>

        {/* Text Content */}
        <div className="flex-grow text-center sm:text-left z-10 flex flex-col justify-center gap-1">
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[var(--hover-color)] transition-colors duration-300" style={{ '--hover-color': accentColor } as React.CSSProperties}>
                {title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                {description}
            </p>
        </div>

        {/* Action Button - Seta */}
        <div className="flex-shrink-0 relative z-10 mt-2 sm:mt-0">
             <div 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{ '--hover-bg': accentColor, '--hover-border': accentColor } as React.CSSProperties}
             >
                 {/* Estilo inline para hover complexo */}
                 <style>{`
                    .group:hover .arrow-container {
                        background-color: ${accentColor};
                        border-color: ${accentColor};
                    }
                    .group:hover .arrow-icon {
                        color: black; /* Ou branco dependendo do contraste */
                    }
                 `}</style>
                <div className="arrow-container w-full h-full rounded-full flex items-center justify-center border border-transparent transition-colors">
                    <Icon name="arrow-right" className="arrow-icon w-4 h-4 text-zinc-500 transition-all duration-300 group-hover:-rotate-45" />
                </div>
             </div>
        </div>
    </a>
  );
};

export default BioLinkBanner;
