
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface SEOProps {
  titleKey: string;
  descriptionKey: string;
}

const SEO: React.FC<SEOProps> = ({ titleKey, descriptionKey }) => {
  const { t } = useTranslation();

  const title = t(titleKey);
  const siteName = 'Kit Freelancer';
  const fullTitle = titleKey === 'app.title' ? t('app.title') : `${title} | ${siteName}`;
  const description = t(descriptionKey);
  const imageUrl = "https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6";

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </>
  );
};

export default SEO;
