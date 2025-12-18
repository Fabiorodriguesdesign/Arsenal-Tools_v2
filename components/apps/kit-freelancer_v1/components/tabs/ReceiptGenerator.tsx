

import React, { useState } from 'react';
// FIX: Update imports to use centralized UI components
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useTranslation } from '../../hooks/useTranslation';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { generateReceiptPDF, ReceiptData } from '../../utils/receiptPdfGenerator';
import ReceiptPreview from './ReceiptGenerator/ReceiptPreview';
import { Icon } from '@/components/icons';

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
    <div className="max-w-7xl mx-auto animate-fadeIn">
      {/* Header Section */}
      <div className="mb-8 text-center sm:text-left border-b border-light-border dark:border-dark-border pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text flex items-center gap-3 justify-center sm:justify-start">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon name="receipt-generator" className="w-8 h-8" />
                </div>
                {t('receiptGenerator.title')}
            </h1>
            <p className="text-light-muted dark:text-dark-muted mt-2 text-sm max-w-xl">
                Preencha os dados abaixo para gerar um recibo profissional em PDF, pronto para imprimir ou enviar.
            </p>
        </div>
        <Button onClick={handleReset} variant="secondary" size="sm" className="flex items-center gap-2">
            <Icon name="refresh" className="w-4 h-4"/>
            {t('common.reset')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna da Esquerda: Formulário (Scrollável) */}
          <div className="lg:col-span-6 space-y-6">
              
              {/* 1. Detalhes do Pagamento */}
              <Card title={t('receiptGenerator.details')} className="border-l-4 border-l-primary">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                       <Input
                            label={t("receiptGenerator.value")}
                            type="number"
                            name="value"
                            value={data.value}
                            onChange={handleChange}
                            placeholder="0,00"
                            leftIcon={<span className="text-xs font-bold text-gray-500">R$</span>}
                       />
                       <Input
                            label={t("receiptGenerator.date")}
                            type="date"
                            name="date"
                            value={data.date}
                            onChange={handleChange}
                       />
                  </div>
                   <div className="mb-4">
                       <Input
                            label={t("receiptGenerator.city")}
                            name="city"
                            value={data.city}
                            onChange={handleChange}
                            placeholder="Ex: São Paulo"
                       />
                   </div>
                  <div>
                      <Textarea
                        label={t('receiptGenerator.service')}
                        name="service"
                        value={data.service}
                        onChange={handleChange}
                        rows={3}
                        placeholder={t('receiptGenerator.servicePlaceholder')}
                        className="resize-none"
                      />
                  </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 2. Quem Paga */}
                <Card title={t('receiptGenerator.payer')}>
                      <div className="space-y-4">
                           <Input
                                label={t("receiptGenerator.name")}
                                name="payerName"
                                value={data.payerName}
                                onChange={handleChange}
                                placeholder="Nome do Cliente"
                           />
                           <Input
                                label={t("receiptGenerator.document")}
                                name="payerDocument"
                                value={data.payerDocument}
                                onChange={handleChange}
                                placeholder="CPF ou CNPJ"
                           />
                      </div>
                </Card>

                {/* 3. Quem Recebe */}
                <Card title={t('receiptGenerator.receiver')}>
                      <div className="space-y-4">
                           <Input
                                label={t("receiptGenerator.name")}
                                name="receiverName"
                                value={data.receiverName}
                                onChange={handleChange}
                                placeholder="Seu Nome / Empresa"
                           />
                           <Input
                                label={t("receiptGenerator.document")}
                                name="receiverDocument"
                                value={data.receiverDocument}
                                onChange={handleChange}
                                placeholder="Seu CPF ou CNPJ"
                           />
                      </div>
                </Card>
              </div>

              {/* Botão de Ação Mobile (Fixo na parte inferior da tela em telas pequenas) */}
              <div className="lg:hidden">
                   <Button onClick={handleDownload} isLoading={isGenerating} className="w-full py-4 text-lg shadow-xl bg-primary hover:bg-primary-dark">
                       <Icon name="download" className="w-6 h-6 mr-2" />
                       {t('common.download.pdf')}
                   </Button>
              </div>
          </div>

          {/* Coluna da Direita: Preview (Sticky) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
               <div className="hidden lg:flex items-center justify-between">
                    <h2 className="text-lg font-bold text-light-text dark:text-dark-text flex items-center gap-2">
                        <Icon name="eye" className="w-5 h-5 text-primary" />
                        {t('receiptGenerator.preview')}
                    </h2>
                    <span className="text-xs text-light-muted dark:text-dark-muted bg-light-bg dark:bg-dark-bg px-2 py-1 rounded">
                        Tempo real
                    </span>
               </div>
               
               <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 sm:p-6 rounded-2xl border border-light-border dark:border-dark-border shadow-inner flex justify-center">
                    <div className="w-full max-w-md transform transition-all hover:scale-[1.01]">
                        <ReceiptPreview data={data} />
                    </div>
               </div>

               <div className="hidden lg:block">
                   <Button onClick={handleDownload} isLoading={isGenerating} className="w-full py-4 text-lg shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-1">
                       <Icon name="download" className="w-6 h-6 mr-2" />
                       {t('common.download.pdf')}
                   </Button>
                   <p className="text-xs text-center text-light-muted dark:text-dark-muted mt-3">
                       O PDF gerado contém duas vias (Pagador e Recebedor) em uma página A4.
                   </p>
               </div>
          </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;