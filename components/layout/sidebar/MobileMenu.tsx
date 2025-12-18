import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIZED_TABS } from '../../apps/kit-freelancer_v1/constants';
import { TabId } from '../../apps/kit-freelancer_v1/types';
import { useTranslation } from '../../apps/kit-freelancer_v1/hooks/useTranslation';
import { CloseIcon, ChevronDownIcon, EnterFullscreenIcon, ExitFullscreenIcon, CoffeeIcon } from '../../shared/Icons';
import ThemeToggle from '../ThemeToggle';
import LanguageToggle from '../../shared/LanguageToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
  onGoToLanding: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
    isOpen, 
    onClose, 
    activeTab, 
    setActiveTab, 
    onGoToLanding,
    isDarkMode,
    toggleDarkMode,
    isFullscreen,
    toggleFullscreen
}) => {
  const { t } = useTranslation();
  const mobileMenuRef = useRef<HTMLElement>(null);
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(() => {
    const activeCategory = CATEGORIZED_TABS.find(cat => cat.items.some(item => item.id === activeTab));
    return activeCategory ? activeCategory.nameKey : CATEGORIZED_TABS[0]?.nameKey;
  });

  // Focus trap for mobile menu
  useEffect(() => {
    const mobileMenuNode = mobileMenuRef.current;
    if (!mobileMenuNode || !isOpen) return;

    const focusableElements = mobileMenuNode.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    mobileMenuNode.addEventListener('keydown', handleKeyDown);

    return () => {
        mobileMenuNode.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose} 
        aria-hidden="true" 
      />
      
      <aside ref={mobileMenuRef} className={`fixed top-0 left-0 h-full w-72 bg-light-card dark:bg-dark-card z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b dark:border-dark-border">
            <h2 className="font-bold text-lg text-light-text dark:text-dark-text">{t('header.tools')}</h2>
            <button 
                type="button"
                onClick={onClose} 
                className="p-2 rounded-full text-light-muted hover:bg-light-border dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-card" 
                aria-label={t('header.menu.close')}
            >
                <CloseIcon />
            </button>
          </div>
          
          <nav className="flex-grow p-2 space-y-1 overflow-y-auto">
            <button 
              type="button"
              onClick={onGoToLanding} 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-bold text-primary hover:bg-light-border dark:hover:bg-dark-border transition-colors mb-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
            </button>
            {CATEGORIZED_TABS.map(category => (
              <div key={category.nameKey} className="py-1">
                <button 
                  type="button"
                  onClick={() => setOpenMobileCategory(openMobileCategory === category.nameKey ? null : category.nameKey)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-semibold transition-colors duration-150 text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border"
                  aria-expanded={openMobileCategory === category.nameKey}
                  aria-controls={`mobile-menu-${category.nameKey}`}
                >
                  <span>{t(category.nameKey)}</span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${openMobileCategory === category.nameKey ? 'rotate-180' : ''}`} />
                </button>
                <div id={`mobile-menu-${category.nameKey}`} className={`pl-4 mt-1 space-y-1 border-l-2 border-light-border dark:border-dark-border ml-3 overflow-hidden transition-all duration-300 ease-in-out ${openMobileCategory === category.nameKey ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {category.items.map(tab => (
                       <button 
                        type="button"
                        key={tab.id} 
                        onClick={() => handleTabClick(tab.id)} 
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-150 ${ activeTab === tab.id ? 'bg-primary text-white' : 'text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border' }`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                       >
                        <div className="w-6 h-6" aria-hidden="true">{tab.icon}</div>
                        <span>{t(tab.nameKey)}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 mt-auto border-t dark:border-dark-border">
            <div className="flex items-center justify-center gap-4">
               <a href="https://ko-fi.com/fabiorodriguesdsgn" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-card" aria-label={t('landing.support.coffee.aria')}>
                  <CoffeeIcon />
               </a>
               <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
               <button type="button" onClick={toggleFullscreen} className="p-2 rounded-full text-light-muted hover:bg-light-border dark:hover:bg-dark-border dark:text-dark-muted" aria-label={t(isFullscreen ? 'header.fullscreen.exit' : 'header.fullscreen.enter')}>
                  {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
              </button>
               <LanguageToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileMenu;