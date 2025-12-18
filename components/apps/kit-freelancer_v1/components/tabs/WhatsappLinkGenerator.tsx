
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useTranslation } from '../../hooks/useTranslation';
import { useWhatsappGenerator } from '../../hooks/useWhatsappGenerator';
import { Icon } from '@/components/icons';

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
    <div className="flex justify-center items-center mb-6">
      <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${step === 1 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
      <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2"></div>
      <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
    </div>
  );

  const DataInputStep = (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input 
            label={t("whatsapp.phone.label")} 
            type="tel" 
            placeholder={t('whatsapp.phone.placeholder')}
            value={formData.phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setIsTouched(true)}
            error={isTouched && !isValidPhone && formData.phone.length > 0 ? t('whatsapp.validation.short') : undefined}
            leftIcon={<Icon name="whatsapp" className="w-4 h-4" />}
        />
        <Textarea
            label={t('whatsapp.message.label')}
            value={formData.message}
            onChange={e => setMessage(e.target.value)}
            placeholder={t('whatsapp.message.placeholder')}
            rows={4}
        />
      </div>

      {/* Live Preview */}
      <div className="mt-6 pt-6 border-t border-light-border dark:border-dark-border">
         <h3 className="text-sm font-semibold text-light-muted dark:text-dark-muted mb-3 uppercase tracking-wider">
            {t('preview')}
         </h3>
         <div className="bg-[#e5ddd5] dark:bg-[#0b141a] p-4 rounded-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden shadow-inner min-h-[140px]">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] pointer-events-none"></div>
              
              {/* Header Mock */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                 <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white">
                    <Icon name="user" className="w-5 h-5" />
                 </div>
                 <div className="flex-1">
                     <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {formData.phone ? formData.phone : 'Seu Número'}
                     </div>
                     <div className="text-[10px] text-gray-500 dark:text-gray-400">online</div>
                 </div>
              </div>
              
              {/* Message Bubble */}
              <div className="flex justify-end relative z-10">
                  <div className="bg-[#d9fdd3] dark:bg-[#005c4b] p-2 sm:p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] relative text-sm text-gray-900 dark:text-gray-100">
                     <p className="whitespace-pre-wrap leading-relaxed">
                       {formData.message || <span className="opacity-40 italic">{t('whatsapp.message.placeholder')}</span>}
                     </p>
                     <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                           {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <Icon name="check" className="w-3 h-3 text-[#53bdeb]" />
                     </div>
                  </div>
              </div>
         </div>
      </div>

      {isMobile && <Button onClick={() => setStep(2)} className="w-full mt-4" disabled={!isValidPhone}>{t('whatsapp.generate')}</Button>}
    </div>
  );

  const ResultsStep = (
    <div className="flex flex-col items-center justify-center h-full text-center">
       <div className="w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
           <Icon name="whatsapp" className="w-10 h-10 text-[#25D366]" />
       </div>
       
       <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-2">Link Pronto!</h3>
       <p className="text-sm text-light-muted dark:text-dark-muted mb-6 max-w-sm break-all">
         {generatedLink || t('whatsapp.waitingData')}
       </p>
       
       <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <Button onClick={handleCopy} disabled={!generatedLink} variant="success" className="w-full" leftIcon={<Icon name="clipboard" className="w-4 h-4"/>}>
            {t('whatsapp.copy')}
          </Button>
          <a href={generatedLink} target="_blank" rel="noopener noreferrer" className={`w-full ${!generatedLink ? 'pointer-events-none' : ''}`}>
            <Button disabled={!generatedLink} className="w-full" variant="outline" leftIcon={<Icon name="external-link" className="w-4 h-4"/>}>
              {t('whatsapp.open')}
            </Button>
          </a>
       </div>
       
       {isMobile && <Button onClick={() => setStep(1)} variant="ghost" className="w-full mt-6">{t('common.previous')}</Button>}
    </div>
  );
  
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-8 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border text-center sm:text-left">
        {t('whatsapp.title')}
      </h1>
      
      {isMobile ? (
          <div>
            <StepIndicator />
             <Card>
                {step === 1 && <div className="animate-fadeIn">{DataInputStep}</div>}
                {step === 2 && <div className="animate-fadeIn">{ResultsStep}</div>}
             </Card>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Card title={t('common.configuration')}>
                {DataInputStep}
             </Card>
             <Card className="flex flex-col justify-center">
                {ResultsStep}
             </Card>
          </div>
      )}
    </div>
  );
};

export default WhatsappLinkGenerator;
