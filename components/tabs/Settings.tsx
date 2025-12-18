
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Card from '../shared/Card';
import SEO from '../shared/SEO';

const Settings: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div>
            <SEO titleKey="tab.settings" descriptionKey="settings.description" />
            <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border text-center">
                {t('settings.title')}
            </h1>

            <div className="max-w-3xl mx-auto space-y-8">
                <Card title={t("settings.privacy.title")}>
                    <div className="space-y-4 text-light-muted dark:text-dark-muted">
                        <p>{t('settings.privacy.intro')}</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>{t('settings.privacy.point1')}</li>
                            <li>{t('settings.privacy.point2')}</li>
                            <li>{t('settings.privacy.point3')}</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;