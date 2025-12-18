
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { ColorInput } from '@/components/ui/ColorInput';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useTranslation } from '../../hooks/useTranslation';
import { useQrCodeGenerator } from '../../hooks/useQrCodeGenerator';

const QrCodeGenerator: React.FC = () => {
  const { t } = useTranslation();
  const {
      formData,
      setText,
      setDarkColor,
      setLightColor,
      isGenerating,
      canvasRef,
      handleDownloadPng,
      handleDownloadPdf
  } = useQrCodeGenerator();

  const isMobile = useMediaQuery('(max-width: 767px)');
  const [step, setStep] = useState(1);
  
  const StepIndicator = () => (
    <div className="flex justify-center items-center mb-4">
        <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
        <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
    </div>
  );

  const ConfigStep = (
    <Card title={isMobile ? t("qrCode.step1.title") : t("qrCode.contentAndColors")}>
        <div className="space-y-4">
        <Textarea
            value={formData.text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('qrCode.placeholder')}
            rows={5}
        />
        <div className="grid grid-cols-2 gap-4">
            <ColorInput
                id="qr-dark-color"
                label={t('qrCode.codeColor')}
                value={formData.darkColor} 
                onChange={e => setDarkColor(e.target.value)}
            />
             <ColorInput
                id="qr-light-color"
                label={t('qrCode.backgroundColor')}
                value={formData.lightColor} 
                onChange={e => setLightColor(e.target.value)}
            />
        </div>
        </div>
        {isMobile && <Button onClick={() => setStep(2)} className="w-full mt-6" disabled={!formData.text}>{t('qrCode.generate')}</Button>}
    </Card>
  );

  const ResultStep = (
     <Card title={isMobile ? t("qrCode.step2.title") : t("qrCode.yourQrCode")} className="flex flex-col items-center justify-center h-full">
        <div className="p-4 rounded-lg shadow-inner mb-6" style={{ backgroundColor: formData.lightColor }}>
        <canvas 
            ref={canvasRef} 
            width="256" 
            height="256" 
            role="img"
            aria-label={t('qrCode.ariaLabel', { text: formData.text || 'vazio' })}
            className="max-w-full h-auto"
        />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Button onClick={handleDownloadPng} disabled={!formData.text || isGenerating} isLoading={isGenerating} variant="secondary" className="w-full">
            {t('common.download.png')}
        </Button>
        <Button onClick={handleDownloadPdf} disabled={!formData.text || isGenerating} isLoading={isGenerating} className="w-full">
            {t('common.download.pdf')}
        </Button>
        </div>
        {isMobile && <Button onClick={() => setStep(1)} variant="secondary" className="w-full mt-6">{t('common.previous')}</Button>}
    </Card>
  );

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">{t('qrCode.title')}</h1>
      
      {isMobile ? (
          <div>
            <StepIndicator />
             <div className="animate-fadeIn">
                {step === 1 && ConfigStep}
                {step === 2 && ResultStep}
             </div>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-full animate-fadeIn">{ConfigStep}</div>
              <div className="h-full animate-fadeIn">{ResultStep}</div>
          </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
