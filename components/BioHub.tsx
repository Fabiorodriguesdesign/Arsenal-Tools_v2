

import React, { useState, useMemo, useEffect } from 'react';
import { BioLinkCategory } from '../types';
import { useBioLinks } from '../contexts/BioLinkContext';
import LoadingSpinner from './ui/LoadingSpinner';
import { Icon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import WhatsAppBanner from './WhatsAppBanner';
import BehanceBanner from './banners/BehanceBanner';
import PsdBanner from './banners/PsdBanner';
import PackBanner from './banners/PackBanner';
import BlogBanner from './banners/BlogBanner';
import EbookMarketingBanner from './banners/EbookMarketingBanner';
import CommunityBanner from './banners/CommunityBanner';
import MentorshipBanner from './banners/MentorshipBanner';
import DeusBibliaBanner from './banners/DeusBibliaBanner';
import AtividadesBiblicasBanner from './banners/AtividadesBiblicasBanner';
import RendaExtraBanner from './banners/RendaExtraBanner';
import ShopeeBanner from './banners/ShopeeBanner';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../utils/shared';

interface BioHubProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  initialCategory?: BioLinkCategory;
}

export const BioHub: React.FC<BioHubProps> = ({ searchTerm, onSearchChange, initialCategory = 'design' }) => {
  const { getLinksByCategory, isLoading } = useBioLinks();
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const [activeCategory, setActiveCategory] = useState<BioLinkCategory>(initialCategory);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
      if (initialCategory) {
          setActiveCategory(initialCategory);
      }
  }, [initialCategory]);

  useEffect(() => {
      const handleScroll = () => {
          if (window.scrollY > 100) {
              setShowScrollIndicator(false);
          } else {
              setShowScrollIndicator(true);
          }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = getLinksByCategory(activeCategory);

  const profileConfig = useMemo(() => ({
    design: {
      name: 'Fábio Rodrigues',
      handle: '@fabiorodriguesdsgn',
      instagramUrl: 'https://www.instagram.com/fabiorodriguesdsgn/',
      photoUrl: 'https://i.imgur.com/MaoShGg.jpeg', 
      description: 'Designer Gráfico | Identidade Visual | Web Design',
      accentColor: theme === 'light' ? 'text-accent-blue' : 'text-white',
    },
    marketing: {
      name: 'Fábio Dicas Top',
      handle: '@fabiodicastop',
      instagramUrl: 'https://www.instagram.com/fabiodicastop/',
      photoUrl: 'https://i.imgur.com/MaoShGg.jpeg',
      description: 'Marketing Digital | Estratégias | YouTube',
      accentColor: 'text-primary',
    }
  }), [theme]);

  const config = profileConfig[activeCategory] || profileConfig['design'];

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const scrollToSearch = () => {
      const searchInput = document.getElementById('hub-search');
      if (searchInput) {
          // Pequeno ajuste para o scroll não ficar colado no topo
          const y = searchInput.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
          searchInput.focus();
      }
  };

  const handleToolCategoryClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const quickAccessButtons = [
    { labelKey: 'app.kit-freelancer.title', sectionId: 'kit-freelancer-tools' },
    { labelKey: 'app.media-tools.title', sectionId: 'media-tools-tools' }
  ];


  return (
    <div className={cn('relative shadow-2xl z-10 overflow-visible flex flex-col transition-colors duration-700 ease-in-out',
        'dark:text-white text-light-text',
        activeCategory === 'design' 
          ? 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-neutral-900 dark:via-[#1a1a1a] dark:to-neutral-950'
          : 'bg-gradient-to-br from-red-50/30 via-red-100/40 to-red-200/40 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-black'
    )}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50 dark:opacity-30">
          <div className={cn('absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen transition-colors duration-700', activeCategory === 'design' ? 'bg-accent-blue/10 dark:bg-blue-900/40' : 'bg-primary/10 dark:bg-red-900/40')}></div>
          <div className={cn('absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] mix-blend-screen transition-colors duration-700', activeCategory === 'design' ? 'bg-accent-purple/10 dark:bg-purple-900/30' : 'bg-orange-500/10 dark:bg-orange-900/30')}></div>
      </div>

      <div className="container mx-auto px-4 pt-32 sm:pt-40 lg:pt-48 pb-24 relative z-10 flex flex-col items-center flex-grow">
        
        <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="flex flex-col items-center text-center mb-6">
                {/* Foto de Perfil Maior (Mantido w-48) */}
                <div className="relative mb-6 group">
                    <div className={`absolute -inset-1 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500 ${activeCategory === 'design' ? 'bg-gradient-accent' : 'bg-gradient-to-r from-orange-500 to-red-600'}`}></div>
                    <img 
                        src={config.photoUrl} 
                        alt={config.name} 
                        className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-neutral-200 dark:border-neutral-900 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                </div>

                {/* Nome */}
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{config.name}</h1>
                
                {/* Botões de Ação (Minimalistas) */}
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                    <a 
                        href={config.instagramUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cn(`inline-flex items-center gap-1.5 text-xs md:text-sm font-medium ${config.accentColor}`, 'dark:bg-white/5 bg-black/5 hover:bg-black/10 dark:hover:bg-white/10 dark:border-white/10 border-black/10 px-3 py-1.5 rounded-full transition-all hover:scale-105 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue dark:focus-visible:ring-offset-black')}
                    >
                        <Icon name="instagram" className="w-3.5 h-3.5" />
                        {config.handle}
                    </a>
                    
                    <button 
                        onClick={scrollToSearch}
                        className={`inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-white bg-gradient-accent hover:opacity-90 border border-transparent px-4 py-1.5 rounded-full transition-all hover:scale-105 shadow-md hover:shadow-purple-500/20 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue dark:focus-visible:ring-offset-black`}
                        aria-label="Explorar Ferramentas"
                    >
                         <Icon name="toolbox" className="w-3.5 h-3.5" />
                         <span>Apps</span>
                    </button>
                </div>

                <p className="dark:text-neutral-300 text-light-muted text-sm md:text-base max-w-md leading-relaxed">{config.description}</p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-10 w-full max-w-md">
                <div className="flex flex-wrap justify-center gap-2 p-1 bg-white/60 dark:bg-neutral-900/80 backdrop-blur-md rounded-full border border-neutral-200 dark:border-neutral-800 shadow-inner">
                    <button 
                        onClick={() => setActiveCategory('design')}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue dark:focus-visible:ring-offset-black ${activeCategory === 'design' ? 'bg-white dark:bg-white text-black shadow-lg scale-105' : 'text-neutral-500 dark:text-neutral-400 hover:text-light-text dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
                    >
                        Design Estratégico
                    </button>
                    <button 
                        onClick={() => setActiveCategory('marketing')}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-black ${activeCategory === 'marketing' ? 'bg-primary text-white shadow-lg scale-105' : 'text-neutral-500 dark:text-neutral-400 hover:text-light-text dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
                    >
                        Arte, IA & Fé
                    </button>
                    <button 
                        onClick={() => window.location.hash = '#/sobre'}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 text-neutral-500 dark:text-neutral-400 hover:text-light-text dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue dark:focus-visible:ring-offset-black`}
                    >
                        Sobre Mim
                    </button>
                </div>
            </div>

            <div className="w-full mb-10 flex flex-col gap-5 items-center">
                {isLoading ? (
                     <div className="col-span-full flex justify-center py-8">
                        <LoadingSpinner className="w-8 h-8 text-neutral-500 dark:text-white/50" />
                     </div>
                ) : (
                    <>
                        {links.length > 0 ? (
                            links.map((link) => {
                                const titleLower = link.title.toLowerCase();
                                const translatedTitle = link.titleKey ? t(link.titleKey) : link.title;
                                const translatedDesc = link.descriptionKey ? t(link.descriptionKey) : (link.description || '');

                                // Componentes Especiais por Título (Hard Mapping)
                                if (titleLower.includes('shopee')) return <ShopeeBanner key={link.id} />;
                                if (titleLower.includes('whatsapp')) return <WhatsAppBanner key={link.id} />;

                                if (activeCategory === 'design') {
                                    if (titleLower.includes('behance')) return <BehanceBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    if (titleLower.includes('psd')) return <PsdBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    if (titleLower.includes('pack') && !titleLower.includes('ebook')) return <PackBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    if (titleLower.includes('blog')) return <BlogBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    
                                    // Ebook Design
                                    if (titleLower.includes('ebook') && titleLower.includes('lucrativos')) {
                                        return <EbookMarketingBanner 
                                            key={link.id} 
                                            href={link.destination_url} 
                                            title={translatedTitle} 
                                            description={translatedDesc} 
                                            iconName={!link.image_url.startsWith('http') ? link.image_url : undefined}
                                            imageUrl={link.image_url.startsWith('http') ? link.image_url : undefined} 
                                        />;
                                    }
                                } else if (activeCategory === 'marketing') {
                                    if (titleLower.includes('atividades')) return <AtividadesBiblicasBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    if (titleLower.includes('renda extra')) return <RendaExtraBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    
                                    if (titleLower.includes('fé, deus e bíblia')) return <BlogBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    if (titleLower.includes('blog')) return <BlogBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    if (titleLower.includes('deus') || titleLower.includes('bíblia')) return <DeusBibliaBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    
                                    // Ebook Marketing
                                    if (titleLower.includes('lucrativos')) {
                                        return <EbookMarketingBanner 
                                            key={link.id} 
                                            href={link.destination_url} 
                                            title={translatedTitle} 
                                            description={translatedDesc} 
                                            iconName={!link.image_url.startsWith('http') ? link.image_url : undefined}
                                            imageUrl={link.image_url.startsWith('http') ? link.image_url : undefined} 
                                        />;
                                    }

                                    if (titleLower.includes('comunidade')) return <CommunityBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                    if (titleLower.includes('mentoria')) return <MentorshipBanner key={link.id} href={link.destination_url} title={translatedTitle} description={translatedDesc} />;
                                }
                                return null;
                            })
                        ) : (
                            <div className="col-span-full text-center py-6 bg-black/5 dark:bg-white/5 rounded-xl border border-dashed border-neutral-400/20 dark:border-white/5 w-full max-w-3xl">
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Nenhum destaque disponível nesta categoria.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>

        <div className="w-full max-w-xl relative z-30 px-2 sm:px-0">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue/30 to-accent-purple/30 dark:from-primary/50 dark:to-orange-500/50 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative">
                    <label htmlFor="hub-search" className="sr-only">{t('searchPlaceholder')}</label>
                    <input
                        id="hub-search"
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-neutral-300 dark:border-white/10 focus-visible:border-accent-blue dark:focus-visible:border-accent-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/20 dark:focus-visible:ring-accent-purple/20 rounded-full shadow-xl text-light-text dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 text-base font-medium transition-all duration-300 focus:bg-white/80 dark:focus:bg-white/15"
                    />
                    <Icon name="search" className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 dark:text-neutral-400 group-focus-within:text-accent-blue dark:group-focus-within:text-accent-purple transition-colors" />
                    
                    {searchTerm && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full text-neutral-600/70 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label="Limpar busca"
                        >
                            <Icon name="x" className="w-4 h-4" />
                        </button>
                    )}
                </div>
             </div>
             
             <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 animate-fade-in">
                {quickAccessButtons.map((button) => (
                  <button
                    key={button.sectionId}
                    onClick={() => handleToolCategoryClick(button.sectionId)}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/60 dark:bg-white/10 backdrop-blur-md border border-neutral-200 dark:border-white/10 text-light-text dark:text-white hover:bg-white/90 dark:hover:bg-white/20 hover:border-neutral-300 dark:hover:border-white/20 transition-all shadow-sm active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  >
                    {t(button.labelKey)}
                  </button>
                ))}
             </div>
        </div>

        {showScrollIndicator && !searchTerm && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-pulse-soft pointer-events-none">
                <span className="text-xs font-medium text-light-muted dark:text-dark-muted">Scroll</span>
                <Icon name="chevron-down" className="w-4 h-4 text-light-muted dark:text-dark-muted" />
            </div>
        )}
    </div>
    </div>
  );
};
