
import React, { useState, useEffect } from 'react';
import { Tool } from '../types';
import { Icon } from './icons';
import IconRenderer from './IconRenderer';
import BaseModal from './ui/BaseModal';
import LoadingSpinner from './ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

interface LeadCaptureModalProps {
  tool: Tool;
  onClose: () => void;
  onAddLead: (leadData: { name: string; email: string; whatsapp?: string; toolOfInterest: string }) => Promise<void>;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ tool, onClose, onAddLead }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim() && email.trim() && whatsapp.trim()) {
      setIsLoading(true);
      try {
        await onAddLead({ name, email, whatsapp, toolOfInterest: tool.name });
        setSubmitted(true);
      } catch (error) {
        console.error("Submission failed", error);
        setError(t('errorSubmit'));
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const benefitsList = tool.benefits ? tool.benefits.split('\n').filter(b => b.trim() !== '') : [];

  return (
    <BaseModal onClose={onClose} titleId="lead-capture-title" containerClassName="max-w-lg">
      <div className="p-4 sm:p-6 md:p-8">
        {submitted ? (
          <div className="text-center py-8 flex flex-col items-center justify-center animate-fade-in-form">
            <Icon name="check-circle" className="w-20 h-20 text-green-500 mb-6 animate-pop-in" />
            <h2 id="lead-capture-title" className="font-bold text-3xl text-neutral-900 dark:text-white">{t('successTitle')}</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">{t('successMessage')}</p>
            <style>{`
              @keyframes fade-in-form {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fade-in-form {
                animation: fade-in-form 0.3s ease-out forwards;
              }
              @keyframes pop-in {
                0% { transform: scale(0.5); opacity: 0; }
                60% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); }
              }
              .animate-pop-in {
                animation: pop-in 0.5s 0.1s ease-out forwards;
              }
            `}</style>
          </div>
        ) : (
          <>
            <div className="text-center">
              <IconRenderer icon={tool.icon} className="w-16 h-16 text-primary mb-4 mx-auto" />
              <h2 id="lead-capture-title" className="font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
                {t('leadCaptureTitle').replace('{toolName}', tool.name)}
              </h2>
              
              {tool.description && (
                <p className="mt-4 max-w-md mx-auto text-neutral-600 dark:text-neutral-400">{tool.description}</p>
              )}

              {benefitsList.length > 0 && (
                  <div className="mt-6 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg p-4 text-left max-w-md mx-auto">
                     <ul className="space-y-2">
                        {benefitsList.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                                <Icon name="check-circle" className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-neutral-700 dark:text-neutral-300">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                  </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <p className="text-sm text-center text-neutral-500 -mb-2">{t('leadCaptureSubtitle')}</p>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                    {error}
                </div>
              )}
              <div>
                <label htmlFor="lead-name" className="sr-only">{t('labelName')}</label>
                <input
                  id="lead-name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple"
                  placeholder={t('labelName')}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="lead-email" className="sr-only">{t('labelEmail')}</label>
                <input
                  id="lead-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple"
                  placeholder={t('labelEmail')}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="lead-whatsapp" className="sr-only">{t('labelWhatsapp')}</label>
                <input
                  id="lead-whatsapp" type="tel" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple"
                  placeholder={t('labelWhatsapp')}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-bold py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 disabled:bg-neutral-400 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2 text-white" />
                      {t('btnSending')}
                    </>
                  ) : (
                    t('btnSubmit')
                  )}
                </button>
                {tool.learnMoreUrl && (
                  <a
                    href={tool.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full font-bold py-3 px-4 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 flex items-center justify-center gap-2 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <Icon name="external-link" className="w-5 h-5" />
                    {t('btnLearnMore')}
                  </a>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </BaseModal>
  );
};

export default LeadCaptureModal;