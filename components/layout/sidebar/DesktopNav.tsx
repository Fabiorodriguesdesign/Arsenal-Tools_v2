import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIZED_TABS } from '../../apps/kit-freelancer_v1/constants';
import { TabId } from '../../apps/kit-freelancer_v1/types';
import { useTranslation } from '../../apps/kit-freelancer_v1/hooks/useTranslation';
import { ChevronDownIcon } from '../../shared/Icons';

interface DesktopNavProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

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
                type="button"
                onClick={() => setOpenDropdown(openDropdown === category.nameKey ? null : category.nameKey)} 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 ${ isCategoryActive ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-light-muted dark:text-dark-muted hover:bg-light-border dark:hover:bg-dark-border' }`}
                aria-expanded={openDropdown === category.nameKey}
                aria-haspopup="true"
                aria-controls={`desktop-menu-${category.nameKey}`}
              >
                <span>{t(category.nameKey)}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${openDropdown === category.nameKey ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === category.nameKey && (
                <div 
                    id={`desktop-menu-${category.nameKey}`} 
                    className="absolute top-full mt-2 w-56 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md shadow-lg z-20 animate-fadeIn p-1"
                    role="menu"
                >
                  {category.items.map((tab) => (
                    <button 
                        type="button"
                        key={tab.id} 
                        onClick={() => handleTabClick(tab.id)} 
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-3 ${ activeTab === tab.id ? 'bg-primary text-white' : 'text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border' }`}
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