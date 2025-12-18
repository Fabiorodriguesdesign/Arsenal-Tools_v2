
import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIZED_TABS } from '../constants';
import { Tab } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Icon } from '@/components/icons';

interface DesktopNavProps {
  activeTab: Tab;
  setActiveTab: (id: Tab) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropdown = (categoryKey: string) => {
    setOpenDropdown(prev => (prev === categoryKey ? null : categoryKey));
  };

  // Keyboard Navigation for Dropdowns
  useEffect(() => {
    if (!openDropdown) return;

    const menu = document.getElementById(`desktop-menu-${openDropdown}`);
    if (!menu) return;

    const menuItems = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
    if (menuItems.length === 0) return;

    menuItems[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement;
      const currentIndex = menuItems.findIndex(item => item === activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % menuItems.length;
        menuItems[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        menuItems[prevIndex].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        const categoryKey = openDropdown; // Capture before state change
        setOpenDropdown(null);
        triggerRefs.current[categoryKey]?.focus();
      } else if (e.key === 'Tab') {
        setOpenDropdown(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openDropdown]);

  const handleTabClick = (tabId: Tab) => {
    setActiveTab(tabId);
    setOpenDropdown(null);
  };

  const translatedCategories = CATEGORIZED_TABS.map(category => ({
    ...category,
    items: category.items.map(item => ({...item, label: t(`${item.id}Label`)}))
  }));

  return (
    <nav ref={navRef} className="hidden lg:flex bg-light-card/80 dark:bg-zinc-950/80 backdrop-blur-sm border-t border-light-border dark:border-zinc-800 justify-center sticky top-16 z-30" aria-label="Navegação secundária">
      <div className="flex items-center space-x-1 p-2">
        {translatedCategories.map((category) => {
           const isCategoryActive = category.items.some(item => item.id === activeTab);
           const isOpen = openDropdown === category.nameKey;
          return (
            <div key={category.nameKey} className="relative">
              <button 
// Fix: Use curly braces for the ref callback to ensure a void return type.
                ref={(el) => { triggerRefs.current[category.nameKey] = el; }}
                type="button"
                onClick={() => handleToggleDropdown(category.nameKey)} 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${ isCategoryActive ? 'bg-accent-blue/10 dark:bg-accent-purple/20 text-accent-blue dark:text-accent-purple' : 'text-light-muted dark:text-zinc-400 hover:bg-light-border dark:hover:bg-zinc-800' }`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls={`desktop-menu-${category.nameKey}`}
              >
                <span>{t(category.nameKey)}</span>
                <Icon name="chevron-down" className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div 
                    id={`desktop-menu-${category.nameKey}`} 
                    className="absolute top-full left-0 mt-2 w-56 bg-light-card dark:bg-zinc-900 border border-light-border dark:border-zinc-800 rounded-md shadow-lg z-20 p-1 animate-scale-in origin-top"
                    role="menu"
                    aria-labelledby={category.nameKey}
                >
                  {category.items.map((tab) => (
                    <button 
                        type="button"
                        key={tab.id} 
                        onClick={() => handleTabClick(tab.id)} 
                        className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${ activeTab === tab.id ? 'bg-gradient-accent text-white' : 'text-light-text dark:text-zinc-200 hover:bg-light-border dark:hover:bg-zinc-800' }`}
                        role="menuitem"
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                      <Icon name={tab.icon} className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  );
};

export default DesktopNav;