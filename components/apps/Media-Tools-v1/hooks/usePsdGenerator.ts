
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
// FIX: Split import to correctly reference getFileBaseName from ../utils and generateSmartName from ../utils/seo.
import { generateSmartName } from '../utils/seo';
import { getFileBaseName } from '../utils';
import { generatePsd } from '../services/psdService';
import { BackgroundSettings } from '../components/psd-generator/types';

declare var JSZip: any;

const FILE_LIMIT = 50;
const MAX_DIMENSION = 8000;
export type ResizeMode = 'custom' | 'original' | 'fixed-width';
export type SeparatorType = '-' | '_' | ' ' | '.';
export type RenameMode = 'base' | 'smart';


export const usePsdGenerator = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    
    // UI State
    const [step, setStep] = useState(1);
    
    // File State
    const [foregroundImages, setForegroundImages] = useState<File[]>([]);
    const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
    
    // Settings State
    const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
        mode: 'color',
        solidColor: '#FFFFFF',
        gradient: { from: '#ff9a9e', to: '#fad0c4', angle: 0 },
        pattern: { type: 'checkerboard', color1: '#CCCCCC', color2: '#FFFFFF', scale: 20 }
    });
    const [canvasWidth, setCanvasWidth] = useState(1080);
    const [canvasHeight, setCanvasHeight] = useState(1080);
    const [padding, setPadding] = useState(50);
    const [trim, setTrim] = useState(true);
    const [isDimensionsLinked, setIsDimensionsLinked] = useState(true);
    const [resizeMode, setResizeMode] = useState<ResizeMode>('custom');
    const [renameMode, setRenameMode] = useState<RenameMode>('smart');
    const [baseName, setBaseName] = useState('');
    const [nameSeparator, setNameSeparator] = useState<SeparatorType>(' ');
    
    // Processing State
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string | null>(null);
    
    // Preview State
    const [previewIndex, setPreviewIndex] = useState(0);
    const [isBgEditorOpen, setIsBgEditorOpen] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Handlers
    const handleForegroundAdd = (newFiles: File[]) => {
        const pngFiles = newFiles.filter(file => file.type === 'image/png');
        if (pngFiles.length < newFiles.length) addToast(t('transparentPngsOnly'), 'warning');

        setForegroundImages(current => {
            const combined = [...current, ...pngFiles];
             if (combined.length > FILE_LIMIT) {
                addToast(t('fileLimitExceeded', { limit: FILE_LIMIT }), 'warning');
                return combined.slice(0, FILE_LIMIT);
            }
            return combined;
        });
        if(isCompleted) setIsCompleted(false);
    };

    const handleBackgroundAdd = (files: File[]) => {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            setBackgroundImage(file);
            if(isCompleted) setIsCompleted(false);
        } else {
            addToast(t('jpgPngOnly'), 'warning');
        }
    };

    const handleClear = () => {
        setForegroundImages([]);
        setBackgroundImage(null);
        setBackgroundSettings({
            mode: 'color', solidColor: '#FFFFFF',
            gradient: { from: '#ff9a9e', to: '#fad0c4', angle: 0 },
            pattern: { type: 'checkerboard', color1: '#CCCCCC', color2: '#FFFFFF', scale: 20 }
        });
        setPadding(50);
        setTrim(true);
        setStep(1);
        setIsCompleted(false);
        if(generatedPreviewUrl) URL.revokeObjectURL(generatedPreviewUrl);
        setGeneratedPreviewUrl(null);
    };

    const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
        const clampedValue = Math.max(1, Math.min(MAX_DIMENSION, value));
    
        if (isDimensionsLinked && resizeMode === 'custom' && canvasWidth > 0 && canvasHeight > 0) {
            const aspectRatio = canvasWidth / canvasHeight;
            if (dimension === 'width') {
                setCanvasWidth(clampedValue);
                setCanvasHeight(Math.max(1, Math.round(clampedValue / aspectRatio)));
            } else {
                setCanvasHeight(clampedValue);
                setCanvasWidth(Math.max(1, Math.round(clampedValue * aspectRatio)));
            }
        } else {
            if (dimension === 'width') setCanvasWidth(clampedValue);
            else setCanvasHeight(clampedValue);
        }
    };
    
    const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
        const { width, height } = ctx.canvas;
        switch(backgroundSettings.mode) {
            case 'color':
                ctx.fillStyle = backgroundSettings.solidColor;
                ctx.fillRect(0, 0, width, height);
                break;
            case 'gradient':
                const { from, to, angle } = backgroundSettings.gradient;
                let x0=0, y0=0, x1=0, y1=height;
                if (angle === 45) { x1 = width; y1 = height; }
                else if (angle === 90) { x1 = width; y1 = 0; }
                else if (angle === 135) { x0 = width; x1 = 0; y1 = height; }
                const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
                gradient.addColorStop(0, from);
                gradient.addColorStop(1, to);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                break;
            case 'pattern':
                const p = backgroundSettings.pattern;
                const pCanvas = document.createElement('canvas');
                pCanvas.width = p.scale; pCanvas.height = p.scale;
                const pCtx = pCanvas.getContext('2d')!;
                pCtx.fillStyle = p.color1;
                pCtx.fillRect(0, 0, p.scale, p.scale);
                pCtx.fillStyle = p.color2;
                if (p.type === 'checkerboard') {
                    pCtx.fillRect(0, 0, p.scale / 2, p.scale / 2);
                    pCtx.fillRect(p.scale / 2, p.scale / 2, p.scale / 2, p.scale / 2);
                } else if (p.type === 'stripes') pCtx.fillRect(0, 0, p.scale, p.scale / 2);
                else if (p.type === 'dots') {
                    pCtx.beginPath();
                    pCtx.arc(p.scale / 2, p.scale / 2, p.scale / 4, 0, 2 * Math.PI);
                    pCtx.fill();
                }
                const pattern = ctx.createPattern(pCanvas, 'repeat')!;
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, width, height);
                break;
        }
    }, [backgroundSettings]);

    const createGeneratedBackground = async (): Promise<File | null> => {
        if (backgroundImage) return backgroundImage;
        if (backgroundSettings.mode === 'color') return null;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if(!tempCtx) return null;

        drawBackground(tempCtx);

        const blob = await new Promise<Blob | null>(resolve => tempCanvas.toBlob(resolve, 'image/png'));
        return blob ? new File([blob], 'generated_bg.png', { type: 'image/png' }) : null;
    };

    const handleGeneratePsd = async () => {
        if (foregroundImages.length === 0) return;
    
        setIsGenerating(true);
        setProgress(0);
        setProcessedCount(0);
        setIsCompleted(false);
        if (generatedPreviewUrl) URL.revokeObjectURL(generatedPreviewUrl);
        setGeneratedPreviewUrl(null);
    
        const finalBackgroundFile = await createGeneratedBackground();
    
        try {
            const zip = new JSZip();
            
            // Generate preview for first image
            const firstPreviewResult = await generatePsd({
                foregroundFile: foregroundImages[0], backgroundFile: finalBackgroundFile,
                backgroundColor: backgroundSettings.solidColor, padding, canvasWidth, canvasHeight,
                customFileName: 'preview', trim
            });
            if (firstPreviewResult.previewBlob) {
                setGeneratedPreviewUrl(URL.createObjectURL(firstPreviewResult.previewBlob));
            }

            for (let i = 0; i < foregroundImages.length; i++) {
                const file = foregroundImages[i];
                try {
                    let finalFileName;
                    if (renameMode === 'smart') {
                        finalFileName = generateSmartName(file.name, nameSeparator);
                    } else {
                        finalFileName = baseName ? `${baseName.trim()}-${i + 1}` : getFileBaseName(file.name);
                    }

                    const { psdBlob, previewBlob, filename } = await generatePsd({
                        foregroundFile: file, backgroundFile: finalBackgroundFile,
                        backgroundColor: backgroundSettings.solidColor, padding, canvasWidth, canvasHeight,
                        customFileName: finalFileName, trim
                    });
    
                    let psdZipName = `${filename}.psd`;
                    let jpgZipName = `${filename}.jpg`;
                    
                    let counter = 1;
                    while(zip.file(psdZipName)) {
                        psdZipName = `${filename}_${counter}.psd`;
                        jpgZipName = `${filename}_${counter}.jpg`;
                        counter++;
                    }
                    zip.file(psdZipName, psdBlob);
                    zip.file(jpgZipName, previewBlob);
    
                } catch (err) { 
                    console.error(`Error processing ${file.name}`, err);
                }
                
                setProcessedCount(i + 1);
                setProgress(Math.round(((i + 1) / foregroundImages.length) * 100));
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipName = foregroundImages.length === 1 
                ? `kit-${getFileBaseName(foregroundImages[0].name)}.zip` 
                : "PSD_Batch_Kit.zip";
            
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a'); a.href = url; a.download = zipName;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
    
            addToast(t('downloadStarted'), 'success');
            setIsCompleted(true);
        } catch (error) {
            console.error(error);
            const msg = (error instanceof Error) ? error.message : String(error);
            if (msg.includes('Array buffer allocation failed')) {
                addToast("Erro: Imagem muito grande para processar. Tente dimensões menores.", 'error');
            } else {
                addToast(t('errorProcessingFiles'), 'error');
            }
        } finally {
            setIsGenerating(false);
        }
    };
    
    return {
        step, setStep,
        foregroundImages, setForegroundImages,
        backgroundImage, setBackgroundImage,
        backgroundSettings, setBackgroundSettings,
        canvasWidth, setCanvasWidth,
        canvasHeight, setCanvasHeight,
        padding, setPadding,
        trim, setTrim,
        isDimensionsLinked, setIsDimensionsLinked,
        resizeMode, setResizeMode,
        renameMode, setRenameMode,
        baseName, setBaseName,
        nameSeparator, setNameSeparator,
        isGenerating,
        progress,
        processedCount,
        isCompleted,
        generatedPreviewUrl,
        previewIndex, setPreviewIndex,
        isBgEditorOpen, setIsBgEditorOpen,
        canvasRef,
        t,
        handleForegroundAdd,
        handleBackgroundAdd,
        handleClear,
        handleDimensionChange,
        handleGeneratePsd,
        drawBackground,
        MAX_DIMENSION
    };
};
