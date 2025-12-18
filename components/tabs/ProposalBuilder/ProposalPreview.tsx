import React from 'react';
import { ProposalData, ProposalLanguage } from '../../../types/proposal';
import { useTranslation } from '../../../hooks/useTranslation';
import FlagIcon from '../../shared/FlagIcon';

interface ProposalPreviewProps {
  data: ProposalData;
  onUpdateData: (data: Partial<ProposalData>) => void;
}

// Simple internal translation dictionary for the preview
const getLabel = (lang: ProposalLanguage, key: string) => {
    const dict: Record<ProposalLanguage, Record<string, string>> = {
        pt: {
            proposal: 'ORÇAMENTO',
            preparedFor: 'PREPARADO PARA',
            date: 'Data',
            valid: 'Válido até',
            project: 'PROJETO',
            desc: 'DESCRIÇÃO',
            qty: 'QTD',
            price: 'UNIT.',
            subtotal: 'SUBTOTAL',
            total: 'TOTAL',
            terms: 'Termos e Condições',
            from: 'DE',
            to: 'PARA',
            issue: 'Emissão',
            validity: 'Validade',
            item: 'ITEM',
            provider: 'PRESTADOR'
        },
        en: {
            proposal: 'PROPOSAL',
            preparedFor: 'PREPARED FOR',
            date: 'Date',
            valid: 'Valid until',
            project: 'PROJECT',
            desc: 'DESCRIPTION',
            qty: 'QTY',
            price: 'UNIT PRICE',
            subtotal: 'SUBTOTAL',
            total: 'TOTAL',
            terms: 'Terms and Conditions',
            from: 'FROM',
            to: 'TO',
            issue: 'Date',
            validity: 'Valid',
            item: 'ITEM',
            provider: 'PROVIDER'
        },
        es: {
            proposal: 'PRESUPUESTO',
            preparedFor: 'PREPARADO PARA',
            date: 'Fecha',
            valid: 'Válido hasta',
            project: 'PROYECTO',
            desc: 'DESCRIPCIÓN',
            qty: 'CANT',
            price: 'UNITARIO',
            subtotal: 'SUBTOTAL',
            total: 'TOTAL',
            terms: 'Términos y Condicione',
            from: 'DE',
            to: 'PARA',
            issue: 'Emisión',
            validity: 'Validez',
            item: 'ITEM',
            provider: 'PROVEEDOR'
        }
    };
    return dict[lang]?.[key] || key;
};

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ data, onUpdateData }) => {
  const { t } = useTranslation();

  const formatCurrency = (val: number) => {
      try {
          return new Intl.NumberFormat(data.lang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: data.currency }).format(val);
      } catch {
          return `${data.currency} ${val.toFixed(2)}`;
      }
  };

  const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(data.lang === 'pt' ? 'pt-BR' : 'en-US').format(date);
  };

  const total = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const l = (key: string) => getLabel(data.lang, key);

  const languages: { id: ProposalLanguage, name: string, flag: string }[] = [
      { id: 'pt', name: t('proposalBuilder.preview.lang.pt'), flag: 'BRL' },
      { id: 'en', name: t('proposalBuilder.preview.lang.en'), flag: 'USD' },
      { id: 'es', name: t('proposalBuilder.preview.lang.es'), flag: 'EUR' }
  ];

  // --- Templates Render Logic ---

  const ModernLayout = () => (
    <div className="bg-white text-gray-800 font-sans relative h-full p-8">
        <header className="flex justify-between items-start mb-12">
            <div className="flex gap-4">
                {data.providerLogo && (
                    <div className="w-20 h-20 object-contain">
                        <img src={data.providerLogo} alt="Logo" className="max-w-full max-h-full" />
                    </div>
                )}
                <div>
                    <h1 className="font-bold text-xl text-gray-900">{data.providerCompany || data.providerName}</h1>
                    <div className="text-sm text-gray-600 space-y-1 mt-1">
                        {data.providerDocument && <p>{data.providerDocument}</p>}
                        {data.providerEmail && <p>{data.providerEmail}</p>}
                        {data.providerPhone && <p>{data.providerPhone}</p>}
                        {data.providerAddress && <p>{data.providerAddress}</p>}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{l('proposal')}</h2>
                <div className="text-sm text-gray-600 space-y-1">
                    {data.issueDate && <p><span className="font-semibold">{l('date')}:</span> {formatDate(data.issueDate)}</p>}
                    {data.validUntil && <p><span className="font-semibold">{l('valid')}:</span> {formatDate(data.validUntil)}</p>}
                </div>
            </div>
        </header>

        <hr className="border-gray-200 mb-8" />

        <div className="grid grid-cols-2 gap-12 mb-10">
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{l('preparedFor')}</h3>
                <div className="text-gray-900 font-bold text-lg">{data.clientCompany || data.clientName}</div>
                {data.clientCompany && data.clientName && <div className="text-gray-700 text-sm mt-1">A/C: {data.clientName}</div>}
                <div className="text-sm text-gray-600 space-y-0.5 mt-2">
                    {data.clientDocument && <p>{data.clientDocument}</p>}
                    {data.clientEmail && <p>{data.clientEmail}</p>}
                    {data.clientAddress && <p>{data.clientAddress}</p>}
                </div>
            </div>
            <div>
                    {data.projectTitle && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{l('project')}</h3>
                            <p className="font-semibold text-gray-900">{data.projectTitle}</p>
                        </div>
                    )}
            </div>
        </div>

        {data.introduction && (
            <div className="mb-10">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.introduction}</p>
            </div>
        )}

        <div className="mb-8">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                        <th className="py-3 px-4 text-left rounded-l-md">{l('desc')}</th>
                        <th className="py-3 px-4 text-center w-20">{l('qty')}</th>
                        <th className="py-3 px-4 text-right w-32">{l('price')}</th>
                        <th className="py-3 px-4 text-right w-32 rounded-r-md">{l('total')}</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {data.items.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-400 italic">Nenhum item adicionado</td>
                        </tr>
                    )}
                    {data.items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-4 px-4 align-top">
                                <div className="font-bold text-gray-900">{item.name}</div>
                                {item.description && <div className="text-gray-600 mt-1 text-xs">{item.description}</div>}
                            </td>
                            <td className="py-4 px-4 text-center align-top text-gray-700">{item.quantity}</td>
                            <td className="py-4 px-4 text-right align-top text-gray-700">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-4 px-4 text-right align-top font-bold text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="flex justify-end mb-12">
            <div className="bg-gray-50 p-6 rounded-lg min-w-[250px]">
                    <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-gray-900">{l('total')}</span>
                    <span className="font-bold text-2xl text-primary">{formatCurrency(total)}</span>
                </div>
            </div>
        </div>

        {data.terms && (
            <div className="mt-auto border-t border-gray-200 pt-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{l('terms')}</h3>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{data.terms}</p>
            </div>
        )}
    </div>
  );

  const ClassicLayout = () => (
    <div className="bg-white text-black font-serif p-10">
        <div className="text-center border-b-2 border-black pb-6 mb-8">
            {data.providerLogo && (
                <img src={data.providerLogo} alt="Logo" className="h-16 object-contain mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">{data.providerCompany || data.providerName}</h1>
            <div className="text-sm text-gray-600 flex flex-wrap justify-center gap-3">
                {data.providerEmail && <span>{data.providerEmail}</span>}
                {data.providerPhone && <span>• {data.providerPhone}</span>}
                {data.providerDocument && <span>• {data.providerDocument}</span>}
            </div>
        </div>

        <div className="flex justify-between mb-8">
            <div>
                <h3 className="font-bold uppercase text-sm mb-2 border-b border-gray-300 pb-1 inline-block">Cliente</h3>
                <div className="text-base font-semibold">{data.clientCompany || data.clientName}</div>
                {data.clientCompany && data.clientName && <div className="text-sm">{data.clientName}</div>}
                <div className="text-sm text-gray-600">{data.clientAddress}</div>
            </div>
            <div className="text-right">
                <h3 className="font-bold uppercase text-sm mb-2 border-b border-gray-300 pb-1 inline-block">{l('proposal')}</h3>
                <div className="text-sm"><span className="font-semibold">{l('issue')}:</span> {data.issueDate ? formatDate(data.issueDate) : '-'}</div>
                <div className="text-sm"><span className="font-semibold">{l('validity')}:</span> {data.validUntil ? formatDate(data.validUntil) : '-'}</div>
            </div>
        </div>

        {data.projectTitle && (
            <div className="mb-8 text-center">
                <h2 className="text-xl font-bold uppercase tracking-wide">{data.projectTitle}</h2>
                {data.introduction && <p className="text-gray-700 mt-2 text-justify leading-relaxed">{data.introduction}</p>}
            </div>
        )}

        <table className="w-full border-collapse border border-black mb-8 text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border border-black p-2 text-left">{l('desc')}</th>
                    <th className="border border-black p-2 text-center w-16">{l('qty')}</th>
                    <th className="border border-black p-2 text-right w-24">{l('price')}</th>
                    <th className="border border-black p-2 text-right w-24">{l('total')}</th>
                </tr>
            </thead>
            <tbody>
                {data.items.map((item) => (
                    <tr key={item.id}>
                        <td className="border border-black p-2">
                            <div className="font-semibold">{item.name}</div>
                            {item.description && <div className="text-xs text-gray-600 italic">{item.description}</div>}
                        </td>
                        <td className="border border-black p-2 text-center">{item.quantity}</td>
                        <td className="border border-black p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="border border-black p-2 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="bg-gray-100 font-bold">
                    <td colSpan={3} className="border border-black p-2 text-right uppercase">{l('total')}</td>
                    <td className="border border-black p-2 text-right">{formatCurrency(total)}</td>
                </tr>
            </tfoot>
        </table>

        {data.terms && (
            <div className="mt-8 text-xs text-gray-600 text-justify border-t border-gray-300 pt-4">
                <span className="font-bold text-black">{l('terms')}:</span> {data.terms}
            </div>
        )}
    </div>
  );

  const CleanLayout = () => (
    <div className="bg-white text-slate-700 font-sans p-10">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-light text-slate-900 mb-1">{l('proposal')}</h1>
                <p className="text-sm text-slate-500">#{new Date().getFullYear()}-{Math.floor(Math.random() * 1000)}</p>
            </div>
            {data.providerLogo && (
                <img src={data.providerLogo} alt="Logo" className="h-12 object-contain" />
            )}
        </div>

        <div className="flex gap-12 mb-12 text-sm">
            <div className="w-1/2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{l('from')}</h3>
                <p className="font-semibold text-slate-900">{data.providerCompany || data.providerName}</p>
                <p>{data.providerEmail}</p>
            </div>
            <div className="w-1/2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{l('to')}</h3>
                <p className="font-semibold text-slate-900">{data.clientCompany || data.clientName}</p>
                <p>{data.clientEmail}</p>
            </div>
        </div>

        {data.projectTitle && (
            <div className="mb-10">
                <h2 className="text-xl font-medium text-slate-900 mb-2">{data.projectTitle}</h2>
                {data.introduction && <p className="text-slate-600 leading-relaxed">{data.introduction}</p>}
            </div>
        )}

        <div className="mb-10">
            {data.items.map((item) => (
                <div key={item.id} className="flex justify-between py-4 border-b border-slate-100 last:border-0">
                    <div className="flex-grow pr-4">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        {item.description && <div className="text-sm text-slate-500 mt-1">{item.description}</div>}
                    </div>
                    <div className="text-right whitespace-nowrap">
                        <div className="font-medium text-slate-900">{formatCurrency(item.quantity * item.unitPrice)}</div>
                        {item.quantity > 1 && <div className="text-xs text-slate-400">{item.quantity} x {formatCurrency(item.unitPrice)}</div>}
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end mb-12">
            <div className="text-right">
                <div className="text-sm text-slate-500 mb-1">{l('total')}</div>
                <div className="text-3xl font-light text-slate-900">{formatCurrency(total)}</div>
            </div>
        </div>

        <div className="flex justify-between items-end border-t border-slate-100 pt-6 text-xs text-slate-400">
            <div>
                {data.issueDate && <span>{l('issue')}: {formatDate(data.issueDate)}</span>}
                {data.validUntil && <span className="ml-4">{l('validity')}: {formatDate(data.validUntil)}</span>}
            </div>
            <div>{data.providerCompany || data.providerName}</div>
        </div>
    </div>
  );

  return (
    <div className="animate-fadeIn">
        {/* Options Panel */}
        <div className="mb-6 p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
            <h3 className="text-lg font-bold mb-4 text-light-text dark:text-dark-text">{t('resumeBuilder.preview.options')}</h3>
            <div className="flex flex-col gap-6">
                {/* Template Selector */}
                <div>
                    <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-2">
                        {t('resumeBuilder.preview.template.label')}
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        <button 
                            onClick={() => onUpdateData({ templateId: 'modern' })}
                            className={`p-3 rounded border-2 text-sm font-medium transition-all ${data.templateId === 'modern' ? 'border-primary bg-primary/5 text-primary' : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted'}`}
                        >
                            {t('proposalBuilder.preview.template.modern')}
                        </button>
                        <button 
                            onClick={() => onUpdateData({ templateId: 'classic' })}
                            className={`p-3 rounded border-2 text-sm font-medium transition-all ${data.templateId === 'classic' ? 'border-primary bg-primary/5 text-primary' : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted'}`}
                        >
                            {t('proposalBuilder.preview.template.classic')}
                        </button>
                        <button 
                            onClick={() => onUpdateData({ templateId: 'clean' })}
                            className={`p-3 rounded border-2 text-sm font-medium transition-all ${data.templateId === 'clean' ? 'border-primary bg-primary/5 text-primary' : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted'}`}
                        >
                            {t('proposalBuilder.preview.template.clean')}
                        </button>
                    </div>
                </div>

                {/* Language Selector */}
                <div>
                    <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-2">
                        Idioma do Documento
                    </label>
                    <div className="flex gap-2">
                        {languages.map(l => (
                            <button
                                key={l.id}
                                onClick={() => onUpdateData({ lang: l.id })}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${data.lang === l.id ? 'border-primary bg-primary/10 text-primary' : 'border-light-border dark:border-dark-border text-light-muted hover:bg-light-bg dark:hover:bg-dark-card'}`}
                            >
                                <FlagIcon currency={l.flag} className="w-5 h-3.5 rounded-sm shadow-sm" />
                                <span className="text-sm font-medium">{l.name}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-light-muted dark:text-dark-muted mt-2">
                        * Esta opção traduz apenas os rótulos (ex: "Data", "Total"). O conteúdo digitado por você não será traduzido automaticamente.
                    </p>
                </div>
            </div>
        </div>

        {/* Preview Container */}
        <div className="w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-8 rounded-xl flex justify-center">
            {/* A4 Paper Container */}
            <div className="min-w-[800px] w-[800px] min-h-[1131px] bg-white shadow-2xl origin-top transform scale-[0.6] sm:scale-[0.8] md:scale-100 transition-transform duration-300 relative">
                {data.templateId === 'classic' ? <ClassicLayout /> : data.templateId === 'clean' ? <CleanLayout /> : <ModernLayout />}
                
                {/* Footer Branding */}
                <div className="absolute bottom-6 left-0 w-full text-center opacity-20">
                    <p className="text-xs font-bold uppercase tracking-widest">Gerado via Kit Freelancer</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default React.memo(ProposalPreview);