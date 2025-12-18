
import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIZED_TABS } from '../constants';
import { Tab } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Icon } from '@/components/icons';
import ThemeToggle from '../../../../ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
  setActiveTab: (id: Tab) => void;
  language: 'pt' | 'en';
  toggleLanguage: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, activeTab, setActiveTab, language, toggleLanguage }) => {
  const { t } = useLanguage();
  const mobileMenuRef = useRef<HTMLElement>(null);
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(() => {
    const activeCategory = CATEGORIZED_TABS.find(cat => cat.items.some(item => item.id === activeTab));
    return activeCategory ? activeCategory.nameKey : CATEGORIZED_TABS[0]?.nameKey;
  });

  const translatedCategories = CATEGORIZED_TABS.map(category => ({
    ...category,
    items: category.items.map(item => ({...item, label: t(`${item.id}Label`)}))
  }));

  useEffect(() => {
    const mobileMenuNode = mobileMenuRef.current;
    if (!mobileMenuNode || !isOpen) return;

    const focusableElements = mobileMenuNode.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }
        } else {
            if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }
        }
    };
    mobileMenuNode.addEventListener('keydown', handleKeyDown);
    return () => { mobileMenuNode.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen]);

  const handleTabClick = (tabId: Tab) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose} 
        aria-hidden="true" 
      />
      
      <aside ref={mobileMenuRef} className={`fixed top-0 left-0 h-full w-72 bg-light-card dark:bg-zinc-900 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-zinc-800">
            <h2 className="font-semibold text-light-text dark:text-zinc-200">{t('navigation')}</h2>
            <button 
                type="button"
                onClick={onClose} 
                className="p-2 rounded-md text-light-muted dark:text-zinc-400 hover:text-light-text dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue dark:focus:ring-offset-zinc-900" 
                aria-label={t('closeMenu')}
            >
                <Icon name="x" className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-grow p-2 space-y-1 overflow-y-auto">
            {translatedCategories.map(category => (
              <div key={category.nameKey} className="py-1">
                <button 
                  type="button"
                  onClick={() => setOpenMobileCategory(openMobileCategory === category.nameKey ? null : category.nameKey)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-semibold transition-colors duration-150 text-light-text dark:text-zinc-200 hover:bg-light-border dark:hover:bg-zinc-800"
                  aria-expanded={openMobileCategory === category.nameKey}
                  aria-controls={`mobile-menu-${category.nameKey}`}
                >
                  <span>{t(category.nameKey)}</span>
                  <Icon name="chevron-down" className={`w-5 h-5 transition-transform duration-300 ${openMobileCategory === category.nameKey ? 'rotate-180' : ''}`} />
                </button>
                <div id={`mobile-menu-${category.nameKey}`} className={`pl-4 mt-1 space-y-1 border-l-2 border-light-border dark:border-zinc-800 ml-3 overflow-hidden transition-all duration-300 ease-in-out ${openMobileCategory === category.nameKey ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {category.items.map(tab => (
                       <button 
                        type="button"
                        key={tab.id} 
                        onClick={() => handleTabClick(tab.id)} 
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-150 ${ activeTab === tab.id ? 'bg-gradient-accent text-white' : 'text-light-text dark:text-zinc-200 hover:bg-light-border dark:hover:bg-zinc-800' }`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                       >
                        <Icon name={tab.icon} className="w-6 h-6" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </nav>
            <div className="p-4 mt-auto border-t dark:border-zinc-800">
                <div className="flex items-center justify-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={toggleLanguage}
                        className="inline-flex items-center justify-center w-10 h-10 bg-neutral-100 dark:bg-zinc-800 text-light-muted dark:text-zinc-400 text-xs font-bold rounded-full transition-all"
                    >
                        {language.toUpperCase()}
                    </button>
                </div>
            </div>
        </div>
      </aside>
    </>
  );
};

export default MobileMenu;