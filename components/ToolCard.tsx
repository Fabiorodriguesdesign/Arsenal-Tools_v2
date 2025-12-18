
import React, { useState, useEffect, useRef } from 'react';
import IconRenderer from './IconRenderer';
import { Tool } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useToolAccess } from '../hooks/useToolAccess';
import { Icon } from './icons';
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '../utils/shared';

interface ToolCardProps {
  tool: Tool;
  onSelect?: (tool: Tool) => void;
  onNavigate?: (route: string) => void; 
  style?: React.CSSProperties;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect, onNavigate, style }) => {
  const { t } = useLanguage();
  const { name, description, learnMoreUrl, internalRoute, id } = tool;
  const { isLocked } = useToolAccess().checkAccess(tool);
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(String(id));

  // Element Ref for intersection observer
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      { rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();
      
      if (isLocked) {
          if (onSelect) onSelect(tool);
          return;
      }

      if (internalRoute && onNavigate) {
          onNavigate(internalRoute);
      } else if (internalRoute) {
          window.location.hash = internalRoute.startsWith('#') ? internalRoute : `#${internalRoute}`;
      } else if (onSelect) {
          onSelect(tool);
      } else if (learnMoreUrl) {
          window.open(learnMoreUrl, '_blank', 'noopener,noreferrer');
      }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavorite(String(id));
  };

  const baseClasses = "group relative aspect-square rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ease-out transform border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple focus-visible:ring-offset-4 dark:focus-visible:ring-offset-neutral-950 outline-none";
  
  const freemiumClasses = `bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-accent-blue/40 dark:hover:border-accent-purple/40 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/50 cursor-pointer`;
  const lockedClasses = "bg-neutral-100 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 opacity-80 cursor-pointer hover:border-accent-purple/40 dark:hover:border-accent-purple/40 relative overflow-hidden";
  const premiumUnlockedClasses = "bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-accent-blue/60 dark:hover:border-accent-purple/60 hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/10 cursor-pointer relative";

  let computedClasses = freemiumClasses;
  if (isLocked) {
      computedClasses = lockedClasses;
  } else if (tool.type === 'premium') {
      computedClasses = premiumUnlockedClasses;
  }

  const ariaDescription = isLocked 
    ? `Ferramenta trancada: ${name}. Requer plano Pro.` 
    : `${name}. ${description || ''}. Clique para abrir.`;

  return (
    <div 
      ref={cardRef}
      style={style}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      className={cn(baseClasses, computedClasses)}
      aria-label={ariaDescription}
    >
      {/* Favorite Button */}
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-3 left-3 z-30 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group/fav focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        aria-label={isFav ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
        title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
          <Icon 
            name={isFav ? "star-filled" : "star"} 
            className={cn("w-4 h-4 transition-colors", isFav ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-700 group-hover/fav:text-yellow-400')} 
            aria-hidden="true"
          />
      </button>

      {/* Locked Overlay Icon */}
      {isLocked && (
          <div className="absolute top-3 right-3 z-20 bg-neutral-200 dark:bg-neutral-800 p-1.5 rounded-full shadow-sm text-neutral-500" aria-hidden="true">
              <Icon name="lock" className="w-4 h-4" />
          </div>
      )}

      {/* Tooltip Description on Hover (Desktop only) */}
      {description && (
        <div id={`desc-${id}`} className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-2 bg-neutral-900/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-neutral-900 text-xs text-center rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 hidden sm:block transform translate-y-2 group-hover:translate-y-0 scale-95 group-hover:scale-100 origin-bottom">
          {description}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900/90 dark:border-t-white/95"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
        {isInView ? (
          <div className={cn("p-3 md:p-4 rounded-2xl mb-3 transition-colors duration-300 border border-transparent", isLocked ? 'bg-neutral-100 dark:bg-neutral-800 grayscale opacity-70' : 'bg-neutral-50 dark:bg-neutral-800/50 group-hover:bg-white dark:group-hover:bg-neutral-800 group-hover:border-neutral-100 dark:group-hover:border-neutral-700')}>
            <IconRenderer icon={tool.icon} className={cn("w-8 h-8 md:w-10 md:h-10 transition-transform duration-300", isLocked ? 'text-neutral-400' : 'text-neutral-600 dark:text-neutral-400 group-hover:scale-110 group-hover:text-accent-blue dark:group-hover:text-accent-purple')} />
          </div>
        ) : (
          <div className="w-10 h-10 md:w-14 md:h-14 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-4 animate-pulse"></div>
        )}
        
        <h3 className={cn("font-bold text-sm md:text-base transition-colors duration-300 leading-tight px-1 line-clamp-2 min-h-9 md:min-h-10 flex items-center justify-center", isLocked ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-700 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white')}>
            {name}
        </h3>
      </div>
    </div>
  );
};

export default React.memo(ToolCard);