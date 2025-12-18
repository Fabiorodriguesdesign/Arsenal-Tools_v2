
import React, { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import { TABS, CATEGORIZED_TABS } from './constants';
import { TabId, TabCategory } from './types';
import { useTranslation } from './hooks/useTranslation';
import { Loading } from '../../ui/Loading';
import { Icon } from '@/components/icons';
import useMediaQuery from './hooks/useMediaQuery';
import ThemeToggle from '../../ThemeToggle'; 
import { useZenMode } from '../../../contexts/ZenModeContext';
import useDarkMode from './hooks/useDarkMode';

interface AppProps {
  initialTool?: TabId;
}

const App: React.FC<AppProps> = ({ initialTool }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const { isZenMode, toggleZenMode } = useZenMode();
  
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const toolFromUrl = params.get('tool') as TabId;
        if (toolFromUrl && TABS.some(t => t.id === toolFromUrl)) {
            return toolFromUrl;
        }
    }
    return initialTool || 'price-calculator';
  });
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<Record<string, boolean>>({});
  
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
      try {
          const currentHash = window.location.hash;
          if (currentHash.includes('/app/kit-freelancer')) {
              const basePath = currentHash.split('?')[0];
              const newHash = `${basePath}?tool=${activeTab}`;
              if (currentHash !== newHash) {
                  window.history.replaceState(null, '', newHash);
              }
          }
      } catch (error) {
          console.warn('Navigation history update prevented by security policy.');
      }
  }, [activeTab]);

  useEffect(() => {
      const foundCategory = CATEGORIZED_TABS.find(cat => 
          cat.items.some(item => item.id === activeTab)
      );
      if (foundCategory) {
          setExpandedMobileCategories(prev => ({
              ...prev,
              [foundCategory.nameKey]: true
          }));
      }
  }, [activeTab]);

  const handleDesktopCategoryClick = (categoryKey: string) => {
      setOpenDropdown(openDropdown === categoryKey ? null : categoryKey);
  };
  
  const handleToolClick = (toolId: TabId) => {
      setActiveTab(toolId);
      setOpenDropdown(null);
      setIsMobileMenuOpen(false);
  };
  
  const toggleMobileCategory = (categoryKey: string) => {
      setExpandedMobileCategories(prev => ({
          ...prev,
          [categoryKey]: !prev[categoryKey]
      }));
  };

  const handleGoToArsenal = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ActiveComponent = useMemo(() => {
      return TABS.find(tab => tab.id === activeTab)?.component;
  }, [activeTab]);

  if (!ActiveComponent) {
      return <Loading fullScreen text="Ferramenta não encontrada..." />;
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
      
      {!isZenMode && (
          <header className="sticky top-0 bg-light-card dark:bg-dark-card shadow-md z-30 border-b border-light-border dark:border-dark-border h-16 md:h-20 flex items-center">
            <div className="container mx-auto px-4 flex justify-between items-center h-full">
                
                <div className="flex items-center gap-4 md:gap-8">
                    <button
                        onClick={handleGoToArsenal}
                        className="flex items-center gap-2 text-sm font-semibold text-light-muted dark:text-dark-muted hover:text-primary transition-colors group"
                        title="Voltar para a Home"
                    >
                        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Icon name="arrow-left" className="w-5 h-5 text-primary" />
                        </div>
                        <span className="hidden md:inline font-bold text-lg text-light-text dark:text-dark-text">Kit Freelancer</span>
                        <span className="md:hidden font-bold text-lg text-light-text dark:text-dark-text">Kit</span>
                    </button>
                </div>

                <div className="hidden lg:flex items-center gap-2" ref={navRef}>
                    {CATEGORIZED_TABS.map((category) => {
                        const isOpen = openDropdown === category.nameKey;
                        const isActiveCategory = category.items.some(t => t.id === activeTab);

                        return (
                            <div key={category.nameKey} className="relative">
                                <button
                                    onClick={() => handleDesktopCategoryClick(category.nameKey)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                                        isActiveCategory || isOpen
                                        ? 'bg-light-bg dark:bg-neutral-800 text-primary'
                                        : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-white/50 dark:hover:bg-neutral-800/50'
                                    }`}
                                >
                                    {t(category.nameKey)}
                                    <Icon name="chevron-down" className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-light-border dark:border-dark-border p-2 z-50 animate-scale-in origin-top-left">
                                        <div className="flex flex-col gap-1">
                                            {category.items.map(tool => (
                                                <button
                                                    key={tool.id}
                                                    onClick={() => handleToolClick(tool.id)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                                                        activeTab === tool.id
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-neutral-800'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 flex-shrink-0 ${activeTab === tool.id ? 'text-primary' : 'opacity-70'}`}>{tool.icon}</div>
                                                    <span className="truncate">{t(tool.nameKey)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1 md:gap-3">
                    <div className="hidden md:flex items-center gap-1">
                        <button 
                            onClick={toggleZenMode}
                            className="p-2 rounded-full text-light-muted hover:text-primary dark:text-dark-muted dark:hover:text-primary transition-colors"
                            title="Modo Zen"
                        >
                            <Icon name="maximize" className="w-5 h-5" />
                        </button>
                        <ThemeToggle />
                        <button
                          onClick={toggleLanguage}
                          className="inline-flex items-center justify-center w-10 h-10 text-light-muted dark:text-dark-muted text-xs font-bold rounded-full transition-all duration-200 hover:bg-light-border dark:hover:bg-dark-border hover:text-accent-blue dark:hover:text-accent-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                          title={t('changeLanguage')}
                        >
                            {language.toUpperCase()}
                        </button>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-light-text dark:text-dark-text bg-light-bg dark:bg-neutral-800 rounded-lg border border-light-border dark:border-dark-border"
                    >
                        <Icon name={isMobileMenuOpen ? "x" : "menu"} className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full border-t border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card animate-fade-in h-[calc(100vh-64px)] overflow-y-auto shadow-2xl lg:hidden">
                    <div className="p-4 space-y-2 pb-20">
                        <div className="flex justify-between mb-4">
                            <ThemeToggle />
                            <button
                              onClick={toggleLanguage}
                              className="inline-flex items-center justify-center w-10 h-10 bg-light-bg dark:bg-neutral-800 text-light-muted dark:text-dark-muted text-xs font-bold rounded-full transition-all duration-200"
                            >
                                {language.toUpperCase()}
                            </button>
                            <button 
                                onClick={toggleZenMode}
                                className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-medium"
                            >
                                <Icon name="maximize" className="w-4 h-4" />
                                Modo Zen
                            </button>
                        </div>
                        {CATEGORIZED_TABS.map((category) => {
                            const isExpanded = expandedMobileCategories[category.nameKey];
                            const hasActiveChild = category.items.some(item => item.id === activeTab);

                            return (
                                <div key={category.nameKey} className={`rounded-xl overflow-hidden border transition-colors ${hasActiveChild ? 'border-primary/30 bg-primary/5' : 'border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/50'}`}>
                                    <button 
                                        onClick={() => toggleMobileCategory(category.nameKey)}
                                        className="w-full flex items-center justify-between p-4 transition-colors text-light-text dark:text-dark-text"
                                    >
                                        <span className="font-bold text-sm uppercase tracking-wider">{t(category.nameKey)}</span>
                                        <Icon 
                                            name="chevron-down" 
                                            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-2 space-y-1 bg-white/50 dark:bg-neutral-900/50 border-t border-light-border dark:border-dark-border">
                                            {category.items.map(tool => (
                                                <button
                                                    key={tool.id}
                                                    onClick={() => handleToolClick(tool.id)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                                        activeTab === tool.id
                                                        ? 'bg-primary text-white shadow-sm'
                                                        : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 flex-shrink-0 ${activeTab === tool.id ? 'text-white' : 'text-primary opacity-70'}`}>{tool.icon}</div>
                                                    <span className="truncate">{t(tool.nameKey)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
      )}
      
      <main className={`container mx-auto p-4 sm:p-6 lg:p-8 pb-20 ${isZenMode ? 'pt-8 max-w-5xl' : ''}`}>
        <div key={activeTab} className="animate-fade-in max-w-7xl mx-auto">
          <Suspense fallback={<div className="flex justify-center py-20"><Loading /></div>}>
            <ActiveComponent setActiveTab={setActiveTab} />
          </Suspense>
        </div>
      </main>

    </div>
  );
};

export default App;