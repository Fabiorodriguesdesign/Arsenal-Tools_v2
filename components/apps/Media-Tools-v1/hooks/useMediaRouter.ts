
import { useState, useEffect, useCallback } from 'react';
import { Tab } from '../types';
import { TABS } from '../components/constants';

interface UseMediaRouterProps {
  initialTool?: Tab;
}

export const useMediaRouter = ({ initialTool }: UseMediaRouterProps) => {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>(initialTool ? 'app' : 'landing');
  const [activeTab, setActiveTab] = useState<Tab>(initialTool || 'background');

  // Handle Deep Linking (URL params) - Initial Load & Hash Changes
  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash;
        const searchIndex = hash.indexOf('?');
        
        if (searchIndex !== -1) {
            const queryString = hash.substring(searchIndex + 1);
            const urlParams = new URLSearchParams(queryString);
            const tool = urlParams.get('tool');
            
            if (tool) {
                const tabExists = TABS.some(t => t.id === tool);
                if (tabExists) {
                    setActiveTab(tool as Tab);
                    setCurrentView('app');
                    return;
                }
            }
        }
        // If no valid tool in hash, but we are in the app, maybe go back to landing?
        // For now, it just stays on the current tool, which is fine.
    };

    // Run on mount if no initial tool is provided
    if (!initialTool) {
        handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [initialTool]);

  // Reverse Sync: Update URL when activeTab changes (without reloading)
  useEffect(() => {
    if (currentView === 'app') {
        try {
            const currentHash = window.location.hash;
            if (currentHash.includes('/app/media-tools')) {
                const basePath = currentHash.split('?')[0];
                const newHash = `${basePath}?tool=${activeTab}`;
                if (currentHash !== newHash) {
                    window.history.replaceState(null, '', newHash);
                }
            }
        } catch (e) {
            console.warn('Deep linking state update failed (likely sandbox restriction):', e);
        }
    }
  }, [activeTab, currentView]);

  const handleNavigateToTool = useCallback((tabId: Tab) => {
    setActiveTab(tabId);
    setCurrentView('app');
  }, []);

  return {
    currentView,
    activeTab,
    handleNavigateToTool,
    setActiveTab, // Also expose setActiveTab for direct manipulation (e.g., nav menus)
  };
};
