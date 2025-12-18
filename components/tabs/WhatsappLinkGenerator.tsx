
import React, { useState } from 'react';
import Card from '../shared/Card';
import Input from '../shared/Input';
import Button from '../shared/Button';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useTranslation } from '../../hooks/useTranslation';
import { useWhatsappGenerator } from '../../hooks/useWhatsappGenerator';

const WhatsappLinkGenerator: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [step, setStep] = useState(1);

  const {
      formData,
      isTouched,
      isValidPhone,
      generatedLink,
      setPhone,
      setMessage,
      setIsTouched,
      handleCopy
  } = useWhatsappGenerator();

  const StepIndicator = () => (
    <div className="flex justify-center items-center mb-4">
      <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
      <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
      <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
    </div>
  );

  const DataInputStep = (
    <div className="space-y-4">
      <Input 
        label="whatsapp.phone.label" 
        type="tel" 
        placeholder={t('whatsapp.phone.placeholder')}
        value={formData.phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={() => setIsTouched(true)}
        error={isTouched && !isValidPhone && formData.phone.length > 0 ? 'whatsapp.validation.short' : null}
      />
      <div>
        <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t('whatsapp.message.label')}</label>
        <textarea
          value={formData.message}
          onChange={e => setMessage(e.target.value)}
          placeholder={t('whatsapp.message.placeholder')}
          className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border placeholder-light-muted/70 dark:placeholder-dark-muted/70 transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none h-28"
        />
      </div>
      {isMobile && <Button onClick={() => setStep(2)} className="w-full mt-2" disabled={!isValidPhone}>{t('whatsapp.generate')}</Button>}
    </div>
  );

  const ResultsStep = (
    <div className="bg-green-50 dark:bg-green-900/50 p-6 rounded-lg flex flex-col items-center justify-center h-full">
      <img src="https://template.edukafe.com.br/images/whatsapp1.png" alt={t('whatsapp.icon.alt')} className="w-16 h-16 mb-4" loading="lazy" decoding="async" />
       <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 break-all text-center">{generatedLink || t('whatsapp.waitingData')}</p>
       <div className="flex flex-col sm:flex-row gap-2 mt-auto w-full pt-4">
          <Button onClick={handleCopy} disabled={!generatedLink} variant="success" className="w-full">
            {t('whatsapp.copy')}
          </Button>
          <a href={generatedLink} target="_blank" rel="noopener noreferrer" className={`w-full ${!generatedLink ? 'pointer-events-none' : ''}`}>
            <Button disabled={!generatedLink} className="w-full">
              {t('whatsapp.open')}
            </Button>
          </a>
       </div>
        {isMobile && <Button onClick={() => setStep(1)} variant="secondary" className="w-full mt-4">{t('common.previous')}</Button>}
    </div>
  );
  
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-gray-200 dark:border-dark-border">{t('whatsapp.title')}</h1>
      
      {isMobile ? (
          <div>
            <StepIndicator />
             <Card>
                {step === 1 && <div className="animate-fadeIn">{DataInputStep}</div>}
                {step === 2 && <div className="animate-fadeIn">{ResultsStep}</div>}
             </Card>
          </div>
      ) : (
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DataInputStep}
                {ResultsStep}
            </div>
          </Card>
      )}

    </div>
  );
};

export default WhatsappLinkGenerator;
