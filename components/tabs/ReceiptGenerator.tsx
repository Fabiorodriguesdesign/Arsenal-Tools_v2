
import React, { useState } from 'react';
import Card from '../shared/Card';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { generateReceiptPDF, ReceiptData } from '../../utils/receiptPdfGenerator';
import ReceiptPreview from './ReceiptGenerator/ReceiptPreview';

const INITIAL_STATE: ReceiptData = {
  payerName: '',
  payerDocument: '',
  receiverName: '',
  receiverDocument: '',
  value: '',
  date: new Date().toISOString().split('T')[0],
  city: '',
  service: '',
};

const ReceiptGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  const [data, setData] = useFormPersistence<ReceiptData>('receiptGeneratorData', INITIAL_STATE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleReset = () => {
    if (confirm(t('common.confirmReset'))) {
      setData(INITIAL_STATE);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 100)); // UI update
        await generateReceiptPDF(data, t);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border text-center">
        {t('receiptGenerator.title')}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
              <div className="space-y-6">
                  {/* Receiver (Provider) */}
                  <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
                      <h3 className="font-bold mb-3 text-light-text dark:text-dark-text">{t('receiptGenerator.receiver')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           <Input
                                label="receiptGenerator.name"
                                name="receiverName"
                                value={data.receiverName}
                                onChange={handleChange}
                           />
                           <Input
                                label="receiptGenerator.document"
                                name="receiverDocument"
                                value={data.receiverDocument}
                                onChange={handleChange}
                           />
                      </div>
                  </div>

                  {/* Payer (Client) */}
                  <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
                      <h3 className="font-bold mb-3 text-light-text dark:text-dark-text">{t('receiptGenerator.payer')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           <Input
                                label="receiptGenerator.name"
                                name="payerName"
                                value={data.payerName}
                                onChange={handleChange}
                           />
                           <Input
                                label="receiptGenerator.document"
                                name="payerDocument"
                                value={data.payerDocument}
                                onChange={handleChange}
                           />
                      </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
                      <h3 className="font-bold mb-3 text-light-text dark:text-dark-text">{t('receiptGenerator.details')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                           <Input
                                label="receiptGenerator.value"
                                type="number"
                                name="value"
                                value={data.value}
                                onChange={handleChange}
                           />
                           <Input
                                label="receiptGenerator.date"
                                type="date"
                                name="date"
                                value={data.date}
                                onChange={handleChange}
                           />
                           <Input
                                label="receiptGenerator.city"
                                name="city"
                                value={data.city}
                                onChange={handleChange}
                           />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">
                              {t('receiptGenerator.service')}
                          </label>
                          <textarea
                            name="service"
                            value={data.service}
                            onChange={handleChange}
                            rows={2}
                            placeholder={t('receiptGenerator.servicePlaceholder')}
                            className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border placeholder-light-muted/70 dark:placeholder-dark-muted/70 transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
                          />
                      </div>
                  </div>
              </div>
          </Card>

          {/* Preview */}
          <div className="flex flex-col gap-6">
               <h2 className="text-xl font-bold text-center lg:text-left text-light-text dark:text-dark-text">{t('receiptGenerator.preview')}</h2>
               <ReceiptPreview data={data} />
               <div className="flex flex-col gap-3">
                   <Button onClick={handleDownload} isLoading={isGenerating} className="w-full py-3 text-lg shadow-lg">
                       {t('common.download.pdf')}
                   </Button>
                   <Button onClick={handleReset} variant="secondary" className="w-full">
                       {t('receiptGenerator.newReceipt')}
                   </Button>
               </div>
          </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
