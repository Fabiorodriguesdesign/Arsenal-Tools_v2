import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from './useTranslation';
import { useFormPersistence } from './useFormPersistence';
import { useToast } from '../context/ToastContext';
import { ColorConverterFormData } from '../types/color';
import { createAseFile, isValidHex, slugify } from '../utils/colorConverter';

const INITIAL_STATE: ColorConverterFormData = {
    paletteName: 'Minha Paleta',
    colors: ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'],
    newColor: '#E2E8F0'
};

export const useColorConverter = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Persistent State
    const [formData, setFormData] = useFormPersistence<ColorConverterFormData>('colorConverterData', {
        ...INITIAL_STATE,
        paletteName: t('color.defaultPaletteName') // Initialize with localized name if possible, otherwise fallback
    });

    // Transient UI State
    const [imageUrl, setImageUrl] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [step, setStep] = useState(1);

    // --- Global Paste Listener ---
    useEffect(() => {
        const handlePaste = async (e: ClipboardEvent) => {
            // We assume this hook is only active when the component is mounted
            const items = e.clipboardData?.items;
            if (!items) return;

            let imageFound = false;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        e.preventDefault(); 
                        imageFound = true;
                        const url = URL.createObjectURL(blob);
                        await processImage(url);
                    }
                    break; 
                }
            }

            if (!imageFound && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                if (items.length > 0) {
                     addToast(t('color.errors.noImageInClipboard'), 'info');
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [t, addToast]);

    // --- Color Extraction ---
    const processImage = async (src: string) => {
        setIsExtracting(true);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Canvas context not available');

                const maxSize = 150;
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const imageData = ctx.getImageData(0, 0, width, height).data;
                const colorCounts: Record<string, number> = {};

                for (let i = 0; i < imageData.length; i += 4 * 5) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    const a = imageData[i + 3];

                    if (a < 128) continue; 

                    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
                }

                const sortedColors = Object.entries(colorCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(entry => entry[0]);

                const extracted = sortedColors.slice(0, 5);
                
                if (extracted.length > 0) {
                    setFormData(prev => ({ ...prev, colors: extracted }));
                    setStep(2);
                    addToast(t('color.extractFromImage.success') || "Cores extraídas com sucesso!", 'success');
                } else {
                    addToast(t('color.errors.invalidImage'), 'error');
                }

            } catch (e) {
                console.error(e);
                addToast(t('color.errors.cors'), 'error');
            } finally {
                setIsExtracting(false);
            }
        };

        img.onerror = () => {
            setIsExtracting(false);
            addToast(t('color.errors.cors'), 'error');
        };
    };

    // --- Actions ---
    const addColor = () => {
        if (formData.colors.length < 10 && formData.newColor && isValidHex(formData.newColor)) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, prev.newColor],
                newColor: '#E2E8F0'
            }));
        }
    };

    const removeColor = (index: number) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const updateColor = (index: number, value: string) => {
        const hex = value.toUpperCase();
        setFormData(prev => {
            const newColors = [...prev.colors];
            newColors[index] = hex;
            return { ...prev, colors: newColors };
        });
    };

    const downloadFile = (filename: string, blob: Blob) => {
        const element = document.createElement('a');
        element.href = URL.createObjectURL(blob);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
    };

    const handleExport = (format: 'png' | 'css' | 'scss' | 'less' | 'ase') => {
        const name = slugify(formData.paletteName) || 'palette';
        const colors = formData.colors;

        switch (format) {
            case 'png':
                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    const swatchWidth = 100;
                    const swatchHeight = 120;
                    const padding = 10;
                    canvas.width = (swatchWidth + padding) * colors.length + padding;
                    canvas.height = swatchHeight + 60;

                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.fillStyle = '#1f2937';
                    ctx.font = 'bold 20px sans-serif';
                    ctx.fillText(formData.paletteName, padding, 35);

                    colors.forEach((color, i) => {
                        if (!isValidHex(color)) return;
                        const x = padding + i * (swatchWidth + padding);
                        ctx.fillStyle = color;
                        ctx.fillRect(x, 50, swatchWidth, 70);
                        
                        ctx.fillStyle = '#4b5563';
                        ctx.font = '14px monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText(color.toUpperCase(), x + swatchWidth / 2, 50 + 70 + 20);
                    });
                    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            downloadFile(`${name}.png`, blob);
                        }
                    }, 'image/png');
                }
                break;
            case 'css':
                const cssVars = colors.map((color, i) => `  --${name}-color-${i + 1}: ${color};`).join('\n');
                downloadFile(`${name}.css`, new Blob([`:root {\n${cssVars}\n}`], { type: 'text/css' }));
                break;
            case 'scss':
                const scssVars = colors.map((color, i) => `$${name}-color-${i + 1}: ${color};`).join('\n');
                downloadFile(`${name}.scss`, new Blob([scssVars], { type: 'text/x-scss' }));
                break;
            case 'less':
                const lessVars = colors.map((color, i) => `@${name}-color-${i + 1}: ${color};`).join('\n');
                downloadFile(`${name}.less`, new Blob([lessVars], { type: 'text/less' }));
                break;
            case 'ase': {
                const validColors = colors.filter(isValidHex);
                if (validColors.length > 0) {
                    const aseBlob = createAseFile(formData.paletteName, validColors);
                    downloadFile(`${name}.ase`, aseBlob);
                }
                break;
            }
        }
    };

    return {
        // State
        formData,
        setFormData,
        imageUrl,
        setImageUrl,
        isExtracting,
        step,
        setStep,
        canvasRef,
        
        // Actions
        processImage,
        addColor,
        removeColor,
        updateColor,
        handleExport
    };
};