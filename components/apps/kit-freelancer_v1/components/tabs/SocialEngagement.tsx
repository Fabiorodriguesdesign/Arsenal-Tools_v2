
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useSocialEngagement } from '../../hooks/useSocialEngagement';
import { EngagementLevel } from '../../types/social';

const SocialEngagement: React.FC = () => {
  const { t } = useTranslation();
  const { formData, result, handleChange, calculateEngagement } = useSocialEngagement();
  
  const levelClasses: Record<EngagementLevel, string> = {
      low: 'text-danger',
      average: 'text-light-text dark:text-dark-text',
      good: 'text-secondary',
      excellent: 'text-light-accent-text dark:text-dark-accent-text'
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">
        {t('socialEngagement.title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={calculateEngagement}>
          <Card title={t("socialEngagement.card.title")}>
            <div className="space-y-4">
              <Input 
                label={t("socialEngagement.followers.label")} 
                type="number" 
                name="followers"
                value={formData.followers} 
                onChange={handleChange} 
                placeholder={t('socialEngagement.followers.placeholder')}
                required
              />
              <Input 
                label={t("socialEngagement.likes.label")} 
                type="number" 
                name="likes"
                value={formData.likes} 
                onChange={handleChange}
                placeholder={t('socialEngagement.likes.placeholder')}
              />
               <Input 
                label={t("socialEngagement.comments.label")}
                type="number" 
                name="comments"
                value={formData.comments} 
                onChange={handleChange}
                placeholder={t('socialEngagement.comments.placeholder')}
              />
               <Input 
                label={t("socialEngagement.shares.label")}
                type="number" 
                name="shares"
                value={formData.shares} 
                onChange={handleChange}
                placeholder={t('socialEngagement.shares.placeholder')}
              />
            </div>
            <Button type="submit" className="w-full mt-6">
              {t('socialEngagement.calculate.button')}
            </Button>
          </Card>
        </form>

        <div className="lg:mt-0">
          {result ? (
            <div role="status" aria-live="polite">
                <Card title={t("common.result")} className="h-full flex flex-col justify-center items-center text-center animate-fadeIn">
                    <p className="text-sm text-light-muted dark:text-dark-muted">{t('socialEngagement.result.yourRateIs')}</p>
                    <p className={`text-6xl font-bold my-2 ${levelClasses[result.level]}`}>
                        {result.rate.toFixed(2)}%
                    </p>
                    <p className="text-light-muted dark:text-dark-muted mt-2 max-w-sm">{t(result.messageKey)}</p>
                </Card>
            </div>
          ) : (
            <Card className="h-full flex flex-col justify-center items-center">
              <div className="text-center p-8 text-light-muted dark:text-dark-muted">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-3-5v5m-3-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4">{t('socialEngagement.fillData')}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
       <div className="mt-6 text-center text-xs text-light-muted dark:text-dark-muted p-4 bg-light-border dark:bg-dark-card rounded-lg">
        <strong>{t('common.note')}:</strong> {t('socialEngagement.formulaNote')}
      </div>
    </div>
  );
};

export default SocialEngagement;
