import React from 'react';
import { useTranslation } from '../../apps/kit-freelancer_v1/hooks/useTranslation';
import { CATEGORIZED_TABS } from '../../apps/kit-freelancer_v1/constants';

interface HeroSectionProps {
  onNavigateToToolkit: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToToolkit, searchQuery, setSearchQuery }) => {
  const { t } = useTranslation();

  const handleCategoryClick = (categoryKey: string) => {
    const element = document.getElementById(`cat-${categoryKey}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="text-center animate-fadeIn">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-light-text dark:text-dark-text">
        {t('landing.hero.title.part1')} <span className="text-primary">{t('landing.hero.title.part2')}</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-light-muted dark:text-dark-muted">
        {t('landing.hero.subtitle')}
      </p>

      {/* Search Input */}
      <div className="mt-8 max-w-2xl mx-auto relative group z-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-light-muted group-focus-within:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('landing.hero.searchPlaceholder')}
          className="block w-full pl-12 pr-4 py-4 text-base sm:text-lg bg-white dark:bg-light-text/5 border-2 border-light-border dark:border-dark-border rounded-full text-light-text dark:text-dark-text placeholder-light-muted/70 dark:placeholder-dark-muted/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
        />
      </div>

      {/* Category Quick Access Tags */}
      <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        {CATEGORIZED_TABS.map((category) => (
          <button
            key={category.nameKey}
            onClick={() => handleCategoryClick(category.nameKey)}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-primary hover:text-primary dark:hover:text-primary dark:hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            {t(category.nameKey)}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;