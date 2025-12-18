
import React, { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TABS } from '../constants';
import { Tab } from '../../../types';
import ToolCard from './ToolCard';

interface ToolsProps {
  onNavigateToTool: (tabId: Tab) => void;
}

const Tools: React.FC<ToolsProps> = ({ onNavigateToTool }) => {
  const { t } = useLanguage();
  
  const translatedTabs = useMemo(() => {
    return TABS.map(tab => ({
      ...tab,
      label: t(`${tab.id}Label`),
      landingDescription: t(`${tab.id}LandingDesc`),
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [t]);

  return (
    <section id="tools" className="mt-24 sm:mt-32">
        <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">{t('ourTools')}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-400">
                {t('toolsSubtitle')}
            </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {translatedTabs.map(tab => <ToolCard key={tab.id} tab={tab} onClick={() => onNavigateToTool(tab.id)} />)}
        </div>
    </section>
  );
};

export default Tools;
