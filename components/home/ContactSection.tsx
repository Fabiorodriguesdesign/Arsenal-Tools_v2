
import React from 'react';
import { SiteContent } from '../../types';
import { Icon } from '../icons';
import { CONTACT_PHOTO_URL, SOCIAL_LINKS } from '../../constants';

interface ContactSectionProps {
    siteContent: SiteContent;
    t: (key: string) => string;
}

interface ContactLink {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const ContactSection: React.FC<ContactSectionProps> = ({ siteContent, t }) => {
    
    const contactLinks: ContactLink[] = [
      { label: '@fabiorodriguesdsgn', href: SOCIAL_LINKS.instagram, icon: <Icon name="instagram" className="w-5 h-5" /> },
      { label: '@fabiodicastop', href: SOCIAL_LINKS.instagram_secondary, icon: <Icon name="instagram" className="w-5 h-5" /> },
      { label: 'fabiorodriguesdesign.com', href: SOCIAL_LINKS.website, icon: <Icon name="globe" className="w-5 h-5" /> },
      { label: 'fabiorodriguesdesign.com.br', href: SOCIAL_LINKS.website_br, icon: <Icon name="blog" className="w-5 h-5" /> },
    ];

    return (
        <section id="contact" className="pt-16 md:pt-24 bg-neutral-50 dark:bg-neutral-900/20 border-t border-neutral-200 dark:border-neutral-800 pb-20">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-12 shadow-2xl shadow-neutral-200 dark:shadow-black/50 border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary/5 rounded-bl-full -z-0 pointer-events-none"></div>
              <div className="w-40 h-40 md:w-64 md:h-64 flex-shrink-0 relative z-10">
                  <img src={CONTACT_PHOTO_URL} alt="Fabio Rodrigues" className="w-full h-full rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-xl" />
                  <div className="absolute bottom-2 right-2 w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-neutral-800">
                      <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white animate-pulse scale-75">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                          </svg>
                      </div>
                  </div>
              </div>
              <div className="text-center md:text-left flex-grow relative z-10 w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{siteContent.contact_title}</h2>
                <p className="mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">{siteContent.contact_subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                    {contactLinks.map(link => (
                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-neutral-100 dark:bg-neutral-800 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95">
                            {link.icon}
                            {link.label}
                        </a>
                    ))}
                </div>
                <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800/50 flex justify-center md:justify-start">
                    <a href={SOCIAL_LINKS.briefing} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold text-base rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl active:scale-95">
                      <Icon name="contact" className="w-5 h-5" />
                      <span className="ml-2">{t('requestQuote')}</span>
                    </a>
                </div>
              </div>
            </div>
          </div>
        </section>
    );
};

export default ContactSection;
