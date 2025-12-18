import React, { useRef, useEffect } from 'react';
import { TabId } from '../apps/kit-freelancer_v1/types';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from '../shared/LanguageToggle';
import { useTranslation } from '../apps/kit-freelancer_v1/hooks/useTranslation';
import { EnterFullscreenIcon, ExitFullscreenIcon, HamburgerIcon, CoffeeIcon } from '../shared/Icons';
import DesktopNav from './sidebar/DesktopNav';
import MobileMenu from './sidebar/MobileMenu';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  onGoToLanding: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isDarkMode, toggleDarkMode, isFullscreen, toggleFullscreen, isMobileMenuOpen, toggleMobileMenu, onGoToLanding }) => {
  const { t } = useTranslation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Return focus to menu button when mobile menu closes
  useEffect(() => {
    if (!isMobileMenuOpen && menuButtonRef.current) {
       // Optional: logic if we wanted to strictly enforce focus return
    }
  }, [isMobileMenuOpen]);
  
  return (
    <>
      <header className="sticky top-0 bg-light-card dark:bg-dark-card shadow-md z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={onGoToLanding}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onGoToLanding()}
              aria-label="Go to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <h1 className="text-lg sm:text-xl font-bold ml-2 text-light-text dark:text-dark-text group-hover:text-primary transition-colors">{t('header.title')}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-3">
                 <a 
                    href="https://ko-fi.com/fabiorodriguesdsgn" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-card shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                 >
                    <CoffeeIcon className="w-5 h-5"/>
                    <span>{t('header.support.coffee')}</span>
                 </a>
                <button onClick={toggleFullscreen} className="p-2 rounded-full text-light-muted hover:bg-light-border dark:hover:bg-dark-border dark:text-dark-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-card" aria-label={t(isFullscreen ? 'header.fullscreen.exit' : 'header.fullscreen.enter')}>
                    {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
                </button>
                <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <LanguageToggle />
              </div>
            
              <button 
                ref={menuButtonRef} 
                onClick={toggleMobileMenu} 
                className="p-2 rounded-full md:hidden text-light-muted hover:bg-light-border dark:hover:bg-dark-border dark:text-dark-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-card" 
                aria-label={t('header.menu.open')}
                aria-expanded={isMobileMenuOpen}
              >
                <HamburgerIcon />
              </button>
            </div>
          </div>
        </div>
      
        <DesktopNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </header>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={toggleMobileMenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGoToLanding={onGoToLanding}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />
    </>
  );
};

export default React.memo(Sidebar);