
import React from 'react';
import { ProposalData, ProposalLanguage } from '../../../types/proposal';
import { useTranslation } from '../../../hooks/useTranslation';

interface ProposalPreviewProps {
  data: ProposalData;
  onUpdateData: (data: Partial<ProposalData>) => void;
}

// Helper para formatação
const formatCurrency = (val: number, currency: string, lang: string) => {
    try {
        return new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency }).format(val);
    } catch {
        return `${currency} ${val.toFixed(2)}`;
    }
};

const formatDate = (dateString: string, lang: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US').format(date);
};

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ data, onUpdateData }) => {
  const { t } = useTranslation();
  const total = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const lang = data.lang;

  // Renderização Condicional baseada no Template
  const renderTemplate = () => {
      switch (data.templateId) {
          case 'classic': return <ClassicTemplate data={data} total={total} lang={lang} />;
          case 'clean': return <CleanTemplate data={data} total={total} lang={lang} />;
          default: return <ModernTemplate data={data} total={total} lang={lang} />;
      }
  };

  return (
    <div className="relative w-full aspect-[210/297] bg-white text-gray-800 shadow-2xl rounded-sm overflow-hidden text-[10px] sm:text-xs leading-snug cursor-default select-none border border-gray-300">
        {renderTemplate()}
        
         {/* Footer Branding (Overlay) */}
         <div className="absolute bottom-2 left-0 w-full text-center opacity-20 pointer-events-none">
            <p className="text-[8px] font-bold uppercase tracking-widest">Gerado via Kit Freelancer</p>
        </div>
    </div>
  );
};

/* --- TEMPLATES --- */

const ModernTemplate = ({ data, total, lang }: { data: ProposalData, total: number, lang: string }) => (
    <div className="h-full flex flex-col font-sans">
        <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
             <div>
                <h1 className="text-xl font-bold uppercase tracking-wider mb-1">Orçamento</h1>
                <p className="text-gray-400 text-[10px]">#{new Date().getFullYear()}-{Math.floor(Math.random() * 1000)}</p>
             </div>
             {data.providerLogo && (
                 <img src={data.providerLogo} className="h-10 object-contain bg-white rounded p-1" alt="Logo" />
             )}
        </div>

        <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between gap-4 mb-8">
                <div className="w-1/2">
                    <h3 className="font-bold text-gray-400 text-[9px] uppercase tracking-wider mb-1">De</h3>
                    <p className="font-bold text-sm">{data.providerCompany || data.providerName}</p>
                    <p className="text-gray-500">{data.providerEmail}</p>
                    <p className="text-gray-500">{data.providerPhone}</p>
                </div>
                <div className="w-1/2 text-right">
                    <h3 className="font-bold text-gray-400 text-[9px] uppercase tracking-wider mb-1">Para</h3>
                    <p className="font-bold text-sm">{data.clientCompany || data.clientName}</p>
                    {data.clientCompany && <p className="text-gray-500">A/C: {data.clientName}</p>}
                    <p className="text-gray-500">{data.clientEmail}</p>
                </div>
            </div>

            {(data.projectTitle || data.introduction) && (
                <div className="mb-6 bg-gray-50 p-3 rounded border border-gray-100">
                    {data.projectTitle && <h4 className="font-bold mb-1">{data.projectTitle}</h4>}
                    <p className="text-gray-600 whitespace-pre-wrap">{data.introduction}</p>
                </div>
            )}

            <div className="mb-4">
                 <div className="flex border-b-2 border-gray-900 pb-1 mb-2 font-bold uppercase text-[9px] tracking-wider">
                     <div className="flex-grow">Item</div>
                     <div className="w-12 text-center">Qtd</div>
                     <div className="w-16 text-right">Preço</div>
                     <div className="w-16 text-right">Total</div>
                 </div>
                 {data.items.length === 0 && <p className="text-center text-gray-400 italic py-4">Adicione itens ao orçamento</p>}
                 {data.items.map((item) => (
                     <div key={item.id} className="flex py-2 border-b border-gray-100 last:border-0">
                         <div className="flex-grow pr-2">
                             <p className="font-bold">{item.name}</p>
                             <p className="text-gray-500 text-[9px]">{item.description}</p>
                         </div>
                         <div className="w-12 text-center">{item.quantity}</div>
                         <div className="w-16 text-right text-gray-600">{formatCurrency(item.unitPrice, data.currency, lang)}</div>
                         <div className="w-16 text-right font-bold">{formatCurrency(item.quantity * item.unitPrice, data.currency, lang)}</div>
                     </div>
                 ))}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex justify-end items-center mb-6">
                     <div className="text-right">
                         <p className="text-gray-500 text-[10px] uppercase">Total Estimado</p>
                         <p className="text-2xl font-bold text-gray-900">{formatCurrency(total, data.currency, lang)}</p>
                     </div>
                </div>

                <div className="flex justify-between text-[9px] text-gray-400">
                     <div>
                         <span className="font-bold text-gray-600">Emissão:</span> {data.issueDate ? formatDate(data.issueDate, lang) : '-'}
                     </div>
                     <div>
                         <span className="font-bold text-gray-600">Validade:</span> {data.validUntil ? formatDate(data.validUntil, lang) : '-'}
                     </div>
                </div>
            </div>
        </div>
    </div>
);

const ClassicTemplate = ({ data, total, lang }: { data: ProposalData, total: number, lang: string }) => (
     <div className="h-full flex flex-col font-serif p-8 bg-[#fffefc]">
         <div className="text-center border-b border-black pb-4 mb-6">
             <h1 className="text-2xl font-bold uppercase tracking-widest">{data.providerCompany || data.providerName}</h1>
             <div className="text-[9px] text-gray-600 mt-1 flex justify-center gap-3">
                 {data.providerEmail && <span>{data.providerEmail}</span>}
                 {data.providerPhone && <span>• {data.providerPhone}</span>}
                 {data.providerDocument && <span>• {data.providerDocument}</span>}
             </div>
         </div>

         <div className="flex justify-between mb-8">
             <div>
                 <p className="font-bold uppercase text-[9px] text-gray-500 mb-1">Cliente</p>
                 <p className="font-bold text-lg">{data.clientCompany || data.clientName}</p>
                 <p className="text-gray-600">{data.clientAddress}</p>
             </div>
             <div className="text-right">
                 <p className="font-bold uppercase text-[9px] text-gray-500 mb-1">Proposta</p>
                 <p className="font-bold text-lg">#{new Date().getFullYear()}</p>
                 <p className="text-gray-600">{data.issueDate ? formatDate(data.issueDate, lang) : ''}</p>
             </div>
         </div>

         {data.projectTitle && (
             <div className="mb-6 text-center">
                 <h2 className="font-bold text-lg uppercase tracking-wide border-b border-gray-300 inline-block pb-1">{data.projectTitle}</h2>
                 {data.introduction && <p className="text-gray-700 mt-2 text-justify italic">{data.introduction}</p>}
             </div>
         )}

         <table className="w-full mb-8">
             <thead>
                 <tr className="border-b-2 border-black">
                     <th className="text-left py-1 uppercase text-[9px]">Descrição</th>
                     <th className="text-center py-1 uppercase text-[9px] w-10">Qtd</th>
                     <th className="text-right py-1 uppercase text-[9px] w-20">Unitário</th>
                     <th className="text-right py-1 uppercase text-[9px] w-20">Total</th>
                 </tr>
             </thead>
             <tbody>
                  {data.items.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-400 italic">Lista vazia</td></tr>}
                  {data.items.map((item) => (
                     <tr key={item.id} className="border-b border-gray-200">
                         <td className="py-2">
                             <p className="font-bold">{item.name}</p>
                             {item.description && <p className="text-gray-500 text-[9px] italic">{item.description}</p>}
                         </td>
                         <td className="py-2 text-center">{item.quantity}</td>
                         <td className="py-2 text-right">{formatCurrency(item.unitPrice, data.currency, lang)}</td>
                         <td className="py-2 text-right font-bold">{formatCurrency(item.quantity * item.unitPrice, data.currency, lang)}</td>
                     </tr>
                 ))}
             </tbody>
         </table>

         <div className="mt-auto border-t-2 border-black pt-2 flex justify-between items-center">
             <div className="w-1/2 text-[8px] text-gray-500 text-justify">
                 {data.terms && <p><strong>Termos:</strong> {data.terms.substring(0, 150)}{data.terms.length > 150 ? '...' : ''}</p>}
             </div>
             <div className="text-right">
                 <p className="text-lg font-bold">Total: {formatCurrency(total, data.currency, lang)}</p>
             </div>
         </div>
     </div>
);

const CleanTemplate = ({ data, total, lang }: { data: ProposalData, total: number, lang: string }) => (
    <div className="h-full flex flex-col font-sans p-8">
        <div className="flex justify-between items-start mb-10">
             <div className="text-4xl font-light text-gray-800">Proposta</div>
             {data.providerLogo && <img src={data.providerLogo} className="h-12 object-contain" alt="Logo" />}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
             <div>
                 <p className="text-gray-400 uppercase text-[9px] tracking-widest mb-2">De</p>
                 <p className="font-bold">{data.providerName}</p>
                 <p className="text-gray-500">{data.providerEmail}</p>
             </div>
             <div>
                 <p className="text-gray-400 uppercase text-[9px] tracking-widest mb-2">Para</p>
                 <p className="font-bold">{data.clientName}</p>
                 <p className="text-gray-500">{data.clientEmail}</p>
             </div>
        </div>

        <div className="mb-8">
            {data.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3 border-b border-gray-100">
                    <div className="pr-4">
                        <p className="font-medium text-gray-800">{item.name}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                        <p className="font-bold text-gray-800">{formatCurrency(item.quantity * item.unitPrice, data.currency, lang)}</p>
                         {item.quantity > 1 && <p className="text-[8px] text-gray-400">{item.quantity} x {formatCurrency(item.unitPrice, data.currency, lang)}</p>}
                    </div>
                </div>
            ))}
            {data.items.length === 0 && <div className="py-8 bg-gray-50 text-center text-gray-400 rounded">Itens aparecerão aqui</div>}
        </div>

        <div className="mt-auto flex justify-end">
             <div className="text-right">
                 <p className="text-gray-400 uppercase text-[9px] tracking-widest mb-1">Valor Total</p>
                 <p className="text-3xl font-light text-gray-900">{formatCurrency(total, data.currency, lang)}</p>
             </div>
        </div>
    </div>
);

export default React.memo(ProposalPreview);
