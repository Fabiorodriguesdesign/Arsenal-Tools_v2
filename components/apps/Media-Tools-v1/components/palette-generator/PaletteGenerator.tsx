

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FileUpload from '../FileUpload';
import { PaletteIcon, LinkIcon, MinusIcon, PlusIcon } from '../icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import PaletteDisplay from './PaletteDisplay';
import { createWorker, PALETTE_WORKER_CODE } from '../../utils';

const panelClasses = "bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md";
const MIN_COLORS = 2;
const MAX_COLORS = 12;

const PaletteGenerator: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [colorCount, setColorCount] = useState(6);
    const [palette, setPalette] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const { t } = useLanguage();
    const { addToast } = useToast();

    const imageUrl = useMemo(() => imageFile ? URL.createObjectURL(imageFile) : null, [imageFile]);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const handleFileAdd = useCallback((files: File[]) => {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            addToast(t('filesAdded', { count: 1 }), 'success');
        } else {
            addToast(t('jpgPngOnly'), 'warning'); 
        }
    }, [t, addToast]);

    // Lógica compartilhada para processar itens colados (ClipboardItems)
    const processClipboardItems = useCallback((items: DataTransferItemList) => {
        for (let i = 0; i < items.length; i++) {
            // Procura por itens que sejam imagens
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    handleFileAdd([file]);
                    return true; // Imagem encontrada e processada
                }
            }
        }
        return false; // Nenhuma imagem encontrada
    }, [handleFileAdd]);

    // Listener global para Colar (Paste)
    useEffect(() => {
        const handleGlobalPaste = (e: ClipboardEvent) => {
            // Ignora se o alvo do evento for um input ou textarea (exceto o nosso input específico que tem seu próprio handler)
            const target = e.target as HTMLElement;
            if ((target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) && target.id !== 'url-input') {
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

    // Listener de colar específico para o Input de URL
    const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const items = e.clipboardData.items;
        if (processClipboardItems(items)) {
            e.preventDefault(); // Impede a colagem do texto se uma imagem foi encontrada
            setImageUrlInput(''); // Limpa o input para evitar confusão
        }
        // Se não encontrou imagem, deixa o comportamento padrão acontecer (colar texto/URL)
    };

    const handleUrlLoad = async () => {
        if (!imageUrlInput.trim()) return;

        // Basic validation
        if (!imageUrlInput.match(/^https?:\/\/.+/)) {
            addToast(t('invalidUrl'), 'error');
            return;
        }

        setIsLoading(true);
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
            // Suggest the user saves/uploads or pastes data if fetch fails (likely CORS)
            addToast(t('corsError'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleColorChange = useCallback((index: number, newColor: string) => {
        setPalette(prevPalette => {
            const newPalette = [...prevPalette];
            newPalette[index] = newColor;
            return newPalette;
        });
    }, []);

    useEffect(() => {
        if (!imageFile) {
            setPalette([]);
            return;
        }

        let worker: Worker | null = null;

        const runWorker = async () => {
            setIsLoading(true);
            try {
                const workerUrl = createWorker(PALETTE_WORKER_CODE);
                worker = new Worker(workerUrl);
                URL.revokeObjectURL(workerUrl);

                worker.onmessage = (e: MessageEvent) => {
                    if (e.data.error) {
                        addToast(e.data.error, 'error');
                    } else {
                        setPalette(e.data.palette);
                    }
                    setIsLoading(false);
                    worker?.terminate();
                };

                worker.onerror = (e) => {
                    addToast(t('workerError'), 'error');
                    console.error('Palette worker error:', e);
                    setIsLoading(false);
                    worker?.terminate();
                };

                worker.postMessage({ file: imageFile, colorCount });

            } catch (error) {
                addToast(t('workerError'), 'error');
                console.error('Failed to create palette worker:', error);
                setIsLoading(false);
            }
        };

        runWorker();
        
        return () => {
            worker?.terminate();
        };

    }, [imageFile, colorCount, addToast, t]);

    const handleClear = useCallback(() => {
        setImageFile(null);
        setImageUrlInput('');
    }, []);

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className={panelClasses}>
                <FileUpload
                    title={t('paletteGeneratorTitle')}
                    description={`${t('anyImageFile')} • Ctrl+V`}
                    onFilesAdd={handleFileAdd}
                    onFileRemove={() => {}}
                    onFilesClear={handleClear}
                    acceptedFormats="image/*"
                    isMultiple={false}
                    uploadedFile={imageFile}
                    icon={<PaletteIcon className="w-10 h-10 text-zinc-600" />}
                />
                 <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                    <p className="text-sm text-zinc-400 whitespace-nowrap">{t('or')}</p>
                    <div className="flex-grow w-full flex gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon className="h-4 w-4 text-zinc-500" />
                            </div>
                            <input
                                id="url-input"
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
                            disabled={!imageUrlInput.trim() || isLoading}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] dark:focus:ring-offset-zinc-900 text-sm font-medium"
                        >
                            {isLoading ? '...' : t('load')}
                        </button>
                    </div>
                </div>
            </div>
            {imageFile && (
                <>
                    <div className={panelClasses}>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">{t('preview')}</h3>
                        <div className="w-full flex justify-center bg-zinc-950/50 p-2 rounded-md border border-zinc-800">
                             <img src={imageUrl!} alt={imageFile.name} className="max-w-full max-h-64 object-contain rounded-sm" />
                        </div>
                    </div>
                    <div className={panelClasses}>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Settings</h3>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                {t('colorQuantity', { count: colorCount })}
                            </label>
                            <div className="flex items-center justify-center gap-4 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800 max-w-xs mx-auto">
                                <button
                                    onClick={() => setColorCount(c => Math.max(MIN_COLORS, c - 1))}
                                    disabled={colorCount <= MIN_COLORS}
                                    className="p-2 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff0e00]"
                                    aria-label={t('decreaseColorCount')}
                                >
                                    <MinusIcon className="w-5 h-5" />
                                </button>
                                <span className="text-lg font-bold text-zinc-100 tabular-nums w-8 text-center">{colorCount}</span>
                                <button
                                    onClick={() => setColorCount(c => Math.min(MAX_COLORS, c + 1))}
                                    disabled={colorCount >= MAX_COLORS}
                                    className="p-2 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff0e00]"
                                    aria-label={t('increaseColorCount')}
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={panelClasses}>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">{t('extractedPalette')}</h3>
                        <PaletteDisplay 
                            palette={palette} 
                            isLoading={isLoading} 
                            t={t} 
                            onColorChange={handleColorChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default PaletteGenerator;