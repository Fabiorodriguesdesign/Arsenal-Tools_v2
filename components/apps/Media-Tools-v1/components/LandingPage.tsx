
import React from 'react';
import { Tab } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Hero from './landing/Hero';
import Features from './landing/Features';
import Tools from './landing/Tools';
import DeveloperSection from './common/DeveloperSection';
import CommunitySection from './common/CommunitySection';
import { Icon } from '@/components/icons';

interface LandingPageProps {
  onNavigateToTool: (tabId: Tab) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToTool }) => {
    const { t } = useLanguage();
    
    const handleViewTools = () => {
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleBackToArsenal = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.hash = ''; 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col">
            <main className="pt-24 sm:pt-32 pb-16 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Hero onViewTools={handleViewTools} />
                    <Features />
                    <Tools onNavigateToTool={onNavigateToTool} />
                    <DeveloperSection />
                    <CommunitySection />
                </div>
            </main>
            <footer className="text-center py-8 mt-12 border-t border-zinc-800 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-5">
                    <button 
                        onClick={handleBackToArsenal}
                        className="inline-flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:focus:ring-offset-zinc-950"
                    >
                        <Icon name="arrow-left" className="w-5 h-5" />
                        {t('backToArsenal')}
                    </button>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-sm text-zinc-500">
                        <a href="https://fabiorodriguesdesign.com" target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-300 hover:text-[#ff0e00] transition-colors">Fabio Rodrigues Design</a>
                        <span className="hidden sm:inline text-zinc-700">|</span>
                         <a href="https://www.instagram.com/fabiorodriguesdsgn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-medium text-zinc-300 hover:text-[#ff0e00] transition-colors">
                            <Icon name="instagram" className="w-4 h-4" />
                            @fabiorodriguesdsgn
                         </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;