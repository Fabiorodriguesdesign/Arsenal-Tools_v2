
import React, { useState, useEffect, useRef, useCallback } from 'react';
import FileUpload from '../FileUpload';
import { PngIcon, ImagePlusIcon, DownloadIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon, PlusIcon, EditIcon, LinkIcon, UnlinkIcon, MinusIcon } from '../icons';
import ProgressDisplay from '../common/ProgressDisplay';
import CompletionMessage from '../common/CompletionMessage';
import SeoTagsGenerator from '../common/SeoTagsGenerator';
import ToolSection from '../common/ToolSection';
import Checkbox from '../Checkbox';
import BackgroundEditorModal from './BackgroundEditorModal';
import { usePsdGenerator } from '../../hooks/usePsdGenerator';
import { getFileBaseName } from '../../utils';

const panelClasses = "bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:border-zinc-700";

// --- Funções Auxiliares de Desenho (Restauradas) ---
const drawImageContain = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | HTMLCanvasElement, padding = 0) => {
    const canvas = ctx.canvas;
    const paddingX = padding;
    const paddingY = padding;
    const availableWidth = canvas.width - 2 * paddingX;
    const availableHeight = canvas.height - 2 * paddingY;
    if (availableWidth <= 0 || availableHeight <= 0) return;
    const canvasRatio = availableWidth / availableHeight;
    const imgRatio = img.width / img.height;
    let dWidth, dHeight;
    if (imgRatio > canvasRatio) {
        dWidth = availableWidth;
        dHeight = dWidth / imgRatio;
    } else {
        dHeight = availableHeight;
        dWidth = dHeight * imgRatio;
    }
    const dx = paddingX + (availableWidth - dWidth) / 2;
    const dy = paddingY + (availableHeight - dHeight) / 2;
    ctx.drawImage(img, dx, dy, dWidth, dHeight);
};

const trimImage = (img: HTMLImageElement): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const alpha = data[(y * canvas.width + x) * 4 + 3];
            if (alpha > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    if (maxX === -1) {
        const emptyCanvas = document.createElement('canvas');
        emptyCanvas.width = 1; emptyCanvas.height = 1;
        return emptyCanvas;
    }
    const trimmedWidth = maxX - minX + 1;
    const trimmedHeight = maxY - minY + 1;
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;
    const trimmedCtx = trimmedCanvas.getContext('2d')!;
    trimmedCtx.drawImage(canvas, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);
    return trimmedCanvas;
};

const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = ctx.canvas;
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let sx, sy, sWidth, sHeight;
    if (imgRatio > canvasRatio) {
        sHeight = img.height; sWidth = sHeight * canvasRatio;
        sx = (img.width - sWidth) / 2; sy = 0;
    } else {
        sWidth = img.width; sHeight = sWidth / canvasRatio;
        sy = (img.height - sHeight) / 2; sx = 0;
    }
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
};

const PsdGenerator: React.FC = () => {
    const {
        step, setStep,
        foregroundImages, setForegroundImages,
        backgroundImage, setBackgroundImage,
        backgroundSettings, setBackgroundSettings,
        canvasWidth,
        canvasHeight,
        padding, setPadding,
        trim, setTrim,
        isDimensionsLinked, setIsDimensionsLinked,
        isGenerating,
        progress,
        processedCount,
        isCompleted,
        previewIndex, setPreviewIndex,
        isBgEditorOpen, setIsBgEditorOpen,
        canvasRef,
        t,
        handleForegroundAdd,
        handleBackgroundAdd,
        handleClear: handleClearFromHook,
        handleDimensionChange,
        handleGeneratePsd,
        drawBackground,
        MAX_DIMENSION
    } = usePsdGenerator();

    const [hasUserChosenBackground, setHasUserChosenBackground] = useState(false);

    const handleBackgroundAddWrapper = (files: File[]) => {
        handleBackgroundAdd(files);
        setHasUserChosenBackground(true);
    };

    const handleClear = () => {
        handleClearFromHook();
        setHasUserChosenBackground(false);
    };

    // Lógica de Pré-visualização
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || step !== 2) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    
        const fgFile = foregroundImages[previewIndex];
        let bgUrl: string | null = null;
        let fgUrl: string | null = null;
    
        const drawAll = () => {
            const bgImg = new Image();
            const fgImg = new Image();
    
            let bgLoaded = !backgroundImage;
            let fgLoaded = !fgFile;
    
            const onBothLoaded = () => {
                if (!bgLoaded || !fgLoaded) return;
    
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
                if (backgroundImage) {
                    drawImageCover(ctx, bgImg);
                } else {
                    drawBackground(ctx);
                }
    
                let imageToDraw: HTMLImageElement | HTMLCanvasElement = fgImg;
                if (trim) {
                    imageToDraw = trimImage(fgImg);
                }
                drawImageContain(ctx, imageToDraw, padding);

                // --- Visualização da Margem (Zona Proibida) ---
                if (padding > 0) {
                    ctx.fillStyle = 'rgba(255, 14, 0, 0.15)'; // #ff0e00 com opacidade
                    // Top
                    ctx.fillRect(0, 0, canvasWidth, padding);
                    // Bottom
                    ctx.fillRect(0, canvasHeight - padding, canvasWidth, padding);
                    // Left
                    ctx.fillRect(0, padding, padding, canvasHeight - (padding * 2));
                    // Right
                    ctx.fillRect(canvasWidth - padding, padding, padding, canvasHeight - (padding * 2));
        
                    // Borda tracejada para a zona segura
                    ctx.strokeStyle = 'rgba(255, 14, 0, 0.6)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([10, 10]);
                    ctx.strokeRect(padding, padding, canvasWidth - (padding * 2), canvasHeight - (padding * 2));
                    ctx.setLineDash([]); // Reseta para outras operações de desenho
                }
    
                if (bgUrl) URL.revokeObjectURL(bgUrl);
                if (fgUrl) URL.revokeObjectURL(fgUrl);
            };
    
            if (backgroundImage) {
                bgUrl = URL.createObjectURL(backgroundImage);
                bgImg.src = bgUrl;
                bgImg.onload = () => { bgLoaded = true; onBothLoaded(); };
            } else {
                drawBackground(ctx);
            }
    
            if (fgFile) {
                fgUrl = URL.createObjectURL(fgFile);
                fgImg.src = fgUrl;
                fgImg.onload = () => { fgLoaded = true; onBothLoaded(); };
            }
        };
    
        drawAll();
    
        return () => {
            if (bgUrl) URL.revokeObjectURL(bgUrl);
            if (fgUrl) URL.revokeObjectURL(fgUrl);
        };
    }, [step, foregroundImages, previewIndex, backgroundImage, backgroundSettings, canvasWidth, canvasHeight, padding, trim, drawBackground]);


    const handlePaddingChange = (newValue: number) => {
        const clampedValue = Math.max(0, Math.min(1000, newValue));
        setPadding(clampedValue);
    };

    const getPreviewName = useCallback(() => {
        if (!foregroundImages[previewIndex]) return '';
        const baseName = getFileBaseName(foregroundImages[previewIndex].name);
        return `${baseName}.psd`;
    }, [foregroundImages, previewIndex]);

    const canContinue = foregroundImages.length > 0 && hasUserChosenBackground;

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-10 pb-20">
            {isBgEditorOpen && (
                <BackgroundEditorModal
                    isOpen={isBgEditorOpen} onClose={() => setIsBgEditorOpen(false)}
                    initialSettings={backgroundSettings}
                    onSave={(newSettings) => { 
                        setBackgroundSettings(newSettings); 
                        setIsBgEditorOpen(false); 
                        setHasUserChosenBackground(true);
                    }}
                />
            )}
            <div className="flex items-center justify-center gap-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#ff0e00]' : 'text-zinc-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[#ff0e00] text-white' : 'bg-zinc-800'}`}>1</div>
                    <span className="font-semibold">Upload</span>
                </div>
                <div className={`w-16 h-0.5 transition-colors ${step > 1 ? 'bg-[#ff0e00]' : 'bg-zinc-800'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#ff0e00]' : 'text-zinc-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#ff0e00] text-white' : 'bg-zinc-800'}`}>2</div>
                    <span className="font-semibold">Edição & Geração</span>
                </div>
            </div>

            {step === 1 && (
                <div className="animate-fade-in">
                    <div className="text-center mb-8 max-w-3xl mx-auto">
                        <p className="text-zinc-400 pt-8">
                            Carregue suas imagens de produto (PNG com fundo transparente) e escolha um fundo. Para melhor performance, o processamento em lote é limitado a {50} arquivos.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ToolSection title="1. Produto / Frente">
                            <FileUpload
                                title={t('selectPNGs')} description={t('transparentPngsOnly')}
                                onFilesAdd={handleForegroundAdd} onFileRemove={(i) => setForegroundImages(f => f.filter((_, idx) => idx !== i))}
                                onFilesClear={() => setForegroundImages([])} acceptedFormats="image/png" isMultiple={true}
                                uploadedFile={foregroundImages} icon={<PngIcon className="w-10 h-10 text-zinc-600 mx-auto" />}
                            />
                        </ToolSection>
                        
                        <ToolSection title="2. Fundo / Cenário">
                            <div className={`relative space-y-4`}>
                                {!backgroundImage && (
                                    <div className="animate-fade-in space-y-2">
                                        <div className="flex bg-zinc-800/50 p-1 rounded-lg">
                                            {(['color', 'gradient', 'pattern'] as const).map(mode => (
                                                <button 
                                                    key={mode} 
                                                    onClick={() => {
                                                        setBackgroundSettings(s => ({ ...s, mode }));
                                                        setHasUserChosenBackground(true);
                                                    }} 
                                                    className={`flex-1 text-xs font-bold py-2 rounded ${backgroundSettings.mode === mode ? 'bg-[#ff0e00] text-white' : 'text-zinc-300'}`}
                                                >
                                                    {mode === 'color' ? 'Cor Sólida' : mode === 'gradient' ? 'Gradiente' : 'Padrão'}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => setIsBgEditorOpen(true)} className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 py-2 rounded-lg">
                                            <EditIcon className="w-4 h-4"/> Editar Fundo
                                        </button>
                                    </div>
                                )}
                            
                                <FileUpload
                                    title="Imagem de Fundo (Opcional)" description="Arraste ou selecione JPG/PNG"
                                    onFilesAdd={handleBackgroundAddWrapper} onFilesClear={() => { setBackgroundImage(null); setHasUserChosenBackground(false); }}
                                    onFileRemove={() => {}} acceptedFormats="image/jpeg, image/png" isMultiple={false}
                                    uploadedFile={backgroundImage} icon={<ImagePlusIcon className="w-10 h-10 text-zinc-600 mx-auto" />}
                                />
                            </div>
                        </ToolSection>

                        <div className="col-span-1 md:col-span-2 flex justify-end items-center mt-4 gap-4">
                            <button onClick={handleClear} className="p-2 text-zinc-500 hover:text-red-500 transition-colors" title="Limpar tudo e recomeçar">
                                <TrashIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!canContinue}
                                className="flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#e00c00] transition-colors text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continuar <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {step === 2 && (
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 animate-fade-in">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" /> Voltar para Uploads
                        </button>
                        
                        <ToolSection title="Layout & Ajustes">
                            <div className="space-y-4">
                               <div className="grid grid-cols-5 gap-2 items-end">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Largura (px)</label>
                                        <input type="number" value={canvasWidth} onChange={(e) => handleDimensionChange('width', parseInt(e.target.value))} max={MAX_DIMENSION} className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 text-sm"/>
                                    </div>
                                    <div className="col-span-1 flex justify-center pb-2">
                                        <button
                                            onClick={() => setIsDimensionsLinked(!isDimensionsLinked)}
                                            className={`p-2 rounded-full hover:bg-zinc-800 text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ff0e00] transition-all ${isDimensionsLinked ? 'bg-[#ff0e00]/10 text-[#ff0e00]' : ''}`}
                                            title={isDimensionsLinked ? "Desvincular proporções" : "Vincular proporções"}
                                        >
                                            {isDimensionsLinked ? <LinkIcon className="w-5 h-5" /> : <UnlinkIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Altura (px)</label>
                                        <input type="number" value={canvasHeight} onChange={(e) => handleDimensionChange('height', parseInt(e.target.value))} max={MAX_DIMENSION} className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 text-sm"/>
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-500 text-center -mt-2">Limite de {MAX_DIMENSION}px para estabilidade.</p>
                                
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Margem (Padding)</label>
                                    <div className="flex items-center gap-3 bg-zinc-950 p-2 rounded-lg border border-zinc-700">
                                        <button onClick={() => handlePaddingChange(padding - 50)} className="p-2 bg-zinc-800 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors" aria-label="Diminuir margem"><MinusIcon className="w-4 h-4"/></button>
                                        <div className="relative flex-grow">
                                            <input type="range" min="0" max="500" step="10" value={padding} onChange={e => handlePaddingChange(Number(e.target.value))} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00]"/>
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono bg-zinc-950 border border-zinc-700 px-2 py-0.5 rounded text-zinc-200">{padding}px</span>
                                        </div>
                                        <button onClick={() => handlePaddingChange(padding + 50)} className="p-2 bg-zinc-800 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors" aria-label="Aumentar margem"><PlusIcon className="w-4 h-4"/></button>
                                    </div>
                                </div>

                                <Checkbox checked={trim} onChange={(e) => setTrim(e.target.checked)} label={
                                    <div>
                                        <span className="text-zinc-200 font-medium">Remover Transparência (Trim)</span>
                                        <p className="text-xs text-zinc-500">Remove o espaço vazio ao redor da imagem.</p>
                                    </div>
                                } />
                            </div>
                        </ToolSection>

                        {foregroundImages.length > 0 && (
                            <SeoTagsGenerator files={[foregroundImages[previewIndex]]} t={t} />
                        )}
                    </div>
                    
                    <div className="lg:col-span-3 flex flex-col gap-8">
                        <ToolSection title="Pré-Visualização">
                            <div className="w-full bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 p-4 relative aspect-square shadow-inner">
                                <canvas ref={canvasRef} className="max-w-full max-h-full object-contain shadow-2xl border border-zinc-800 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZHRoPSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMjIyIiAvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMjIyIiAvPjwvc3ZnPg==')] bg-repeat" />
                            </div>
                            {foregroundImages.length > 1 && (
                                <div className="flex items-center justify-between w-full max-w-xs mx-auto mt-4">
                                    <button onClick={() => setPreviewIndex(p => (p - 1 + foregroundImages.length) % foregroundImages.length)} className="p-2 rounded-full bg-[#ff0e00] text-white hover:bg-[#e00c00]"><ArrowLeftIcon className="w-5 h-5"/></button>
                                    <span className="font-medium text-zinc-200">{previewIndex + 1} / {foregroundImages.length}</span>
                                    <button onClick={() => setPreviewIndex(p => (p + 1) % foregroundImages.length)} className="p-2 rounded-full bg-[#ff0e00] text-white hover:bg-[#e00c00]"><ArrowRightIcon className="w-5 h-5"/></button>
                                </div>
                            )}
                            
                            <div className="text-center mt-2">
                                <p className="text-xs text-zinc-400">
                                    Original: <span className="text-zinc-500">{foregroundImages[previewIndex]?.name}</span>
                                </p>
                                <p className="text-xs text-zinc-200 mt-1 font-semibold">
                                    Saída: <span className="text-[#ff0e00]">{getPreviewName()}</span>
                                </p>
                            </div>
                        </ToolSection>
                        
                        <div className={`${panelClasses} sticky bottom-4 z-20 shadow-2xl border-[#ff0e00]/20`}>
                            {isCompleted ? (
                                <CompletionMessage onClear={handleClear} t={t} />
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {isGenerating && <ProgressDisplay progress={progress} processedCount={processedCount} totalFiles={foregroundImages.length} t={t} />}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button onClick={handleClear} className="sm:flex-1 py-3 px-6 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700"><span className="flex items-center justify-center gap-2"><TrashIcon className="w-5 h-5"/>{t('reset')}</span></button>
                                        <button onClick={handleGeneratePsd} disabled={isGenerating} className="flex-[2] flex items-center justify-center gap-3 bg-[#ff0e00] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#e00c00] transition-all disabled:bg-zinc-800 disabled:text-zinc-500">
                                            {isGenerating ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>{t('processing')}...</> : <><DownloadIcon className="w-6 h-6"/><span className="text-lg">Gerar PSD{foregroundImages.length > 1 ? `'s (${foregroundImages.length})` : ''}</span></>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default PsdGenerator;
