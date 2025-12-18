import React, { useState } from 'react';
import { TabId } from '../apps/kit-freelancer_v1/types';
import { useTranslation } from '../apps/kit-freelancer_v1/hooks/useTranslation';
import LanguageToggle from '../shared/LanguageToggle';
import Footer from './Footer';
import { CoffeeIcon } from '../shared/Icons';
import HeroSection from './landing/HeroSection';
import ToolsGrid from './landing/ToolsGrid';
import DeveloperSection from './landing/DeveloperSection';
import CommunitySection from './landing/CommunitySection';
import SEO from '../shared/SEO';

interface LandingPageProps {
  onNavigateToToolkit: () => void;
  onNavigateToTool: (tabId: TabId) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToToolkit, onNavigateToTool }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen flex flex-col">
      <SEO titleKey="app.title" descriptionKey="app.description" />
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-end items-center gap-3">
          <a
            href="https://ko-fi.com/fabiorodriguesdsgn"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-bg transition-colors"
            aria-label={t('landing.support.coffee.aria')}
          >
            <CoffeeIcon className="w-6 h-6" />
          </a>
          <LanguageToggle className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border" />
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12 sm:pb-20 flex-grow">
        <HeroSection 
          onNavigateToToolkit={onNavigateToToolkit} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ToolsGrid 
          onNavigateToTool={onNavigateToTool} 
          searchQuery={searchQuery}
        />
        <DeveloperSection />
        <CommunitySection />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;