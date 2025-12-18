
import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { ReceiptData } from '../../../utils/receiptPdfGenerator';
import { Icon } from '@/components/icons';

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
        <div className="relative w-full aspect-[210/250] sm:aspect-[210/220] bg-[#fffcf5] text-gray-800 shadow-2xl rounded-sm overflow-hidden font-serif border border-gray-300">
            {/* Texture Overlay (CSS Pattern) */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#a3a3a3 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
            
            {/* Top Decoration Strip */}
            <div className="h-2 w-full bg-gray-800 mb-6 relative z-10"></div>

            <div className="p-6 sm:p-8 relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-gray-900">{t('receiptGenerator.template.receipt')}</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-sans font-bold">Via do Pagador</p>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-500 uppercase mb-1 font-sans">{t('receiptGenerator.template.value')}</div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900 bg-white/80 px-3 py-1 rounded border border-gray-300 shadow-sm font-mono tracking-tight">
                            {formatCurrency(data.value)}
                        </div>
                    </div>
                </div>
                
                {/* Body Content */}
                <div className="space-y-5 text-sm sm:text-base leading-relaxed flex-grow">
                    {/* Received From */}
                    <div>
                        <p className="mb-1 text-gray-500 text-[10px] uppercase font-bold font-sans">{t('receiptGenerator.template.receivedFrom')}</p>
                        <div className="relative border-b border-gray-400 pb-1 min-h-[1.5rem]">
                             <p className={`font-semibold text-lg ${!data.payerName ? 'text-gray-300 italic' : 'text-gray-900'}`}>
                                {data.payerName || 'Nome do Pagador'} 
                                {data.payerDocument && <span className="text-sm font-normal text-gray-600 ml-2 font-sans">({data.payerDocument})</span>}
                            </p>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="bg-gray-100/50 p-3 rounded border border-gray-200">
                        <p className="mb-1 text-gray-500 text-[10px] uppercase font-bold font-sans">{t('receiptGenerator.template.theAmount')}</p>
                        <p className="font-bold text-lg text-gray-900">
                             {formatCurrency(data.value)}
                        </p>
                    </div>

                    {/* Regarding */}
                    <div>
                         <p className="mb-1 text-gray-500 text-[10px] uppercase font-bold font-sans">{t('receiptGenerator.template.regarding')}</p>
                         <div className="relative border-b border-gray-400 pb-1 min-h-[1.5rem]">
                             <p className={`italic ${!data.service ? 'text-gray-300' : 'text-gray-800'}`}>
                                {data.service || 'Descrição do serviço ou produto...'}
                             </p>
                         </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4">
                    <div className="flex flex-col items-end gap-1 mb-8">
                        <div className="text-sm text-gray-600 flex items-center">
                            <span className="font-bold border-b border-gray-400 min-w-[80px] inline-block text-center mr-1 pb-0.5">
                                {data.city || 'Cidade'}
                            </span>
                            , 
                            <span className="ml-2 font-bold border-b border-gray-400 min-w-[100px] inline-block text-center pb-0.5">
                                {data.date ? formatDate(data.date) : 'Data'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center mt-auto">
                         <div className="w-full max-w-[200px] border-b border-gray-900 mb-2"></div>
                         <p className="font-bold text-xs uppercase text-gray-900 tracking-wide">{data.receiverName || 'Assinatura do Recebedor'}</p>
                         <p className="text-[10px] text-gray-500 font-mono mt-0.5">{data.receiverDocument}</p>
                    </div>
                </div>
            </div>
            
             {/* Cut Line Visualization */}
             <div className="absolute bottom-0 left-0 w-full flex items-center justify-center pb-2 opacity-60 pointer-events-none">
                <div className="h-px bg-gray-400 w-full border-b border-dashed border-gray-400"></div>
                <div className="absolute bg-[#fffcf5] px-2 text-gray-400">
                    <Icon name="scissors" className="w-4 h-4 rotate-90" />
                </div>
            </div>
        </div>
    );
};

export default React.memo(ReceiptPreview);
