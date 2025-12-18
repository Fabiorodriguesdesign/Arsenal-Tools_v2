
import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { UploadIcon, DownloadIcon, RefreshIcon, LinkIcon, ChevronDownIcon, CodeBracketIcon } from '../icons';
import FileUpload from '../FileUpload';
import { vectorizeImage } from '../../services/vectorizerService';
import { NumberInput } from '../../../../ui/NumberInput';

const panelClasses = "bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md";

const ImgToSvg: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [svgOutput, setSvgOutput] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');
    
    // Configurações
    const [colorCount, setColorCount] = useState(16);
    const [blur, setBlur] = useState(0);
    const [removeBackground, setRemoveBackground] = useState(false);
    const [trimSvg, setTrimSvg] = useState(true);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    
    // Advanced Settings
    const [ltres, setLtres] = useState(1);
    const [qtres, setQtres] = useState(1);
    const [pathomit, setPathomit] = useState(8);
    const [colorquantcycles, setColorquantcycles] = useState(4);

    const handleFileAdd = useCallback((files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            // Remove JPG support
            const isSupported = file.type === 'image/png' || file.type === 'image/webp';
            
            if (isSupported) {
                setUploadedFile(file);
                setSvgOutput(null);
                addToast(t('fileLoaded'), 'success');
            } else {
                addToast("Formato não suportado. Use PNG ou WebP.", 'error');
            }
        }
    }, [addToast, t]);

    const processClipboardItems = useCallback((items: DataTransferItemList) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    handleFileAdd([file]);
                    return true;
                }
            }
        }
        return false;
    }, [handleFileAdd]);

    useEffect(() => {
        const handleGlobalPaste = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if ((target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) && target.id !== 'url-input-svg') {
                return;
            }
            const items = e.clipboardData?.items;
            if (!items) return;
            if (processClipboardItems(items)) {
                e.preventDefault();
            }
        };

        window.addEventListener('paste', handleGlobalPaste);
        return () => window.removeEventListener('paste', handleGlobalPaste);
    }, [processClipboardItems]);

    const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const items = e.clipboardData.items;
        if (processClipboardItems(items)) {
            e.preventDefault();
            setImageUrlInput('');
        }
    };

    const handleUrlLoad = async () => {
        if (!imageUrlInput.trim()) return;
        if (!imageUrlInput.match(/^https?:\/\/.+/)) {
            addToast(t('invalidUrl'), 'error');
            return;
        }

        setIsFetching(true);
        try {
            const response = await fetch(imageUrlInput);
            if (!response.ok) throw new Error('Failed to fetch image');
            const blob = await response.blob();
            if (!blob.type.startsWith('image/')) {
                 throw new Error('URL is not an image');
            }
            const filename = imageUrlInput.split('/').pop() || 'image.jpg';
            const file = new File([blob], filename, { type: blob.type });
            handleFileAdd([file]);
            setImageUrlInput('');
        } catch (error) {
            console.error(error);
            addToast(t('corsError'), 'error');
        } finally {
            setIsFetching(false);
        }
    };

    const handleConvert = async () => {
        if (!uploadedFile) return;
        setIsProcessing(true);
        try {
            const svg = await vectorizeImage(uploadedFile, { 
                colors: colorCount, 
                blur: blur,
                removeBackground: removeBackground,
                trim: trimSvg,
                ltres,
                qtres,
                pathomit,
                colorquantcycles
            });
            setSvgOutput(svg);
            addToast(t('conversionSuccess'), 'success');
        } catch (e) {
            console.error(e);
            addToast(t('conversionError'), 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!svgOutput) return;
        const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vectorized-${uploadedFile?.name.split('.')[0]}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSendToCodeEditor = () => {
        if (!svgOutput) return;
        // Salva no localStorage para 'ponte'
        localStorage.setItem('mediaTools_bridge_svg', svgOutput);
        // Redireciona via hash
        window.location.hash = '#/app/media-tools?tool=svg-to-code';
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
            <div className={panelClasses}>
                <FileUpload
                    title={t('imgToSvgUploadTitle')}
                    description="Selecione arquivos PNG ou WebP"
                    onFilesAdd={handleFileAdd}
                    onFileRemove={() => { setUploadedFile(null); setSvgOutput(null); }}
                    onFilesClear={() => { setUploadedFile(null); setSvgOutput(null); }}
                    acceptedFormats=".png,.webp"
                    isMultiple={false}
                    uploadedFile={uploadedFile}
                    icon={<UploadIcon className="w-10 h-10 text-zinc-600" />}
                />
                
                 <p className="text-xs text-zinc-500 mt-2 text-center">
                    Dica: Para melhores resultados na vetorização, utilize imagens PNG com fundo transparente (recortadas).
                </p>
                
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                    <p className="text-sm text-zinc-400 whitespace-nowrap">OU</p>
                    <div className="flex-grow w-full flex gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon className="h-4 w-4 text-zinc-500" />
                            </div>
                            <input
                                id="url-input-svg"
                                type="text"
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUrlLoad()}
                                onPaste={handleInputPaste}
                                placeholder={t('imageUrlPlaceholder')}
                                className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-md leading-5 bg-zinc-950 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-[#ff0e00] focus:border-[#ff0e00] sm:text-sm"
                                aria-label={t('pasteImageUrl')}
                            />
                        </div>
                        <button
                            onClick={handleUrlLoad}
                            disabled={!imageUrlInput.trim() || isFetching}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] dark:focus:ring-offset-zinc-900 text-sm font-medium"
                        >
                            {isFetching ? '...' : t('load')}
                        </button>
                    </div>
                </div>
            </div>

            {uploadedFile && (
                <div className={panelClasses}>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-4">{t('settings')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <NumberInput 
                            label={`${t('colors')}: ${colorCount}`}
                            value={colorCount}
                            onChange={setColorCount}
                            min={2}
                            max={64}
                            step={1}
                            aria-label={t('colors')}
                        />
                        <NumberInput 
                            label={`${t('blur')}: ${blur}`}
                            value={blur}
                            onChange={setBlur}
                            min={0}
                            max={5}
                            step={0.1}
                            aria-label={t('blur')}
                        />
                    </div>
                     <div className="mt-4 space-y-3 pt-4 border-t border-zinc-800">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={removeBackground}
                                onChange={(e) => setRemoveBackground(e.target.checked)}
                                className="rounded border-zinc-700 bg-zinc-900 text-[#ff0e00] focus:ring-[#ff0e00] cursor-pointer"
                            />
                            <span className="text-sm text-zinc-300">Remover Fundo (Auto)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={trimSvg}
                                onChange={(e) => setTrimSvg(e.target.checked)}
                                className="rounded border-zinc-700 bg-zinc-900 text-[#ff0e00] focus:ring-[#ff0e00] cursor-pointer"
                            />
                            <span className="text-sm text-zinc-300">Aparar Espaços Vazios (Trim)</span>
                        </label>
                    </div>
                    
                    {/* Advanced Settings */}
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                        <button onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} className="flex justify-between items-center w-full text-zinc-300 hover:text-white">
                            <span className="font-semibold text-sm">Configurações Avançadas de Qualidade</span>
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isAdvancedOpen && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                               <NumberInput 
                                    label="Nível de Detalhe"
                                    value={ltres}
                                    onChange={setLtres}
                                    min={0.1}
                                    max={10}
                                    step={0.1}
                                    title="Menor = mais detalhes. Padrão: 1"
                                />
                                <NumberInput 
                                    label="Suavização de Curvas"
                                    value={qtres}
                                    onChange={setQtres}
                                    min={0.1}
                                    max={10}
                                    step={0.1}
                                    title="Menor = curvas mais suaves. Padrão: 1"
                                />
                                <NumberInput 
                                    label="Redução de Ruído"
                                    value={pathomit}
                                    onChange={setPathomit}
                                    min={0}
                                    max={50}
                                    step={1}
                                    title="Maior = ignora mais 'sujeira' da imagem. Padrão: 8"
                                />
                                <NumberInput 
                                    label="Ciclos de Cor"
                                    value={colorquantcycles}
                                    onChange={setColorquantcycles}
                                    min={1}
                                    max={10}
                                    step={1}
                                    title="Mais ciclos = melhor quantização de cor. Padrão: 4"
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-6">
                         <button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="w-full flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#e00c00] transition-colors disabled:bg-zinc-800 disabled:text-zinc-500"
                        >
                            {isProcessing ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <RefreshIcon className="w-5 h-5" />
                            )}
                            {isProcessing ? t('converting') : t('convert')}
                        </button>
                    </div>
                </div>
            )}

            {svgOutput && (
                <div className={panelClasses}>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-4">{t('preview')}</h3>
                    <div className="bg-zinc-950/50 border border-zinc-700 rounded-lg p-4 flex justify-center mb-6">
                        <div dangerouslySetInnerHTML={{ __html: svgOutput }} className="max-w-full max-h-[400px] svg-preview" />
                    </div>
                     <div className="flex flex-col sm:flex-row gap-4">
                         <button
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                            <DownloadIcon className="w-6 h-6" />
                            {t('downloadSVG')}
                        </button>
                        <button
                            onClick={handleSendToCodeEditor}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#ff0e00]/10 text-[#ff0e00] border border-[#ff0e00]/30 font-bold py-3 px-4 rounded-lg hover:bg-[#ff0e00]/20 transition-colors"
                        >
                            <CodeBracketIcon className="w-6 h-6" />
                            Converter para Código (React)
                        </button>
                     </div>
                </div>
            )}
            
            <style>{`
                .svg-preview svg {
                    width: 100%;
                    height: 100%;
                    max-height: 400px;
                }
            `}</style>
        </div>
    );
};

export default ImgToSvg;
