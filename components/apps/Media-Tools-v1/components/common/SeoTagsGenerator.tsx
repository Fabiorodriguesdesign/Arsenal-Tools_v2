
import React, { useState, useMemo, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { cleanFileName, formatTags, generateTitle, expandTagsWithSynonyms, COMMERCIAL_TERMS } from '../../utils/seo';
import { ClipboardIcon, ClipboardCheckIcon, PlusIcon, ArrowLeftIcon, ArrowRightIcon, RefreshIcon, ImageIcon, ChevronDownIcon, FileCodeIcon } from '../icons';

interface SeoSettings {
    includeCommercialTags: boolean;
    useSynonyms: boolean;
}

export type TagSeparatorType = ', ' | '-' | '; ' | ' ';

interface SeoTagsGeneratorProps {
    files: File[];
    t: (key: string) => string;
    externalSettings?: SeoSettings;
    onSettingsChange?: (settings: SeoSettings) => void;
    externalTagSeparator?: TagSeparatorType;
    onTagSeparatorChange?: (separator: TagSeparatorType) => void;
}

const SeoTagsGenerator: React.FC<SeoTagsGeneratorProps> = ({ 
    files, 
    t, 
    externalSettings, 
    onSettingsChange,
    externalTagSeparator,
    onTagSeparatorChange
}) => {
    const { addToast } = useToast();
    const [isOpen, setIsOpen] = useState(false); // Inicia minimizado
    const [localSeparator, setLocalSeparator] = useState<TagSeparatorType>(', ');
    const [previewIndex, setPreviewIndex] = useState(0);
    const [hasCopiedTags, setHasCopiedTags] = useState(false);
    const [hasCopiedTitle, setHasCopiedTitle] = useState(false);
    
    const separator = externalTagSeparator !== undefined ? externalTagSeparator : localSeparator;

    const handleSeparatorChange = (sep: TagSeparatorType) => {
        if (onTagSeparatorChange) {
            onTagSeparatorChange(sep);
        } else {
            setLocalSeparator(sep);
        }
    };
    
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const [localIncludeCommercialTags, setLocalIncludeCommercialTags] = useState(false);
    const [localUseSynonyms, setLocalUseSynonyms] = useState(false);
    
    const includeCommercialTags = externalSettings ? externalSettings.includeCommercialTags : localIncludeCommercialTags;
    const useSynonyms = externalSettings ? externalSettings.useSynonyms : localUseSynonyms;

    const [prefix, setPrefix] = useState('');
    const [suffix, setSuffix] = useState('');
    
    const [editedTitle, setEditedTitle] = useState('');
    const [editedTags, setEditedTags] = useState('');
    
    const [isManualTitle, setIsManualTitle] = useState(false);

    const handleSettingChange = (key: keyof SeoSettings, value: boolean) => {
        if (onSettingsChange && externalSettings) {
            onSettingsChange({ ...externalSettings, [key]: value });
        } else {
            if (key === 'includeCommercialTags') setLocalIncludeCommercialTags(value);
            if (key === 'useSynonyms') setLocalUseSynonyms(value);
        }
    };

    useEffect(() => {
        if (previewIndex >= files.length) {
            setPreviewIndex(0);
        }
    }, [files.length]);

    const currentFile = files[previewIndex];

    useEffect(() => {
        if (!currentFile) {
            setImagePreviewUrl(null);
            return;
        }

        if (currentFile.type.startsWith('image/')) {
            const url = URL.createObjectURL(currentFile);
            setImagePreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImagePreviewUrl(null);
        }
    }, [currentFile]);

    useEffect(() => {
        setIsManualTitle(false);
    }, [currentFile]);

    useEffect(() => {
        if (!currentFile || isManualTitle) return;

        let baseTags = cleanFileName(currentFile.name);
        let titleBase = generateTitle(baseTags);
        if (prefix) titleBase = `${prefix} ${titleBase}`;
        if (suffix) titleBase = `${titleBase} ${suffix}`;
        
        setEditedTitle(titleBase);
    }, [currentFile, prefix, suffix, isManualTitle]);

    useEffect(() => {
        if (!currentFile) return;

        let baseTags = cleanFileName(currentFile.name);
        
        if (useSynonyms) {
            baseTags = expandTagsWithSynonyms(baseTags);
        }

        let tagsList = [...baseTags];
        if (includeCommercialTags) {
            tagsList = [...tagsList, ...COMMERCIAL_TERMS];
        }
        
        tagsList = [...new Set(tagsList)];
        let tagsGenerated = formatTags(tagsList, separator);
        
        setEditedTags(tagsGenerated);
    }, [currentFile, separator, useSynonyms, includeCommercialTags]);

    const handleManualTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedTitle(e.target.value);
        setIsManualTitle(true);
    };

    const handleResetTitle = () => {
        setIsManualTitle(false);
    };

    const handleCopy = (text: string, type: 'tags' | 'title') => {
        navigator.clipboard.writeText(text);
        if (type === 'tags') {
            setHasCopiedTags(true);
            setTimeout(() => setHasCopiedTags(false), 2000);
        } else {
            setHasCopiedTitle(true);
            setTimeout(() => setHasCopiedTitle(false), 2000);
        }
        addToast("Copiado para a área de transferência!", "success");
    };

    const addTermToTitle = (term: string) => {
        setEditedTitle(prev => `${prev} ${term}`);
        setIsManualTitle(true);
    };

    const handleNext = () => setPreviewIndex(prev => (prev + 1) % files.length);
    const handlePrev = () => setPreviewIndex(prev => (prev - 1 + files.length) % files.length);

    if (!files.length) return null;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-sm mt-8 overflow-hidden transition-all duration-300">
            {/* Header Accordion */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-[#ff0e00]/10 rounded text-[#ff0e00]">
                        <FileCodeIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <h4 className="text-sm font-bold text-zinc-100">Gerador de SEO Inteligente</h4>
                        <p className="text-xs text-zinc-500">Títulos e tags automáticos para seus arquivos</p>
                    </div>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-6 relative">
                    {/* Background Decorativo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff0e00]/5 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

                    <div className="flex flex-col gap-6 relative z-10">
                        
                        {/* Area de Preview e Navegação */}
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center gap-4 w-full">
                                <button 
                                    onClick={handlePrev}
                                    disabled={files.length <= 1}
                                    className="p-3 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                                    title="Anterior"
                                >
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </button>
                                
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative group w-32 h-32 bg-zinc-950 rounded-xl overflow-hidden border-2 border-zinc-800 shadow-lg">
                                        {imagePreviewUrl ? (
                                            <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                <ImageIcon className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                            <span className="text-[10px] text-white font-mono font-bold">
                                                {previewIndex + 1}/{files.length}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-mono max-w-[150px] truncate text-center bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/50">
                                        {currentFile?.name}
                                    </p>
                                </div>

                                <button 
                                    onClick={handleNext}
                                    disabled={files.length <= 1}
                                    className="p-3 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                                    title="Próximo"
                                >
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Título Sugerido */}
                        <div className="relative group">
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                    <label className="block text-xs font-bold text-zinc-400 uppercase">Título Otimizado (Alt Text)</label>
                                    {isManualTitle && (
                                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20">
                                            Editado Manualmente
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {isManualTitle && (
                                        <button 
                                            onClick={handleResetTitle}
                                            className="text-[10px] text-zinc-500 hover:text-[#ff0e00] flex items-center gap-1 transition-colors"
                                            title="Restaurar título automático"
                                        >
                                            <RefreshIcon className="w-3 h-3" /> Restaurar
                                        </button>
                                    )}
                                    <span className="text-[10px] text-zinc-600">{editedTitle.length} chars</span>
                                </div>
                            </div>
                            <div className="relative">
                                <textarea 
                                    value={editedTitle}
                                    onChange={handleManualTitleChange}
                                    className={`w-full bg-zinc-950 border rounded-lg p-3 text-sm text-zinc-100 focus:ring-1 outline-none min-h-[50px] resize-y pr-10 transition-all shadow-inner ${
                                        isManualTitle 
                                        ? 'border-amber-500/30 focus:border-amber-500/50 focus:ring-amber-500/50' 
                                        : 'border-zinc-700 focus:border-[#ff0e00] focus:ring-[#ff0e00]'
                                    }`}
                                    rows={2}
                                />
                                <button 
                                    onClick={() => handleCopy(editedTitle, 'title')}
                                    className="absolute right-2 top-2 p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-colors shadow-sm"
                                    title="Copiar Título"
                                >
                                    {hasCopiedTitle ? <ClipboardCheckIcon className="w-4 h-4 text-green-500" /> : <ClipboardIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Painel de Controle (Compacto) */}
                        <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                            <div className="flex flex-wrap gap-4 items-end mb-4">
                                <div className="flex-1 min-w-[100px]">
                                    <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Prefixo</label>
                                    <input 
                                        type="text" 
                                        value={prefix}
                                        onChange={(e) => setPrefix(e.target.value)}
                                        placeholder="Novo"
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 focus:border-[#ff0e00] focus:ring-1 focus:ring-[#ff0e00] outline-none transition-all placeholder-zinc-600"
                                    />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                    <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Sufixo</label>
                                    <input 
                                        type="text" 
                                        value={suffix}
                                        onChange={(e) => setSuffix(e.target.value)}
                                        placeholder="HD"
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 focus:border-[#ff0e00] focus:ring-1 focus:ring-[#ff0e00] outline-none transition-all placeholder-zinc-600"
                                    />
                                </div>
                                <div className="flex items-center gap-4 py-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={useSynonyms}
                                            onChange={(e) => handleSettingChange('useSynonyms', e.target.checked)}
                                            className="rounded border-zinc-600 text-[#ff0e00] focus:ring-[#ff0e00] bg-zinc-950"
                                        />
                                        <span className="text-xs text-zinc-400 font-medium hover:text-zinc-200 transition-colors">Sinônimos</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={includeCommercialTags}
                                            onChange={(e) => handleSettingChange('includeCommercialTags', e.target.checked)}
                                            className="rounded border-zinc-600 text-[#ff0e00] focus:ring-[#ff0e00] bg-zinc-950"
                                        />
                                        <span className="text-xs text-zinc-400 font-medium hover:text-zinc-200 transition-colors">Tags Com.</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2">Termos Rápidos</label>
                                <div className="flex flex-wrap gap-2">
                                    {COMMERCIAL_TERMS.map(term => (
                                        <button
                                            key={term}
                                            onClick={() => addTermToTitle(term)}
                                            className="px-2 py-1 bg-zinc-900 border border-zinc-700 hover:border-[#ff0e00] hover:text-[#ff0e00] text-zinc-400 text-[10px] font-bold uppercase rounded transition-all active:scale-95 flex items-center gap-1"
                                        >
                                            <PlusIcon className="w-3 h-3" />
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tags Geradas */}
                        <div className="relative group">
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold text-zinc-400 uppercase">Tags Geradas (Keywords)</label>
                                <div className="flex gap-1">
                                    {[', ', '; ', ' - ', ' '].map((sep) => (
                                        <button
                                            key={sep}
                                            onClick={() => handleSeparatorChange(sep as TagSeparatorType)}
                                            className={`px-1.5 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                                                separator === sep 
                                                ? 'bg-[#ff0e00]/20 border-[#ff0e00] text-[#ff0e00]' 
                                                : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'
                                            }`}
                                        >
                                            {sep === ' ' ? 'SPC' : sep.trim()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <textarea 
                                    value={editedTags}
                                    onChange={(e) => setEditedTags(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-400 focus:text-zinc-200 focus:border-[#ff0e00] focus:ring-1 focus:ring-[#ff0e00] outline-none min-h-[80px] resize-y pr-10 transition-all shadow-inner font-mono leading-relaxed"
                                />
                                <button 
                                    onClick={() => handleCopy(editedTags, 'tags')}
                                    className="absolute right-2 top-2 p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-colors shadow-sm"
                                    title="Copiar Tags"
                                >
                                    {hasCopiedTags ? <ClipboardCheckIcon className="w-4 h-4 text-green-500" /> : <ClipboardIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-600">
                        <span>Arsenal Intelligence v2.4</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeoTagsGenerator;
