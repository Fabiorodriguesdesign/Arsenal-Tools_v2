import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { ReceiptData } from '../../../utils/receiptPdfGenerator';

interface ReceiptPreviewProps {
    data: ReceiptData;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ data }) => {
    const { t } = useTranslation();

    const formatCurrency = (val: string) => {
        const num = parseFloat(val) || 0;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(d);
    };

    return (
        <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-sm font-sans text-gray-800 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-200"></div>
            
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-lg uppercase tracking-wide text-gray-700">{t('receiptGenerator.template.receipt')}</h3>
                <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase mb-1">{t('receiptGenerator.template.value')}</div>
                    <div className="text-xl font-bold text-gray-900 border border-gray-300 px-3 py-1 rounded bg-gray-50">
                        {formatCurrency(data.value)}
                    </div>
                </div>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed">
                <p>
                    <span className="font-semibold">{t('receiptGenerator.template.receivedFrom')}</span> {data.payerName || '___________'} {data.payerDocument ? `(${data.payerDocument})` : ''}
                </p>
                <p>
                    <span className="font-semibold">{t('receiptGenerator.template.theAmount')}</span> <span className="font-bold">{formatCurrency(data.value)}</span>.
                </p>
                <p>
                    <span className="font-semibold">{t('receiptGenerator.template.regarding')}</span> {data.service || '________________________________'}
                </p>
                <p>
                     {t('receiptGenerator.template.dateSignature')}
                </p>
            </div>

            <div className="mt-8 flex flex-col items-end">
                <p className="mb-8 text-sm">
                    {data.city || '________'}, {data.date ? formatDate(data.date) : '__/__/____'}.
                </p>
                <div className="border-t border-black w-48 text-center pt-2">
                     <p className="font-bold text-sm">{data.receiverName || t('receiptGenerator.template.signature')}</p>
                     <p className="text-xs text-gray-500">{data.receiverDocument}</p>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ReceiptPreview);