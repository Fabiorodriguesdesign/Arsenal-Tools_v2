
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Icon } from '@/components/icons';

const Feature: React.FC<{ iconName: string; title: string; children: React.ReactNode }> = ({ iconName, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-zinc-800 p-2 rounded-full">
            <Icon name={iconName} className="w-6 h-6 text-[#ff0e00]" />
        </div>
        <div>
            <h4 className="font-semibold text-zinc-100">{title}</h4>
            <p className="text-zinc-400 mt-1">{children}</p>
        </div>
    </div>
);

const Features: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="mt-24 sm:mt-32">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            <Feature iconName="shield-check" title={t('feature1Title')}>
                {t('feature1Desc')}
            </Feature>
            <Feature iconName="layers" title={t('feature2Title')}>
                {t('feature2Desc')}
            </Feature>
            <Feature iconName="check-circle" title={t('feature3Title')}>
                {t('feature3Desc')}
            </Feature>
            <Feature iconName="check-circle" title={t('feature4Title')}>
                {t('feature4Desc')}
            </Feature>
        </div>
    </section>
  );
};

export default Features;
