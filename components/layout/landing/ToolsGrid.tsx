import React, { useMemo } from 'react';
import { Tab, TabId } from '../../apps/kit-freelancer_v1/types';
import { CATEGORIZED_TABS } from '../../apps/kit-freelancer_v1/constants';
import { useTranslation } from '../../apps/kit-freelancer_v1/hooks/useTranslation';

interface ToolsGridProps {
  onNavigateToTool: (tabId: TabId) => void;
  searchQuery: string;
}

const normalizeText = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const ToolCard: React.FC<{ tab: Tab; onClick: () => void }> = ({ tab, onClick }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-lg p-6 border border-light-border dark:border-dark-border transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:-translate-y-1 flex flex-col animate-fadeIn">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 text-primary bg-primary/10 dark:bg-primary/20 p-2 rounded-lg flex-shrink-0">{tab.icon}</div>
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text">{t(tab.nameKey)}</h3>
      </div>
      <p className="text-base text-light-muted dark:text-dark-muted flex-grow mb-4">{t(`landing.${tab.id}.landing.description`)}</p>
      <button 
        onClick={onClick} 
        className="mt-auto w-full text-center px-4 py-2 rounded-md font-semibold transition duration-200 ease-in-out bg-light-border text-light-text hover:bg-zinc-200 dark:bg-dark-border dark:text-dark-text dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-card"
        aria-label={`${t('landing.useNow')} ${t(tab.nameKey)}`}
      >
        {t('landing.useNow')}
      </button>
    </div>
  );
};

const ToolsGrid: React.FC<ToolsGridProps> = ({ onNavigateToTool, searchQuery }) => {
  const { t } = useTranslation();

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIZED_TABS;

    const normalizedQuery = normalizeText(searchQuery);

    return CATEGORIZED_TABS.map(category => {
      const filteredItems = category.items.filter(item => {
        const name = normalizeText(t(item.nameKey));
        const description = normalizeText(t(`landing.${item.id}.landing.description`));
        return name.includes(normalizedQuery) || description.includes(normalizedQuery);
      });

      return {
        ...category,
        items: filteredItems
      };
    }).filter(category => category.items.length > 0);
  }, [searchQuery, t]);

  return (
    <div className="mt-20 sm:mt-28 space-y-16">
      {filteredCategories.length > 0 ? (
        filteredCategories.map(category => (
          <section key={category.nameKey} className="animate-fadeIn" aria-labelledby={`cat-${category.nameKey}`}>
            <div className="text-center mb-12">
              <h2 id={`cat-${category.nameKey}`} className="text-3xl sm:text-4xl font-bold tracking-tight">{t(category.nameKey)}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-md text-light-muted dark:text-dark-muted">
                {t(`landing.${category.nameKey}.landing.description`)}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map(tab => (
                <ToolCard key={tab.id} tab={tab} onClick={() => onNavigateToTool(tab.id)} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-20 animate-fadeIn">
          <p className="text-xl text-light-muted dark:text-dark-muted">
            Nenhuma ferramenta encontrada para "{searchQuery}".
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;