
import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIZED_TABS } from '../../constants';
import { TabId } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { Icon } from '@/components/icons';

interface DesktopNavProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close dropdown when clicking outside
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

    // Focus first item on open
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
        // Close on tab away
        setOpenDropdown(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openDropdown]);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    setOpenDropdown(null);
  };

  return (
    <nav ref={navRef} className="hidden md:flex bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border justify-center" aria-label="Main Desktop">
      <div className="flex items-center space-x-1 p-2">
        {CATEGORIZED_TABS.map((category) => {
           const isCategoryActive = category.items.some(item => item.id === activeTab);
          return (
            <div key={category.nameKey} className="relative">
              <button 
// Fix: Use curly braces for the ref callback to ensure a void return type.
                ref={(el) => { triggerRefs.current[category.nameKey] = el; }}
                type="button"
                onClick={() => handleToggleDropdown(category.nameKey)} 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 ${ isCategoryActive ? 'bg-accent-blue/10 text-accent-blue dark:bg-accent-purple/20 dark:text-accent-purple' : 'text-light-muted dark:text-dark-muted hover:bg-light-border dark:hover:bg-dark-border' }`}
                aria-expanded={openDropdown === category.nameKey}
                aria-haspopup="true"
                aria-controls={`desktop-menu-${category.nameKey}`}
              >
                <span>{t(category.nameKey)}</span>
                <Icon name="chevron-down" className={`w-4 h-4 transition-transform ${openDropdown === category.nameKey ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === category.nameKey && (
                <div 
                    id={`desktop-menu-${category.nameKey}`} 
                    className="absolute top-full mt-2 w-56 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md shadow-lg z-20 animate-fadeIn p-1"
                    role="menu"
                    aria-labelledby={category.nameKey}
                >
                  {category.items.map((tab) => (
                    <button 
                        type="button"
                        key={tab.id} 
                        onClick={() => handleTabClick(tab.id)} 
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-3 ${ activeTab === tab.id ? 'bg-gradient-accent text-white' : 'text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border' }`}
                        role="menuitem"
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                      <div className="w-5 h-5" aria-hidden="true">{tab.icon}</div>
                      <span>{t(tab.nameKey)}</span>
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