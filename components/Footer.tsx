
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';
import { SOCIAL_LINKS } from '../constants';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
      if (url === '#/' || url === '') {
          e.preventDefault();
          window.location.hash = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const sites = [
    { name: 'Home', url: '#/' },
    { name: 'Blog', url: SOCIAL_LINKS.website },
    { name: 'Fabio Rodrigues Dsgn', url: SOCIAL_LINKS.website_br },
    { name: 'Fabio Dicas Top', url: SOCIAL_LINKS.website_br + '/fabio-dicas-top' },
  ];

  const social = [
    { name: '@fabiorodriguesdsgn', url: SOCIAL_LINKS.instagram },
    { name: '@fabiodicastop', url: SOCIAL_LINKS.instagram_secondary },
  ];

  return (
    <footer role="contentinfo" className="w-full bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Arsenal Tools</h3>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm">
              {t('footerSlogan')}
            </p>
          </div>
          <nav aria-label="Links Úteis" className="md:col-span-1">
            <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 tracking-wider uppercase">{t('mySites')}</h4>
            <ul className="mt-4 space-y-2">
              {sites.map(site => (
                <li key={site.name}>
                  <a 
                    href={site.url} 
                    onClick={(e) => handleLinkClick(e, site.url)}
                    target={site.url.startsWith('#') ? "_self" : "_blank"} 
                    rel={site.url.startsWith('#') ? "" : "noopener noreferrer"} 
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent-blue dark:hover:text-accent-purple transition-colors hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple rounded"
                  >
                    {site.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Redes Sociais" className="md:col-span-1">
            <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 tracking-wider uppercase">{t('socialMedia')}</h4>
            <ul className="mt-4 space-y-2">
              {social.map(s => (
                <li key={s.name}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent-blue dark:hover:text-accent-purple transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple rounded">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-neutral-500 dark:text-neutral-500 text-sm flex flex-col items-center gap-2">
          <p>&copy; {new Date().getFullYear()} Arsenal Tools. {t('rightsReserved')}</p>
          <p>
              {t('createdBy')} <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple rounded px-1">Fabio Rodrigues</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;