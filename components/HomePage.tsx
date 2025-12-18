


import React, { useState, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import FAQ from './FAQ';
import BackToTopButton from './BackToTopButton';
import { SiteContent, Tool, BioLinkCategory } from '../types';
import { FAQ_DATA_PT, FAQ_DATA_EN } from '../data/faq';
import { useLanguage } from '../contexts/LanguageContext';
import { useTools } from '../contexts/ToolContext';
import { useModal } from '../contexts/ModalContext';
import { useLeads } from '../contexts/LeadContext';
// FIX: Changed to a named import to resolve module resolution error where the default export was not being found.
import { BioHub } from './BioHub';
import { INTERNAL_TOOLS_PT, INTERNAL_TOOLS_EN } from '../data/internal_tools';
import CommunitySection from './CommunitySection';
import { ToolsGridSkeleton } from './ui/ToolsSkeletons';
import { useAuth } from '../contexts/AuthContext';
import SocialChannelsCarousel from './SocialChannelsCarousel';
import { useToolAccess } from '../hooks/useToolAccess';
import { useFavorites } from '../hooks/useFavorites';

// Modular Components
import NoResults from './home/NoResults';
import FavoritesWidget from './home/FavoritesWidget';
import HomeToolSection from './home/HomeToolSection';
import PremiumToolSection from './home/PremiumToolSection';
import ContactSection from './home/ContactSection';

interface HomePageProps {
    logo: string;
    siteContent: SiteContent;
    initialCategory?: BioLinkCategory;
}

const normalizeText = (text: string) => {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const HomePage: React.FC<HomePageProps> = ({ logo, siteContent, initialCategory = 'design' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { tools: dbTools, isLoading } = useTools(); 
  const { openModal } = useModal();
  const { handleAddLead } = useLeads();
  const { language, t } = useLanguage();
  const { isLoggedIn } = useAuth(); 
  const { checkAccess } = useToolAccess(); 
  const { favorites } = useFavorites();
  
  const faqItems = useMemo(() => language === 'pt' ? FAQ_DATA_PT : FAQ_DATA_EN, [language]);
  
  const handleToolInteraction = (tool: Tool) => {
      const { hasAccess } = checkAccess(tool);

      if (hasAccess) {
          if (tool.internalRoute) {
               window.location.hash = tool.internalRoute.startsWith('#') ? tool.internalRoute : `#${tool.internalRoute}`;
          } else if (tool.learnMoreUrl) {
               window.open(tool.learnMoreUrl, '_blank', 'noopener,noreferrer');
          } else {
               openModal('leadCapture', { tool, onAddLead: handleAddLead });
          }
      } else {
          // For locked premium tools, open the lead capture form as requested.
          openModal('leadCapture', { tool, onAddLead: handleAddLead });
      }
  };

  const handleNavigate = (route: string) => {
      window.location.hash = route.startsWith('#') ? route : `#${route}`;
  };

  const allTools = useMemo(() => {
      if (dbTools.length > 0) return dbTools;
      
      const internalTools = language === 'pt' ? INTERNAL_TOOLS_PT : INTERNAL_TOOLS_EN;
      return internalTools;
  }, [dbTools, language]);

  // Favoritos Logic
  const favoriteToolsData = useMemo(() => {
    return allTools.filter(t => favorites.includes(String(t.id)));
  }, [favorites, allTools]);


  const { kitFreelancerTools, mediaTools, premiumTools, hasResults } = useMemo(() => {
    const normalizedSearchTerm = normalizeText(searchTerm);
    
    // 1. Filter by search term
    const filtered = allTools.filter(tool => 
        normalizeText(tool.name).includes(normalizedSearchTerm) ||
        normalizeText(tool.description || '').includes(normalizedSearchTerm) ||
        normalizeText(tool.category || '').includes(normalizedSearchTerm)
    );

    // 2. Separate into categories and SORT ALPHABETICALLY (Case-Insensitive)
    
    // Kit Freelancer: Must contain correct route
    const kit = filtered
        .filter(t => t.internalRoute?.includes('kit-freelancer'))
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    // Media Tools: Must contain correct route
    const media = filtered
        .filter(t => t.internalRoute?.includes('media-tools'))
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    // Premium: Must be premium AND NOT belong to the above apps (external/standalone tools)
    const premium = filtered
        .filter(t => 
            t.type === 'premium' && 
            !t.internalRoute?.includes('kit-freelancer') && 
            !t.internalRoute?.includes('media-tools')
        )
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    return { 
        kitFreelancerTools: kit,
        mediaTools: media,
        premiumTools: premium,
        hasResults: filtered.length > 0
    };
  }, [allTools, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-light-bg dark:bg-neutral-950 transition-colors duration-300 relative">
      <Header logo={logo} />
      
      <main className="w-full max-w-[1920px]">
        <BioHub 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            initialCategory={initialCategory} 
        />
        
        {/* Top Widgets Section */}
        {!searchTerm && (
            <div className="container mx-auto px-4 md:px-8 lg:px-12 mb-12 -mt-4 z-20 relative space-y-6">
                <FavoritesWidget 
                    tools={favoriteToolsData} 
                    onNavigate={handleNavigate} 
                    onSelect={handleToolInteraction} 
                />
            </div>
        )}

        <div className="relative w-full flex justify-center -mt-8 mb-8 z-10 pointer-events-none">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
        </div>

        {isLoading ? (
          <ToolsGridSkeleton />
        ) : !hasResults ? (
            <div className="container mx-auto px-4 md:px-8 lg:px-12 pb-24">
                <NoResults searchTerm={searchTerm} />
            </div>
        ) : (
          <div className="pb-24 space-y-24 md:space-y-32">
            
            <HomeToolSection 
                id="kit-freelancer-tools"
                title="Kit Freelancer"
                description={t('app.kit-freelancer.description')}
                tools={kitFreelancerTools}
                onNavigate={handleNavigate}
                onSelect={handleToolInteraction}
                onTitleClick={() => handleNavigate('/app/kit-freelancer')}
            />

            <HomeToolSection 
                id="media-tools-tools"
                title="Ferramentas de Mídia"
                description={t('app.media-tools.description')}
                tools={mediaTools}
                onNavigate={handleNavigate}
                onSelect={handleToolInteraction}
                onTitleClick={() => handleNavigate('/app/media-tools')}
            />

            <PremiumToolSection 
                tools={premiumTools}
                siteContent={siteContent}
                isLoggedIn={isLoggedIn}
                onNavigate={handleNavigate}
                onSelect={handleToolInteraction}
                onOpenModal={(modalType) => openModal(modalType as any)}
            />

          </div>
        )}
        
         <section id="faq" className="py-16 md:py-20 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-4xl">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('faqTitle')}</h2>
              <p className="mt-3 md:mt-4 max-w-2xl mx-auto text-base md:text-lg text-neutral-600 dark:text-neutral-400">{t('faqSubtitle')}</p>
            </div>
            <FAQ items={faqItems} />
          </div>
        </section>

        <ContactSection siteContent={siteContent} t={t} />

        <SocialChannelsCarousel />
        <CommunitySection />
      </main>
      
      <Footer />
      <BackToTopButton />
      
    </div>
  );
};

export default HomePage;
